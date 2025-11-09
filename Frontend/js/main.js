// Dữ liệu mẫu
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let books = [
  {
    id: 1,
    title: "Đắc nhân tâm",
    author: "Dale Carnegie",
    category: "Kỹ năng sống",
    description: "Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử",
    status: "available",
    image: "https://via.placeholder.com/200x280/4A90E2/ffffff?text=Sách+1",
    borrowCount: 45,
  },
  {
    id: 2,
    title: "Tôi tài giỏi, bạn cũng thế",
    author: "Adam Khoo",
    category: "Phát triển bản thân",
    description: "Hướng dẫn phát triển tư duy tích cực và kỹ năng học tập",
    status: "borrowed",
    image: "https://via.placeholder.com/200x280/50C878/ffffff?text=Sách+2",
    borrowCount: 32,
  },
  {
    id: 3,
    title: "Nhà giả kim",
    author: "Paulo Coelho",
    category: "Tiểu thuyết",
    description:
      "Câu chuyện về hành trình tìm kiếm ước mơ và ý nghĩa cuộc sống",
    status: "available",
    image: "https://via.placeholder.com/200x280/FF6B6B/ffffff?text=Sách+3",
    borrowCount: 67,
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "Lịch sử",
    description: "Lược sử loài người từ thời nguyên thủy đến hiện đại",
    status: "available",
    image: "https://via.placeholder.com/200x280/9B59B6/ffffff?text=Sách+4",
    borrowCount: 28,
  },
];

let users = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "admin@library.com",
    phone: "0123456789",
    role: "admin",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "reader1@example.com",
    phone: "0987654321",
    role: "reader",
    joinDate: "2024-03-20",
  },
];

let borrowRecords = [
  {
    id: 1,
    userId: 2,
    bookId: 2,
    borrowDate: "2024-10-20",
    returnDate: null,
    status: "borrowed",
  },
];

// Utility Functions
function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;

  // Insert at the top of the main content
  const main =
    document.querySelector("main") || document.querySelector(".container");
  if (main) {
    main.insertBefore(alertDiv, main.firstChild);

    // Auto remove after 3 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

// Modal Functions
function openLoginModal() {
  document.getElementById("loginModal").style.display = "block";
}

function openRegisterModal() {
  document.getElementById("registerModal").style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

// Authentication Functions
function login(email, password, userType) {
  // Demo accounts
  const demoAccounts = {
    admin: { email: "admin@library.com", password: "admin123", user: users[0] },
    reader: {
      email: "reader@library.com",
      password: "reader123",
      user: users[1],
    },
  };

  // Check demo accounts first
  if (
    demoAccounts[userType] &&
    email === demoAccounts[userType].email &&
    password === demoAccounts[userType].password
  ) {
    currentUser = demoAccounts[userType].user;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    showAlert(`Đăng nhập thành công! Chào mừng ${currentUser.name}`);
    updateHeaderForLoggedInUser();
    closeModal("loginModal");

    // Redirect based on role
    if (currentUser.role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "user-dashboard.html";
    }

    return true;
  }

  // Check regular users
  const user = users.find((u) => u.email === email && u.role === userType);
  if (user) {
    // For demo purposes, accept any password for existing users
    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));

    showAlert(`Đăng nhập thành công! Chào mừng ${user.name}`);
    updateHeaderForLoggedInUser();
    closeModal("loginModal");

    // Redirect based on role
    if (user.role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "user-dashboard.html";
    }

    return true;
  }

  showAlert(
    "Email hoặc mật khẩu không đúng! Sử dụng tài khoản demo: admin@library.com/admin123 hoặc reader@library.com/reader123",
    "error"
  );
  return false;
}

function register(userData) {
  // Check if email already exists
  const existingUser = users.find((u) => u.email === userData.email);
  if (existingUser) {
    showAlert("Email đã được sử dụng!", "error");
    return false;
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    role: "reader",
    joinDate: new Date().toISOString().split("T")[0],
  };

  users.push(newUser);
  showAlert("Đăng ký thành công! Vui lòng đăng nhập.");
  closeModal("registerModal");
  openLoginModal();

  return true;
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  showAlert("Đăng xuất thành công!");
  updateHeaderForLoggedOutUser();
  window.location.href = "index.html";
}

function updateHeaderForLoggedInUser() {
  const authButtons = document.querySelector(".auth-buttons");
  if (authButtons && currentUser) {
    authButtons.innerHTML = `
            <div class="user-menu">
                <span>Xin chào, ${currentUser.name}</span>
                <button class="btn btn-outline" onclick="logout()">Đăng xuất</button>
            </div>
        `;
  }
}

