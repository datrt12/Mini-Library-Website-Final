# Hướng dẫn Test API Book với Postman

## Cấu hình cơ bản
- **Base URL**: `http://localhost:3000`
- **Prefix**: `/books`

## Các endpoint có sẵn

### 1. GET - Lấy tất cả sách
**Endpoint**: `GET http://localhost:3000/books`

**Headers**: Không cần

**Response mẫu**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Lập trình JavaScript",
    "bookID": "BOOK001",
    "author": "Nguyễn Văn A",
    "category": "Công nghệ",
    "year": 2023,
    "available": true
  }
]
```

---

### 2. GET - Lấy sách theo ID
**Endpoint**: `GET http://localhost:3000/books/:id`

**Ví dụ**: `GET http://localhost:3000/books/507f1f77bcf86cd799439011`

**Headers**: Không cần

**Response thành công** (200):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Lập trình JavaScript",
  "bookID": "BOOK001",
  "author": "Nguyễn Văn A",
  "category": "Công nghệ",
  "year": 2023,
  "available": true
}
```

**Response lỗi** (404):
```json
{
  "message": "Không tìm thấy sách"
}
```

---

### 3. POST - Thêm sách mới (Cần xác thực Admin)
**Endpoint**: `POST http://localhost:3000/books`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body** (JSON):
```json
{
  "title": "Học MongoDB từ A-Z",
  "bookID": "BOOK002",
  "author": "Trần Thị B",
  "category": "Database",
  "year": 2024,
  "available": true
}
```

**Response thành công** (201):
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Học MongoDB từ A-Z",
  "bookID": "BOOK002",
  "author": "Trần Thị B",
  "category": "Database",
  "year": 2024,
  "available": true
}
```

**Lưu ý**: 
- `title`, `bookID`, `author` là bắt buộc
- `bookID` phải unique (không trùng lặp)
- Cần đăng nhập với tài khoản admin để tạo sách

---

### 4. PUT - Cập nhật sách (Cần xác thực Admin)
**Endpoint**: `PUT http://localhost:3000/books/:id`

**Ví dụ**: `PUT http://localhost:3000/books/507f1f77bcf86cd799439011`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body** (JSON):
```json
{
  "title": "Lập trình JavaScript Nâng cao",
  "author": "Nguyễn Văn A",
  "category": "Công nghệ",
  "year": 2024,
  "available": false
}
```

**Response thành công** (200):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Lập trình JavaScript Nâng cao",
  "bookID": "BOOK001",
  "author": "Nguyễn Văn A",
  "category": "Công nghệ",
  "year": 2024,
  "available": false
}
```

---

### 5. DELETE - Xóa sách (Cần xác thực Admin)
**Endpoint**: `DELETE http://localhost:3000/books/:id`

**Ví dụ**: `DELETE http://localhost:3000/books/507f1f77bcf86cd799439011`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response thành công** (200):
```json
{
  "message": "Đã xóa sách thành công"
}
```

**Response lỗi** (404):
```json
{
  "message": "Không tìm thấy sách để xóa"
}
```

---

### 6. POST - Upload ảnh sách (Cần xác thực Admin)
**Endpoint**: `POST http://localhost:3000/books/upload`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Cách 1: Upload file multipart
**Body**: 
- Chọn `form-data`
- Key: `file` (type: File)
- Value: Chọn file ảnh từ máy tính

**Response**:
```json
{
  "image": "img/image-1699516800000.jpg"
}
```

#### Cách 2: Upload bằng URL
**Headers**:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body** (JSON):
```json
{
  "imageUrl": "https://example.com/book-cover.jpg"
}
```

**Response**:
```json
{
  "image": "img/book-cover-1699516800000.jpg"
}
```

#### Cách 3: Upload bằng Base64
**Headers**:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body** (JSON):
```json
{
  "imageBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
}
```

**Response**:
```json
{
  "image": "img/image-1699516800000.png"
}
```

---

## Lấy JWT Token để xác thực

Trước khi test các endpoint cần admin, bạn cần đăng nhập để lấy token:

### Đăng nhập
**Endpoint**: `POST http://localhost:3000/api/users/login`

**Headers**:
```
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "role": "admin"
  }
}
```

**Sau khi có token**, copy token và dùng cho các request cần xác thực:
- Vào tab Headers
- Thêm key: `Authorization`
- Value: `Bearer YOUR_TOKEN_HERE` (có khoảng trắng giữa Bearer và token)

---

## Thứ tự test đề xuất

1. **GET** `/books` - Xem danh sách sách hiện tại
2. **POST** `/api/users/login` - Đăng nhập lấy token admin
3. **POST** `/books` - Tạo sách mới (với token)
4. **GET** `/books/:id` - Lấy thông tin sách vừa tạo
5. **POST** `/books/upload` - Upload ảnh cho sách
6. **PUT** `/books/:id` - Cập nhật thông tin sách (thêm trường image)
7. **DELETE** `/books/:id` - Xóa sách (nếu cần)

---

## Lưu ý quan trọng

1. **Server phải đang chạy**: Chạy `node server.js` trong thư mục Backend
2. **MongoDB phải kết nối**: Kiểm tra file `.env` có đúng connection string
3. **Đối với POST/PUT**: Nhớ set header `Content-Type: application/json`
4. **Đối với các endpoint cần admin**: Nhớ thêm header `Authorization: Bearer {token}`
5. **BookID phải unique**: Không được trùng với sách đã có trong database

---

## Các mã lỗi thường gặp

- **400**: Bad Request - Dữ liệu gửi lên không hợp lệ
- **401**: Unauthorized - Chưa đăng nhập hoặc token không hợp lệ
- **403**: Forbidden - Không có quyền admin
- **404**: Not Found - Không tìm thấy sách
- **500**: Internal Server Error - Lỗi server

---

## Collection Postman mẫu

Bạn có thể import collection này vào Postman:

```json
{
  "info": {
    "name": "Library Book API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Books",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/books"
      }
    },
    {
      "name": "Get Book By ID",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/books/{{bookId}}"
      }
    },
    {
      "name": "Create Book",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Sample Book\",\n  \"bookID\": \"BOOK999\",\n  \"author\": \"Author Name\",\n  \"category\": \"Category\",\n  \"year\": 2024,\n  \"available\": true\n}"
        },
        "url": "http://localhost:3000/books"
      }
    },
    {
      "name": "Update Book",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Updated Title\",\n  \"available\": false\n}"
        },
        "url": "http://localhost:3000/books/{{bookId}}"
      }
    },
    {
      "name": "Delete Book",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": "http://localhost:3000/books/{{bookId}}"
      }
    },
    {
      "name": "Upload Book Image",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "file",
              "type": "file",
              "src": "/path/to/image.jpg"
            }
          ]
        },
        "url": "http://localhost:3000/books/upload"
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"admin123\"\n}"
        },
        "url": "http://localhost:3000/api/users/login"
      }
    }
  ]
}
```

Copy JSON trên và import vào Postman: File → Import → Raw text
