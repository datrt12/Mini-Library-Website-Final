import { BorrowBook } from "../model/BorrowBook.js";

export default async function borrowRoutes(fastify, options) {
	fastify.get("/api/borrows", async (request, reply) => {
		const borrows = await BorrowBook.find().populate("bookId").populate("userId");
		return borrows;
	});

	fastify.get("/api/borrows/:id", async (request, reply) => {
		const { id } = request.params;
		const borrow = await BorrowBook.findById(id).populate("bookId").populate("userId");
		if (!borrow) {
			reply.code(404).send({ message: "Không tìm thấy bản ghi mượn" });
			return;
		}
		return borrow;
	});

	fastify.post("/api/borrows", async (request, reply) => {
		try {
			const newBorrow = new BorrowBook(request.body);
			await newBorrow.save();
			reply.code(201).send(newBorrow);
		} catch (err) {
			reply.code(400).send({ message: err.message });
		}
	});

	fastify.put("/api/borrows/:id", async (request, reply) => {
		const { id } = request.params;
		const updated = await BorrowBook.findByIdAndUpdate(id, request.body, { new: true });
		if (!updated) {
			reply.code(404).send({ message: "Không tìm thấy bản ghi mượn" });
			return;
		}
		return updated;
	});

	fastify.delete("/api/borrows/:id", async (request, reply) => {
		const { id } = request.params;
		await BorrowBook.findByIdAndDelete(id);
		reply.send({ message: "Đã xóa bản ghi mượn!" });
	});
}
