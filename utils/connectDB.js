import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

export default connectDB;
