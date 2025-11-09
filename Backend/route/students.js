import { getAllStudents, getStudentById, createStudent, updateStudent,deleteStudent} from "../controller/studentController.js";
export default async function studentRoutes(fastify, options) {
    fastify.get('/', getAllStudents);
    fastify.get('/:id', getStudentById);
    fastify.post('/', createStudent);
    fastify.put('/:id', updateStudent);
    fastify.delete('/:id', deleteStudent);
}
