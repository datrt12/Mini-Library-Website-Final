import Fastify from 'fastify';
import dotenv from 'dotenv';
import { connectDB } from './src/database.js';
import bookRoutes from './route/books.js';
import borrowRoutes from './route/borrow.js';
import formBody from '@fastify/formbody';

dotenv.config();

const fastify = Fastify({ logger: true });

await connectDB();
fastify.register(formBody);
fastify.post('/test', async (req, reply) => {
  console.log(req.body);
  return { message: 'Đã nhận dữ liệu', data: req.body };
});
// Route test
fastify.get('/', async () => {
  return { message: 'Backend Fastify đã chạy!' };
});

// Đăng ký route sách
await fastify.register(bookRoutes);
await fastify.register(borrowRoutes);
await fastify.register(bookRoutes, { prefix: '/books' });
await fastify.register(borrowRoutes, { prefix: '/borrows' });


const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT });
    console.log(`Server đang chạy tại http://localhost:${process.env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
