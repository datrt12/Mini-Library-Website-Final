import { User } from "../model/User.js";

export default async function userRoutes(fastify, _options) {
    await fastify.get("/api/users", async () => {
        const users = await User.find();
        return users;
    });

    await fastify.post("/api/users", async (request) => {
        const { username, password, role } = request.body;
        const newUser = new User({ username, password, role });
        await newUser.save();
        return newUser;
    });

    await fastify.get("/api/users/:id", async (request, reply) => {
        const { id } = request.params;
        const user = await User.findById(id);
        
        if (!user) {
            reply.code(404).send({ message: "Người dùng không tồn tại" });
            return;
        }

        return user;
    });

    await fastify.put("/api/users/:id", async (request, reply) => {
        const { id } = request.params;
        const { username, password, role } = request.body;
        const user = await User.findById(id);
        
        if (!user) {
            reply.code(404).send({ message: "Người dùng không tồn tại" });
            return;
        }

        user.username = username;
        user.password = password;
        user.role = role;
        await user.save();

        return user;
    });

    await fastify.delete("/api/users/:id", async (request, reply) => {
        const { id } = request.params;
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            reply.code(404).send({ message: "Người dùng không tồn tại" });
            return;
        }

        return { message: "Xóa người dùng thành công" };
    });
}