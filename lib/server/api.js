import Product from "@/models/Product";
import connectDB from "@/utils/connectDB";

export async function getProductsServer() {
    await connectDB;
    const res = await Product.find();
    return JSON.parse(JSON.stringify(res));
}