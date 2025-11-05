import { Book } from "../model/Book.js";

export default async function bookRoutes(fastify, options) {
  fastify.get("/api/books", async (request, reply) => {
    const books = await Book.find();
    return books;
  });

  fastify.post("/api/books", async (request, reply) => {
    const newBook = new Book(request.body);
    await newBook.save();
    reply.code(201).send(newBook);
  });

  fastify.put("/api/books/:id", async (request, reply) => {
    const { id } = request.params;
    const updatedBook = await Book.findByIdAndUpdate(id, request.body, { new: true });
    reply.send(updatedBook);
  });

  fastify.delete("/api/books/:id", async (request, reply) => {
    const { id } = request.params;
    await Book.findByIdAndDelete(id);
    reply.send({ message: "Đã xóa sách thành công!" });
  });
}
