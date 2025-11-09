import { getAllBooks, getBookById, createBook, updateBook, deleteBook, uploadBookImage } from '../controller/bookController.js';
import { requireAuth, requireRole } from '../error/auth.js';
export default async function bookRoutes (fastify, options) {
    fastify.get('/', getAllBooks);
    fastify.get('/:id', getBookById);
    fastify.post('/', { preHandler: [requireAuth, requireRole('admin')] }, createBook);
    fastify.put('/:id', { preHandler: [requireAuth, requireRole('admin')] }, updateBook);
    fastify.delete('/:id', { preHandler: [requireAuth, requireRole('admin')] }, deleteBook);
    fastify.post('/upload', { preHandler: [requireAuth, requireRole('admin')] }, uploadBookImage);
}