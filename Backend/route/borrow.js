import { getAllBorrows,getBorrowById,createBorrow, returnBook, deleteBorrow } from "../controller/borrowController.js";

export default async function borrowRoutes(fastify, options) {
  fastify.get("/", getAllBorrows);
  fastify.get("/:id", getBorrowById);
  fastify.post("/", createBorrow);
  fastify.put("/:id/return", returnBook);
  fastify.delete("/:id", deleteBorrow);
}
