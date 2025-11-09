import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../controller/bookController.js';
export default async function bookRoutes (fastify, options) {
    fastify.get('/', getAllBooks);
    fastify.get('/:id', getBookById);
    fastify.post('/', createBook);
    fastify.put('/:id', updateBook);
    fastify.delete('/:id', deleteBook);
}