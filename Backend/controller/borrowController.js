import { BorrowBook } from "../model/BorrowBook.js";
import { Book } from "../model/Book.js";

export const getAllBorrows = async (request, reply) => {
	try {
		const borrows = await BorrowBook.find()
			.populate("bookId")
			.populate("userId");
		return reply.send(borrows);
	} catch (error) {
		return reply.code(500).send({ message: "Lỗi khi lấy danh sách phiếu mượn", error });
	}
};

export const getBorrowById = async (request, reply) => {
	try {
		const borrow = await BorrowBook.findById(request.params.id)
			.populate("bookId")
			.populate("userId");
		if (!borrow) {
			return reply.code(404).send({ message: "Không tìm thấy phiếu mượn" });
		}
		return reply.send(borrow);
	} catch (error) {
		return reply.code(500).send({ message: "Lỗi khi lấy phiếu mượn", error });
	}
};

export const createBorrow = async (request, reply) => {
	try {
		const { bookId, userId } = request.body;

		const book = await Book.findById(bookId);
		if (!book) return reply.code(404).send({ message: "Không tìm thấy sách" });
		if (!book.available)
			return reply.code(400).send({ message: "Sách này hiện đang được mượn" });

		const borrowRecord = new BorrowBook({ bookId, userId });
		const savedBorrow = await borrowRecord.save();

		book.available = false;
		await book.save();

		return reply.code(201).send(savedBorrow);
	} catch (error) {
		return reply.code(400).send({ message: "Không thể tạo phiếu mượn", error });
	}
};

export const returnBook = async (request, reply) => {
	try {
		const borrow = await BorrowBook.findById(request.params.id);
		if (!borrow) {
			return reply.code(404).send({ message: "Không tìm thấy phiếu mượn" });
		}

		if (borrow.returnDate) {
			return reply.code(400).send({ message: "Phiếu mượn này đã được trả" });
		}

		borrow.returnDate = new Date();
		await borrow.save();

		const book = await Book.findById(borrow.bookId);
		if (book) {
			book.available = true;
			await book.save();
		}

		return reply.send({ message: "Đã trả sách thành công", borrow });
	} catch (error) {
		return reply.code(400).send({ message: "Không thể trả sách", error });
	}
};

export const deleteBorrow = async (request, reply) => {
	try {
		const deleted = await BorrowBook.findByIdAndDelete(request.params.id);
		if (!deleted) {
			return reply.code(404).send({ message: "Không tìm thấy phiếu mượn để xóa" });
		}
		return reply.send({ message: "Đã xóa phiếu mượn thành công" });
	} catch (error) {
		return reply.code(500).send({ message: "Không thể xóa phiếu mượn", error });
	}
};