import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Product from "@/models/Product";

// Utility to save a single image
async function saveImageToDisk(image) {
    const timestamp = Date.now();
    const imageName = `${timestamp}-${image.name}`;
    const imagePath = path.join(process.cwd(), 'public', 'images', imageName);

    const buffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(imagePath, buffer);

    return `/images/${imageName}`; // Relative path for storing in DB
}

export async function POST(req) {
    await connectDB();

    try {
        const data = await req.formData();

        const title = data.get("title");
        const slug = data.get("slug");
        const price = parseFloat(data.get("price"));
        const quantity = parseInt(data.get("quantity"));
        const description = data.get("description");
        const tags = data.get("tags");
        const category = data.get("category");
        const thumbnail = data.get("thumbnail");
        const galleryFiles = data.getAll("gallery");

        // Validation
        if (!title || !slug || !price || !quantity || !description || !thumbnail || !category) {
            return NextResponse.json(
                { error: "لطفاً تمام فیلدهای مورد نیاز را پر کنید." },
                { status: 400 }
            );
        }

        const tagsArray = tags ? tags.split(",").map(tag => tag.trim()) : [];

        // Save thumbnail
        const thumbnailPath = await saveImageToDisk(thumbnail);

        // Save gallery images
        const galleryPaths = [];
        for (const file of galleryFiles) {
            if (file && file.size > 0) {
                const imagePath = await saveImageToDisk(file);
                galleryPaths.push(imagePath);
            }
        }

        // Create new product
        const newProduct = new Product({
            title,
            slug,
            price,
            quantity,
            description,
            tags: tagsArray,
            category,
            thumbnail: thumbnailPath,
            gallery: galleryPaths,
        });

        await newProduct.save();

        return NextResponse.json(
            { message: "محصول با موفقیت ذخیره شد", product: newProduct },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating product:", error.message);
        return NextResponse.json(
            { error: "خطای سرور هنگام ذخیره‌سازی محصول" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find();
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "خطا در دریافت محصولات" },
            { status: 500 }
        );
    }
}
