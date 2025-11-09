import { User } from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/* 📝 Đăng ký tài khoản - POST /api/users/register */
export const registerUser = async (request, reply) => {
  try {
    const { username, password, role } = request.body;
    const exist = await User.findOne({ username });
    if (exist) return reply.code(400).send({ message: 'Tên đăng nhập đã tồn tại' });

    const NO_HASH = process.env.NO_HASH === '1' || process.env.PASSWORD_HASH === 'off' || process.env.PASSWORD_HASH === 'false';
    let storedPassword = password;
    if (!NO_HASH) {
      storedPassword = await bcrypt.hash(password, 10);
    }
    const user = new User({ username, password: storedPassword, role });
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
    const NO_HASH = process.env.NO_HASH === '1' || process.env.PASSWORD_HASH === 'off' || process.env.PASSWORD_HASH === 'false';
    // Support legacy plaintext + optional plaintext mode
    let stored = user.password;
    let valid = false;
    const isLikelyBcrypt = typeof stored === 'string' && stored.startsWith('$2');
    if (NO_HASH) {
      // Plaintext mode: prefer plain compare; if DB contains bcrypt hash, allow bcrypt compare for compatibility
      if (password === stored) {
        valid = true;
      } else if (isLikelyBcrypt) {
        valid = await bcrypt.compare(password, stored);
      }
    } else {
      // Hashed mode: handle both hashed and legacy plaintext (migrate)
      if (isLikelyBcrypt) {
        valid = await bcrypt.compare(password, stored);
      } else if (password === stored) {
        valid = true;
        // Migrate to bcrypt
        try {
          const newHash = await bcrypt.hash(password, 10);
          user.password = newHash;
          await user.save();
        } catch (mErr) {
          request.log.warn({ msg: 'Không thể migrate mật khẩu plaintext', error: mErr });
        }
      }
    }
    if (!valid) return reply.code(401).send({ message: 'Sai mật khẩu' });

    if (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).trim() === '') {
      return reply.code(500).send({ message: 'JWT_SECRET chưa được cấu hình' });
    }
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
