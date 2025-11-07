import { Book } from "../model/Book.js";

export default async function bookRoutes(fastify, options) {
  fastify.get("/api/books", async (request, reply) => {
    try {
      const { search, category, available } = request.query;
      
      let query = {};
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { bookID: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (category) {
        query.category = category;
      }
      
      if (available !== undefined) {
        query.available = available === 'true';
      }
      
      const books = await Book.find(query);
      return books;
    } catch (error) {
      reply.code(500).send({ message: error.message });
    }
  });

  fastify.post("/api/books", async (request, reply) => {
    try {
      if (!request.body.bookID) {
        const count = await Book.countDocuments();
        request.body.bookID = `BOOK${(count + 1).toString().padStart(4, '0')}`;
      }

      const newBook = new Book(request.body);
      await newBook.save();
      reply.code(201).send(newBook);
    } catch (error) {
      if (error.code === 11000) { 
        reply.code(400).send({ message: 'Mã sách đã tồn tại' });
        return;
      }
      reply.code(400).send({ message: error.message });
    }
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