function updateHeaderForLoggedOutUser() {
  const authButtons = document.querySelector(".auth-buttons");
  if (authButtons) {
    authButtons.innerHTML = `
            <button class="btn btn-outline" onclick="openLoginModal()">Đăng nhập</button>
            <button class="btn btn-primary" onclick="openRegisterModal()">Đăng ký</button>
        `;
  }
}

// Search Functions
function searchBooks(query = null) {
  const searchQuery =
    query || document.getElementById("searchInput")?.value || "";

  if (!searchQuery.trim()) {
    showAlert("Vui lòng nhập từ khóa tìm kiếm!", "warning");
    return;
  }

  const results = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Store search results and redirect to books page
  localStorage.setItem("searchResults", JSON.stringify(results));
  localStorage.setItem("searchQuery", searchQuery);
  window.location.href = "books.html";
}

function filterBooks(category = "", author = "", status = "") {
  let filtered = [...books];

  if (category) {
    filtered = filtered.filter((book) => book.category === category);
  }

  if (author) {
    filtered = filtered.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  if (status) {
    filtered = filtered.filter((book) => book.status === status);
  }

  return filtered;
}

// Book Functions
function viewBookDetail(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    localStorage.setItem("selectedBook", JSON.stringify(book));
    window.location.href = "book-detail.html";
  }
}

function borrowBook(bookId) {
  if (!currentUser) {
    showAlert("Vui lòng đăng nhập để mượn sách!", "warning");
    openLoginModal();
    return false;
  }

  const book = books.find((b) => b.id === bookId);
  if (!book) {
    showAlert("Không tìm thấy sách!", "error");
    return false;
  }

  if (book.status === "borrowed") {
    showAlert("Sách đã được mượn!", "warning");
    return false;
  }

  // Create borrow record
  const borrowRecord = {
    id: borrowRecords.length + 1,
    userId: currentUser.id,
    bookId: bookId,
    borrowDate: new Date().toISOString().split("T")[0],
    returnDate: null,
    status: "borrowed",
  };

  borrowRecords.push(borrowRecord);

  // Update book status
  book.status = "borrowed";
  book.borrowCount = (book.borrowCount || 0) + 1;

  showAlert(`Đã đăng ký mượn sách "${book.title}" thành công!`);
  return true;
}

function returnBook(bookId, notes = "") {
  const borrowRecord = borrowRecords.find(
    (record) => record.bookId === bookId && record.status === "borrowed"
  );

  if (!borrowRecord) {
    showAlert("Không tìm thấy thông tin mượn sách!", "error");
    return false;
  }

  // Update borrow record
  borrowRecord.returnDate = new Date().toISOString().split("T")[0];
  borrowRecord.status = "returned";
  borrowRecord.notes = notes;

  // Update book status
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.status = "available";
    showAlert(`Đã trả sách "${book.title}" thành công!`);
  }

  return true;
}

// Return Book Modal Functions
function openReturnBookModal(recordId) {
  const record = borrowRecords.find((r) => r.id === recordId);
  if (!record) return;

  const book = books.find((b) => b.id === record.bookId);
  if (!book) return;

  // Fill modal with book info
  document.getElementById("returnBookTitle").textContent = book.title;
  document.getElementById("returnBookAuthor").textContent = book.author;
  document.getElementById("returnBorrowDate").textContent = formatDate(
    record.borrowDate
  );

  // Set current date as return date
  document.getElementById("returnDate").value = new Date()
    .toISOString()
    .split("T")[0];
  document.getElementById("returnNotes").value = "";

  // Store record ID for later use
  document.getElementById("returnBookModal").dataset.recordId = recordId;
  document.getElementById("returnBookModal").style.display = "block";
}

function submitReturnBook() {
  const modal = document.getElementById("returnBookModal");
  const recordId = parseInt(modal.dataset.recordId);
  const notes = document.getElementById("returnNotes").value;

  const record = borrowRecords.find((r) => r.id === recordId);
  if (record && returnBook(record.bookId, notes)) {
    closeModal("returnBookModal");

    // Refresh page if we're on dashboard
    if (typeof loadUserDashboard === "function") {
      loadUserDashboard();
    }
  }
}

function requestReturn(recordId) {
  openReturnBookModal(recordId);
}

// Admin Functions
function addBook(bookData) {
  const newBook = {
    id: books.length + 1,
    ...bookData,
    status: "available",
    borrowCount: 0,
  };

  books.push(newBook);
  showAlert("Thêm sách thành công!");
  return true;
}

