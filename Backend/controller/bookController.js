import { Book } from "../model/Book.js";

export const getAllBooks = async (request, reply) => {
	try {
		const books = await Book.find();
		return reply.send(books);
	} catch (error) {
		return reply.code(500).send({ message: "Lỗi khi lấy danh sách sách", error });
	}
};

export const getBookById = async (request, reply) => {
	try {
		const book = await Book.findById(request.params.id);
		if (!book) {
			return reply.code(404).send({ message: "Không tìm thấy sách" });
		}
		return reply.send(book);
	} catch (error) {
		return reply.code(500).send({ message: "Lỗi khi lấy thông tin sách", error });
	}
};

export const createBook = async (request, reply) => {
	try {
		const newBook = new Book(request.body);
		const savedBook = await newBook.save();
		return reply.code(201).send(savedBook);
	} catch (error) {
		return reply.code(400).send({ message: "Không thể thêm sách", error });
	}
};

export const updateBook = async (request, reply) => {
	try {
		const updatedBook = await Book.findByIdAndUpdate(
			request.params.id,
			request.body,
			{ new: true, runValidators: true }
		);
		if (!updatedBook) {
			return reply.code(404).send({ message: "Không tìm thấy sách để cập nhật" });
		}
		return reply.send(updatedBook);
	} catch (error) {
		return reply.code(400).send({ message: "Không thể cập nhật sách", error });
	}
};

export const deleteBook = async (request, reply) => {
	try {
		const deletedBook = await Book.findByIdAndDelete(request.params.id);
		if (!deletedBook) {
			return reply.code(404).send({ message: "Không tìm thấy sách để xóa" });
		}
		return reply.send({ message: "Đã xóa sách thành công" });
	} catch (error) {
		return reply.code(500).send({ message: "Không thể xóa sách", error });
	}
};