import { User } from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/* 📝 Đăng ký tài khoản - POST /api/users/register */
export const registerUser = async (request, reply) => {
  try {
    const { username, password, role } = request.body;
    const exist = await User.findOne({ username });
    if (exist) return reply.code(400).send({ message: 'Tên đăng nhập đã tồn tại' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash, role });
    await user.save();
    return reply.code(201).send({ message: 'Đăng ký thành công' });
  } catch (err) {
    return reply.code(500).send({ message: err.message });
  }
};

/* 🔐 Đăng nhập - POST /api/users/login */
export const loginUser = async (request, reply) => {
  try {
    const { username, password } = request.body;
    const user = await User.findOne({ username });
    if (!user) return reply.code(404).send({ message: 'Không tìm thấy tài khoản' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.code(401).send({ message: 'Sai mật khẩu' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return reply.send({ message: 'Đăng nhập thành công', token });
  } catch (err) {
    return reply.code(500).send({ message: err.message });
  }
};

/* 📋 Lấy danh sách người dùng - GET /api/users */
export const getAllUsers = async (request, reply) => {
  try {
    const users = await User.find().select('-password'); // ẩn mật khẩu
    return reply.send(users);
  } catch (err) {
    return reply.code(500).send({ message: err.message });
  }
};

/* ❌ Xóa tài khoản - DELETE /api/users/:id */
export const deleteUser = async (request, reply) => {
  try {
    const deleted = await User.findByIdAndDelete(request.params.id);
    if (!deleted) return reply.code(404).send({ message: 'Không tìm thấy tài khoản' });
    return reply.code(204).send();
  } catch (err) {
    return reply.code(500).send({ message: err.message });
  }
};
