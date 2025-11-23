import Product from "@/models/Product";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectDB();

    try {
        const { slug } = params;

        if (!slug) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Fetch category by decoded slug
        const product = await Product.findOne({ slug });

        if (!product) {
            return NextResponse.json(
                { error: "product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}