import Product from "@/models/Product";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    await connectDB();

    try {
        const { productId } = await params;

        if (!productId) {
            return NextResponse.json(
                { status: "failed", message: "Product ID is required!" },
                { status: 400 }
            );
        }

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return NextResponse.json(
                { status: "failed", message: "Product not found!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { status: "success", message: "Product deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in delete process:", error);
        return NextResponse.json(
            { status: "failed", message: "Error in deleting Product!" },
            { status: 500 }
        );
    }
}
