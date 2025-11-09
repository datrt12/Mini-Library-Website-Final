import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  bookID: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  category: { type: String },
  year: { type: Number },
  available: { type: Boolean, default: true },
  // image can be a URL or a base64 data URL
  image: { type: String }
});

export const Book = mongoose.model("Book", bookSchema);
