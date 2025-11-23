import Product from "@/models/Product";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PUT(req, { params }) {
    await connectDB();

    try {
        const { productId } = await params;
        const data = await req.formData();

        const title = data.get("title");
        const slug = data.get("slug");
        const price = data.get("price");
        const quantity = data.get("quantity");
        const description = data.get("description");
        const tags = data.get("tags");
        const category = data.get("category");

        const thumbnail = data.get("thumbnail");
        const gallery = data.getAll("gallery");

        if (!productId) {
            return NextResponse.json({ error: "آیدی محصول الزامی است." }, { status: 400 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });
        }

        // Handle thumbnail image
        let thumbnailPath = product.thumbnail;
        if (thumbnail && thumbnail.size > 0) {
            const thumbnailName = `${Date.now()}-thumb-${thumbnail.name}`;
            const thumbPath = path.join(process.cwd(), "public", "images", thumbnailName);
            const buffer = Buffer.from(await thumbnail.arrayBuffer());
            fs.writeFileSync(thumbPath, buffer);

            // Delete old thumbnail
            if (product.thumbnail && product.thumbnail.startsWith("/images/")) {
                const oldThumbPath = path.join(process.cwd(), "public", product.thumbnail);
                if (fs.existsSync(oldThumbPath)) {
                    fs.unlinkSync(oldThumbPath);
                }
            }

            thumbnailPath = `/images/${thumbnailName}`;
        }

        // Handle gallery images
        const galleryPaths = [];

        if (gallery && gallery.length > 0 && gallery[0].size > 0) {
            for (const file of gallery) {
                const name = `${Date.now()}-${file.name}`;
                const filePath = path.join(process.cwd(), "public", "images", name);
                const buffer = Buffer.from(await file.arrayBuffer());
                fs.writeFileSync(filePath, buffer);
                galleryPaths.push(`/images/${name}`);
            }

            // Optionally delete old gallery images
            if (Array.isArray(product.gallery)) {
                for (const imgPath of product.gallery) {
                    const fullPath = path.join(process.cwd(), "public", imgPath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                }
            }
        }

        // Parse tags to array
        const parsedTags = tags ? tags.split(",").map((t) => t.trim()) : product.tags;

        // Update fields
        product.title = title || product.title;
        product.slug = slug || product.slug;
        product.price = price || product.price;
        product.quantity = quantity || product.quantity;
        product.description = description || product.description;
        product.tags = parsedTags;
        product.thumbnail = thumbnailPath;
        product.category = category || product.category;
        if (galleryPaths.length > 0) {
            product.gallery = galleryPaths;
        }

        await product.save();

        return NextResponse.json(
            { message: "محصول با موفقیت بروزرسانی شد", product },
            { status: 200 }
        );
    } catch (error) {
        console.error("خطا در بروزرسانی محصول:", error.message);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}
