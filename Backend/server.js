import Fastify from 'fastify';
import dotenv from 'dotenv';
import { connectDB } from './src/database.js';
import bookRoutes from './route/books.js';
import borrowRoutes from './route/borrow.js';
import userRoutes from './route/users.js';
import studentRoutes from './route/students.js';
import formBody from '@fastify/formbody';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

dotenv.config();

const fastify = Fastify({ logger: true });

await connectDB();
fastify.register(formBody);
fastify.register(fastifyMultipart, { limits: { fileSize: 10 * 1024 * 1024 } });
await fastify.register(fastifyCors, {
  origin: (origin, cb) => {
    const whitelist = [
      undefined,
      'http://127.0.0.1:5500',
      'http://localhost:5500',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:8080',
      'http://127.0.0.1:8080'
    ];
    if (!origin || whitelist.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Static file serving for Frontend assets (custom, no plugin)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.join(__dirname, '..', 'Frontend');
const UI_DIR = path.join(FRONTEND_DIR, 'ui');

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.webp': return 'image/webp';
    case '.ico': return 'image/x-icon';
    default: return 'application/octet-stream';
  }
}

function safeJoin(base, target) {
  const targetPath = path.posix.normalize('/' + target.replace(/\\/g, '/'));
  const resolved = path.join(base, targetPath);
  if (!resolved.startsWith(base)) return null; // prevent path traversal
  return resolved;
}

async function sendStatic(reply, absPath) {
  return new Promise((resolve, reject) => {
    fs.stat(absPath, (err, stats) => {
      if (err || !stats.isFile()) {
        reply.code(404).send('Not Found');
        return resolve();
      }
      reply.header('Content-Type', contentTypeFor(absPath));
      const stream = fs.createReadStream(absPath);
      stream.on('error', () => { reply.code(500).send('Error'); resolve(); });
      stream.on('open', () => reply.send(stream));
      stream.on('end', () => resolve());
    });
  });
}

// Root -> serve index.html
fastify.get('/', async (req, reply) => {
  const filePath = path.join(UI_DIR, 'index.html');
  return sendStatic(reply, filePath);
});

// Serve UI html files
fastify.get('/ui/*', async (req, reply) => {
  const rel = decodeURIComponent(req.url.replace(/^\/ui\//, '')) || 'index.html';
  const abs = safeJoin(UI_DIR, rel);
  if (!abs) return reply.code(400).send('Bad Request');
  return sendStatic(reply, abs);
});

// Serve css/js/img from Frontend directory
fastify.get('/css/*', async (req, reply) => {
  const rel = decodeURIComponent(req.url.replace(/^\/css\//, ''));
  const base = path.join(FRONTEND_DIR, 'css');
  const abs = safeJoin(base, rel);
  if (!abs) return reply.code(400).send('Bad Request');
  return sendStatic(reply, abs);
});

fastify.get('/js/*', async (req, reply) => {
  const rel = decodeURIComponent(req.url.replace(/^\/js\//, ''));
  const base = path.join(FRONTEND_DIR, 'js');
  const abs = safeJoin(base, rel);
  if (!abs) return reply.code(400).send('Bad Request');
  return sendStatic(reply, abs);
});

fastify.get('/img/*', async (req, reply) => {
  const rel = decodeURIComponent(req.url.replace(/^\/img\//, ''));
  const base = path.join(FRONTEND_DIR, 'img');
  const abs = safeJoin(base, rel);
  if (!abs) return reply.code(400).send('Bad Request');
  return sendStatic(reply, abs);
});

await fastify.register(bookRoutes, { prefix: '/books' });
await fastify.register(borrowRoutes, { prefix: '/borrows' });
await fastify.register(userRoutes, { prefix: '/api/users' });
await fastify.register(studentRoutes, { prefix: '/api/students' });
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port });
    console.log(`Server đang chạy tại http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
