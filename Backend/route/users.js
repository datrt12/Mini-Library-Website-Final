import { registerUser, loginUser, getAllUsers, deleteUser } from '../controller/userController.js';

export default async function userRoutes(fastify, options) {
    fastify.post('/register', registerUser);
    fastify.post('/login', loginUser);
    fastify.get('/', getAllUsers);
    fastify.delete('/:id', deleteUser);
}
