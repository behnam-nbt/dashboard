import { Schema, model, models } from "mongoose";

const blogSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    socialMedia: {
        instagram: { type: String, default: null },
        twitter: { type: String, default: null },
        facebook: { type: String, default: null },
        linkedin: { type: String, default: null },
    },
    tags: { type: [String], default: [] },
    image: { type: String, required: true },
}, { timestamps: true });

const Blog = models.Blog || model("Blog", blogSchema);

export default Blog;