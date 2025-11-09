// Simple JWT auth & role guard middleware
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Verify token and attach user payload
export function requireAuth(request, reply, done) {
	const authHeader = request.headers['authorization'] || request.headers['Authorization'];
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		reply.code(401).send({ message: 'Thiếu token' });
		return;
	}
	const token = authHeader.substring(7);
	if (!process.env.JWT_SECRET) {
		reply.code(500).send({ message: 'JWT_SECRET chưa được cấu hình' });
		return;
	}
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		request.user = payload; // { id, role }
		done();
	} catch (err) {
		reply.code(401).send({ message: 'Token không hợp lệ' });
	}
}

// Require specific role(s)
export function requireRole(...roles) {
	return (request, reply, done) => {
		if (!request.user) {
			reply.code(401).send({ message: 'Chưa xác thực' });
			return;
		}
		if (!roles.includes(request.user.role)) {
			reply.code(403).send({ message: 'Không đủ quyền' });
			return;
		}
		done();
	};
}

// Combined helper for admin only
export const requireAdmin = [requireAuth, requireRole('admin')];

// Combined helper for normal user (role user) if needed
export const requireUser = [requireAuth, requireRole('user')];

