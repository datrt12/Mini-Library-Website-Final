import Fastify from 'fastify';
import dotenv from 'dotenv';
import { connectDB } from './src/database.js';
import bookRoutes from './route/books.js';
import borrowRoutes from './route/borrow.js';
import userRoutes from './route/users.js';
import studentRoutes from './route/students.js';
import formBody from '@fastify/formbody';
import fastifyCors from '@fastify/cors';

dotenv.config();

const fastify = Fastify({ logger: true });

await connectDB();
fastify.register(formBody);
await fastify.register(fastifyCors, {
  origin: 'http://127.0.0.1:5500', 
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
// Route test
fastify.get('/', async () => {
  return { message: 'Backend Fastify đã chạy!' };
});

// Đăng ký route sách
await fastify.register(bookRoutes);
await fastify.register(borrowRoutes);
await fastify.register(userRoutes);
await fastify.register(studentRoutes);
await fastify.register(bookRoutes, { prefix: '/books' });
await fastify.register(borrowRoutes, { prefix: '/borrows' });
await fastify.register(userRoutes, { prefix: '/api/users' });
await fastify.register(studentRoutes, { prefix: '/api/students' });
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
