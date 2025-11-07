import mongoose from "mongoose";

const borrowBookSchema = new mongoose.Schema({
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Book", 
    required: [true, 'BookId không được để trống'] 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: [true, 'UserId không được để trống'] 
  },
  borrowDate: { 
    type: Date, 
    default: Date.now,
    required: [true, 'Ngày mượn không được để trống']
  },
  returnDate: { 
    type: Date,
    validate: {
      validator: function(value) {
        // Nếu có returnDate, phải sau borrowDate
        return !value || value > this.borrowDate;
      },
      message: 'Ngày trả phải sau ngày mượn'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['borrowed', 'returned'],
      message: 'Status không hợp lệ'
    },
    default: 'borrowed'
  }
});

export const BorrowBook = mongoose.model("BorrowBook", borrowBookSchema);