function updateBook(bookId, bookData) {
  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...bookData };
    showAlert("Cập nhật sách thành công!");
    return true;
  }

  showAlert("Không tìm thấy sách!", "error");
  return false;
}

function deleteBook(bookId) {
  if (confirm("Bạn có chắc chắn muốn xóa sách này?")) {
    const bookIndex = books.findIndex((b) => b.id === bookId);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      showAlert("Xóa sách thành công!");
      return true;
    }
  }
  return false;
}

function manageUser(userId, action) {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    showAlert("Không tìm thấy người dùng!", "error");
    return false;
  }

  switch (action) {
    case "activate":
      user.status = "active";
      showAlert(`Đã kích hoạt tài khoản ${user.name}`);
      break;
    case "deactivate":
      user.status = "inactive";
      showAlert(`Đã vô hiệu hóa tài khoản ${user.name}`);
      break;
    case "delete":
      if (confirm(`Bạn có chắc chắn muốn xóa tài khoản ${user.name}?`)) {
        const userIndex = users.findIndex((u) => u.id === userId);
        users.splice(userIndex, 1);
        showAlert(`Đã xóa tài khoản ${user.name}`);
      }
      break;
  }

  return true;
}

// Statistics Functions
function getStatistics() {
  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.status === "available").length;
  const borrowedBooks = books.filter((b) => b.status === "borrowed").length;
  const totalUsers = users.filter((u) => u.role === "reader").length;
  const totalBorrows = borrowRecords.length;

  return {
    totalBooks,
    availableBooks,
    borrowedBooks,
    totalUsers,
    totalBorrows,
  };
}

function getMostPopularBooks(limit = 5) {
  return books
    .sort((a, b) => (b.borrowCount || 0) - (a.borrowCount || 0))
    .slice(0, limit);
}

function getRecentBorrows(limit = 10) {
  return borrowRecords
    .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
    .slice(0, limit)
    .map((record) => ({
      ...record,
      userName: users.find((u) => u.id === record.userId)?.name || "Unknown",
      bookTitle: books.find((b) => b.id === record.bookId)?.title || "Unknown",
    }));
}

// Event Listeners for Forms
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is already logged in
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateHeaderForLoggedInUser();
  }

  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      const userType = document.querySelector(
        'input[name="userType"]:checked'
      ).value;

      login(email, password, userType);
    });
  }

  // Register form
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        showAlert("Mật khẩu xác nhận không khớp!", "error");
        return;
      }

      const userData = {
        name: document.getElementById("registerName").value,
        email: document.getElementById("registerEmail").value,
        phone: document.getElementById("registerPhone").value,
      };

      register(userData);
    });
  }

  // Search form
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchBooks();
      }
    });
  }

  // Load page-specific data
  loadPageData();
});

function loadPageData() {
  const path = window.location.pathname;
  const page = path.split("/").pop().split(".")[0];

  switch (page) {
    case "books":
      loadBooksPage();
      break;
    case "book-detail":
      loadBookDetail();
      break;
    case "user-dashboard":
      loadUserDashboard();
      break;
    case "admin-dashboard":
      loadAdminDashboard();
      break;
    case "admin-books":
      loadAdminBooks();
      break;
    case "admin-users":
      loadAdminUsers();
      break;
    case "admin-borrows":
      loadAdminBorrows();
      break;
  }
}

function loadBooksPage() {
  // This function will be implemented in books.js
}

function loadBookDetail() {
  // This function will be implemented in book-detail.js
}

function loadUserDashboard() {
  // This function will be implemented in user-dashboard.js
}

function loadAdminDashboard() {
  // This function will be implemented in admin-dashboard.js
}

function loadAdminBooks() {
  // This function will be implemented in admin-books.js
}

function loadAdminUsers() {
  // This function will be implemented in admin-users.js
}

function loadAdminBorrows() {
  // This function will be implemented in admin-borrows.js
}

// Export functions for use in other files
window.libraryApp = {
  get currentUser() {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  },
  books,
  users,
  borrowRecords,
  searchBooks,
  filterBooks,
  viewBookDetail,
  borrowBook,
  returnBook,
  addBook,
  updateBook,
  deleteBook,
  manageUser,
  getStatistics,
  getMostPopularBooks,
  getRecentBorrows,
  showAlert,
  formatDate,
  openLoginModal,
  openRegisterModal,
  closeModal,
  login,
  register,
  logout,
  openReturnBookModal,
  submitReturnBook,
  requestReturn,
};
