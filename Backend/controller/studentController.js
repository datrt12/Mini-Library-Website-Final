import { Student } from '../model/Student.js';

/* 📋 Lấy danh sách sinh viên - GET /api/students */
export const getAllStudents = async (request, reply) => {
  try {
    const students = await Student.find();
    return { students };
  } catch (err) {
    reply.code(500);
    return { message: err.message };
  }
};

/* 🔍 Lấy 1 sinh viên theo ID - GET /api/students/:id */
export const getStudentById = async (request, reply) => {
  try {
    const student = await Student.findById(request.params.id);
    if (!student) {
      reply.code(404);
      return { message: 'Không tìm thấy sinh viên' };
    }
    return student;
  } catch (err) {
    reply.code(500);
    return { message: err.message };
  }
};

/* ➕ Thêm sinh viên - POST /api/students */
export const createStudent = async (request, reply) => {
  try {
    const newStudent = new Student(request.body);
    await newStudent.save();
    reply.code(201);
    return newStudent;
  } catch (err) {
    reply.code(400);
    return { message: err.message };
  }
};

/* ✏️ Cập nhật thông tin sinh viên - PUT /api/students/:id */
export const updateStudent = async (request, reply) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      request.params.id, 
      request.body, 
      { new: true }
    );
    if (!updated) {
      reply.code(404);
      return { message: 'Không tìm thấy sinh viên' };
    }
    return updated;
  } catch (err) {
    reply.code(400);
    return { message: err.message };
  }
};

/* ❌ Xóa sinh viên - DELETE /api/students/:id */
export const deleteStudent = async (request, reply) => {
  try {
    const deleted = await Student.findByIdAndDelete(request.params.id);
    if (!deleted) {
      reply.code(404);
      return { message: 'Không tìm thấy sinh viên' };
    }
    return { message: 'Đã xóa sinh viên thành công' };
  } catch (err) {
    reply.code(500);
    return { message: err.message };
  }
};
