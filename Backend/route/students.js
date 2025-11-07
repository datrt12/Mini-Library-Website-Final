import { Student } from "../model/Student.js";
export default async function studentRoutes(fastify, _options) {


await fastify.get("/api/students", async () => {
    const students = await Student.find();
    return students;
  });
  await fastify.post("/api/students", async (request) => {
    const { name, age, grade } = request.body;
    const newStudent = new Student({ name, age, grade });
    await newStudent.save();
    return newStudent;
  });
  await fastify.get("/api/students/:id", async (request, reply) => {
    const { id } = request.params;
    const student = await Student.findById(id);
    if (!student) {
      reply.code(404).send({ message: "Học sinh không tồn tại" });
      return;
    }

    return student;
  }); 
  await fastify.put("/api/students/:id", async (request, reply) => {
    const { id } = request.params;
    const { name, age, grade } = request.body;

    const student = await Student.findById(id);
    if (!student) {
      reply.code(404).send({ message: "Học sinh không tồn tại" });
      return;
    }

    student.name = name;
    student.age = age;
    student.grade = grade;
    await student.save();

    return student;
  }); 
  await fastify.delete("/api/students/:id", async (request, reply) => {
    const { id } = request.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      reply.code(404).send({ message: "Học sinh không tồn tại" });
      return;
    }
    return { message: "Xóa học sinh thành công" };
  });
}
