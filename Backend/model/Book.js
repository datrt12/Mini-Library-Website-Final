import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  bookID: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  year: { type: Number },
  available: { type: Boolean, default: true },
});

export const Book = mongoose.model("Book", bookSchema);
