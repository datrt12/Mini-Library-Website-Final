import { Book } from "../model/Book.js";
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import http from 'http';
import https from 'https';

const pump = promisify(pipeline);

function getFrontendImgDir() {
	// Backend runs from Backend/; Frontend/img is sibling
	const dir = path.resolve(process.cwd(), '../Frontend/img');
	return dir;
}

async function ensureImgDir() {
	const dir = getFrontendImgDir();
	await fs.promises.mkdir(dir, { recursive: true });
	return dir;
}

function safeFilename(original) {
	const base = (original || 'upload').replace(/[^a-zA-Z0-9._-]/g, '_');
	const stamp = Date.now();
	const parts = base.split('.');
	let ext = '';
	if (parts.length > 1) ext = '.' + parts.pop();
	const name = parts.join('.') || 'file';
	return `${name}-${stamp}${ext}`;
}

function downloadToFile(fileUrl, destPath) {
	return new Promise((resolve, reject) => {
		const client = fileUrl.startsWith('https') ? https : http;
		const req = client.get(fileUrl, (res) => {
			if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
				// handle redirect
				return downloadToFile(res.headers.location, destPath).then(resolve).catch(reject);
			}
			if (res.statusCode !== 200) {
				return reject(new Error(`HTTP ${res.statusCode}`));
			}
			const fileStream = fs.createWriteStream(destPath);
			res.pipe(fileStream);
			fileStream.on('finish', () => fileStream.close(() => resolve(destPath)));
			fileStream.on('error', reject);
		});
		req.on('error', reject);
	});
}

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
		// Best-effort delete image file if stored locally
		if (deletedBook.image && deletedBook.image.startsWith('img/')) {
			const filePath = path.resolve(getFrontendImgDir(), deletedBook.image.replace(/^img\//, ''));
			try {
				await fs.promises.unlink(filePath);
			} catch {}
		}
		return reply.send({ message: "Đã xóa sách thành công" });
	} catch (error) {
		return reply.code(500).send({ message: "Không thể xóa sách", error });
	}
};

// Upload image by multipart or download by URL; returns { image: 'img/filename.ext' }
export const uploadBookImage = async (request, reply) => {
	try {
		const imgDir = await ensureImgDir();

		if (request.isMultipart && request.isMultipart()) {
			const file = await request.file();
			if (!file) return reply.code(400).send({ message: 'Thiếu file ảnh' });
			const filename = safeFilename(file.filename);
			const destPath = path.resolve(imgDir, filename);
			await pump(file.file, fs.createWriteStream(destPath));
			return reply.send({ image: `img/${filename}` });
		}

		const { imageUrl, imageBase64 } = request.body || {};
		if (imageUrl) {
			const urlObj = new URL(imageUrl);
			const urlName = path.basename(urlObj.pathname) || 'image.jpg';
			const filename = safeFilename(urlName);
			const destPath = path.resolve(imgDir, filename);
			await downloadToFile(imageUrl, destPath);
			return reply.send({ image: `img/${filename}` });
		}

		if (imageBase64 && typeof imageBase64 === 'string' && imageBase64.startsWith('data:')) {
			// data URL: data:<mime>;base64,<data>
			const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
			if (!match) return reply.code(400).send({ message: 'Sai định dạng data URL' });
			const mime = match[1];
			const data = match[2];
			const ext = mime.split('/')[1] || 'png';
			const filename = safeFilename(`image.${ext}`);
			const destPath = path.resolve(imgDir, filename);
			await fs.promises.writeFile(destPath, Buffer.from(data, 'base64'));
			return reply.send({ image: `img/${filename}` });
		}

		return reply.code(400).send({ message: 'Không có dữ liệu ảnh' });
	} catch (error) {
		return reply.code(500).send({ message: 'Lỗi xử lý ảnh', error: error.message || error });
	}
};