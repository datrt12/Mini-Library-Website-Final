import mongoose from "mongoose";

const borrowBookSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date }
});

export const BorrowBook = mongoose.model("BorrowBook", borrowBookSchema);
