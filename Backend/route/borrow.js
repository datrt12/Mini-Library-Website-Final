import { BorrowBook } from "../model/BorrowBook.js";
import { Book } from "../model/Book.js";
import { User } from "../model/User.js";

export default async function borrowRoutes(fastify, options) {
  // Middleware để xử lý lỗi validation
  const handleValidationError = (error) => {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return { 
        statusCode: 400,
        error: 'Validation Failed',
        message: errors.join(', ')
      };
    }
    return error;
  };

  fastify.get("/api/borrows", async (request, reply) => {
    try {
      const borrows = await BorrowBook.find()
        .populate("bookId")
        .populate("userId");
      return borrows;
    } catch (error) {
      reply.code(500).send(handleValidationError(error));
    }
  });	fastify.get("/api/borrows/:id", async (request, reply) => {
		const { id } = request.params;
		const borrow = await BorrowBook.findById(id).populate("bookId").populate("userId");
		if (!borrow) {
			reply.code(404).send({ message: "Không tìm thấy bản ghi mượn" });
			return;
		}
		return borrow;
	});

  fastify.post("/api/borrows", async (request, reply) => {
    try {
      // Kiểm tra xem book và user có tồn tại không
      const book = await Book.findById(request.body.bookId);
      const user = await User.findById(request.body.userId);

      if (!book) {
        reply.code(404).send({ message: 'Không tìm thấy sách' });
        return;
      }

      if (!user) {
        reply.code(404).send({ message: 'Không tìm thấy người dùng' });
        return;
      }

      // Kiểm tra xem sách đã được mượn chưa
      const existingBorrow = await BorrowBook.findOne({
        bookId: request.body.bookId,
        returnDate: null,
        status: 'borrowed'
      });

      if (existingBorrow) {
        reply.code(400).send({ message: 'Sách này đã được mượn' });
        return;
      }

      // Tạo bản ghi mượn mới
      const newBorrow = new BorrowBook({
        ...request.body,
        borrowDate: new Date(),
        status: 'borrowed'
      });

      await newBorrow.save();
      
      // Populate thông tin book và user trước khi trả về
      await newBorrow.populate(['bookId', 'userId']);
      
      reply.code(201).send(newBorrow);
    } catch (error) {
      reply.code(400).send(handleValidationError(error));
    }
  });	fastify.put("/api/borrows/:id", async (request, reply) => {
		const { id } = request.params;
		const updated = await BorrowBook.findByIdAndUpdate(id, request.body, { new: true });
		if (!updated) {
			reply.code(404).send({ message: "Không tìm thấy bản ghi mượn" });
			return;
		}
		return updated;
	});

	fastify.delete("/api/borrows/:id", async (request, reply) => {
		const { id } = request.params;
		await BorrowBook.findByIdAndDelete(id);
		reply.send({ message: "Đã xóa bản ghi mượn!" });
	});
}
