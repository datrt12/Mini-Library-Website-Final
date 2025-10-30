library-management/
│
├── backend/                           # ⚙️ Xử lý nghiệp vụ và API
│   ├── src/
│   │   ├── config/                    # Cấu hình chung (DB, biến môi trường, v.v.)
│   │   │   ├── db.js                  # Kết nối CSDL (Access hoặc MongoDB)
│   │   │   └── env.js
│   │   │
│   │   ├── models/                    # Định nghĩa cấu trúc dữ liệu
│   │   │   ├── Book.js                # Mô hình sách
│   │   │   ├── Student.js             # Mô hình học sinh
│   │   │   ├── BorrowRecord.js        # Mô hình phiếu mượn - trả
│   │   │   └── User.js                # Mô hình người dùng (admin, thủ thư)
│   │   │
│   │   ├── controllers/               # Xử lý logic nghiệp vụ
│   │   │   ├── bookController.js
│   │   │   ├── studentController.js
│   │   │   ├── borrowController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── routes/                    # Định nghĩa các API endpoint
│   │   │   ├── books.js
│   │   │   ├── students.js
│   │   │   ├── borrow.js
│   │   │   └── users.js
│   │   │
│   │   ├── middleware/                # Xử lý xác thực, lỗi, logging
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── utils/                     # Các hàm phụ trợ (helper)
│   │   │   └── dateHelper.js
│   │   │
│   │   └── server.js                  # File khởi chạy Fastify server
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── frontend/                          # 🎨 Giao diện web HTML/CSS/JS thuần
│   ├── index.html                     # Trang chính (Dashboard hoặc Trang chủ)
│   ├── login.html                     # Trang đăng nhập
│   ├── books.html                     # Quản lý sách
│   ├── students.html                  # Quản lý học sinh
│   ├── borrow.html                    # Quản lý mượn - trả
│   │
│   ├── css/
│   │   ├── style.css                  # CSS chung cho toàn dự án
│   │   └── pages/                     # CSS riêng cho từng trang
│   │       ├── login.css
│   │       ├── books.css
│   │       └── students.css
│   │
│   ├── js/
│   │   ├── main.js                    # Code JS dùng chung (gọi API, xử lý sự kiện)
│   │   ├── books.js                   # Logic riêng cho trang quản lý sách
│   │   ├── students.js                # Logic riêng cho học sinh
│   │   └── borrow.js                  # Logic riêng cho phiếu mượn - trả
│   │
│   └── assets/                        # Ảnh, icon, logo, file tĩnh khác
│       ├── img/
│       └── icons/
│
├── database/                          # 💾 Dữ liệu của thư viện
│   ├── library.accdb                  # CSDL Access (nếu dùng Access)
│   ├── seedData.js                    # Tạo dữ liệu mẫu (nếu dùng MongoDB)
│   └── backup/                        # File sao lưu dữ liệu
│
├── docs/                              # 📘 Tài liệu dự án
│   ├── API_Documentation.md           # Mô tả API (method, endpoint, ví dụ)
│   ├── Database_Structure.png         # Sơ đồ bảng dữ liệu
│   ├── UseCase_Diagram.png            # Biểu đồ use case
│   └── README.md
│
├── .env                               # Biến môi trường (PORT, DB_URL, v.v.)
├── .gitignore
└── README.md                          # Giới thiệu chung dự án
