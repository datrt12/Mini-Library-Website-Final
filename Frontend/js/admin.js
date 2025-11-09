// Base API (backend)
const API_BASE = 'http://localhost:3000';

// Utility: get auth token (assumes stored in localStorage under 'authToken')
function getAuthToken() { return localStorage.getItem('authToken') || ''; }

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Fetch books and render table (includes image + edit/delete buttons)
async function fetchBooksAdmin() {
  const token = getAuthToken();
  try {
  const res = await fetch(`${API_BASE}/books`, { headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) } });
    if (!res.ok) {
      booksTableBody.innerHTML = '<tr><td colspan="9">Không thể tải danh sách sách.</td></tr>';
      console.error('Fetch books failed', res.status, res.statusText);
      return;
    }
    const books = await res.json();
    booksTableBody.innerHTML = '';
    books.forEach(book => {
      const id = book._id || book.id || '';
      const title = book.title || '';
      const bookID = book.bookID || '';
      const author = book.author || '';
      const category = book.category || '';
      const year = book.year || '';
      const available = (typeof book.available === 'boolean') ? (book.available ? 'Có' : 'Không') : '';
  const image = book.image || '';
  const imgSrc = image && image.startsWith('img/') ? ('../' + image) : image;
  const imgCell = image ? `<img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(title)}" style="width:50px;height:70px;object-fit:cover;border-radius:4px;"/>` : '<span style="font-size:12px;color:#888;">Không ảnh</span>';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(id)}</td>
        <td>${imgCell}</td>
        <td>${escapeHtml(title)}</td>
        <td>${escapeHtml(bookID)}</td>
        <td>${escapeHtml(author)}</td>
        <td>${escapeHtml(category)}</td>
        <td>${escapeHtml(String(year))}</td>
        <td>${escapeHtml(available)}</td>
        <td>
          <button class="btn btn-edit-book" data-id="${escapeHtml(id)}">Sửa</button>
          <button class="btn btn-delete-book" data-id="${escapeHtml(id)}">Xóa</button>
        </td>`;
      booksTableBody.appendChild(tr);
    });
    attachRowHandlers();
  } catch (err) {
    console.error('Error fetching books', err);
    booksTableBody.innerHTML = '<tr><td colspan="9">Lỗi khi tải dữ liệu sách.</td></tr>';
  }
}

function attachRowHandlers() {
  document.querySelectorAll('.btn-delete-book').forEach(btn => {
    btn.removeEventListener('click', onDeleteClick);
    btn.addEventListener('click', onDeleteClick);
  });
  document.querySelectorAll('.btn-edit-book').forEach(btn => {
    btn.removeEventListener('click', onEditClick);
    btn.addEventListener('click', onEditClick);
  });
}

async function onDeleteClick(e) {
  const id = e.currentTarget.getAttribute('data-id');
  if (!id) return;
  if (!confirm('Bạn có chắc muốn xóa sách này?')) return;
  const token = getAuthToken();
  try {
  const res = await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) } });
    const body = await res.json().catch(() => ({}));
    if (res.ok) {
      alert('Đã xóa sách');
      fetchBooksAdmin();
    } else {
      alert(body.message || 'Xóa thất bại');
    }
  } catch (err) {
    console.error('Delete error', err);
    alert('Lỗi khi xóa sách');
  }
}

function onEditClick(e) {
  const id = e.currentTarget.getAttribute('data-id');
  const row = e.currentTarget.closest('tr');
  if (!row) return;
  const cells = row.querySelectorAll('td');
  document.getElementById('book-title').value = cells[2].textContent.trim();
  document.getElementById('book-bookid').value = cells[3].textContent.trim();
  document.getElementById('book-author').value = cells[4].textContent.trim();
  document.getElementById('book-category').value = cells[5].textContent.trim();
  document.getElementById('book-year').value = cells[6].textContent.trim();
  document.getElementById('book-available').checked = cells[7].textContent.trim() === 'Có';
  const imgTag = row.querySelector('img');
  if (imgTag && !imgTag.src.startsWith('data:')) { imageUrlInput.value = imgTag.src; } else { imageUrlInput.value = ''; }
  editingBookId = id;
  submitBookBtn.textContent = 'Cập nhật';
  cancelEditBtn.style.display = 'inline-block';
}

cancelEditBtn?.addEventListener('click', () => {
  editingBookId = null;
  addBookForm.reset();
  if (imageUrlInput) imageUrlInput.value = '';
  if (imageFileInput) imageFileInput.value = '';
  submitBookBtn.textContent = 'Thêm sách';
  cancelEditBtn.style.display = 'none';
});

// Handle create/update submit
addBookForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addBookForm);
  let title = (formData.get('title') || '').toString().trim();
  let bookID = (formData.get('bookID') || '').toString().trim();
  const author = (formData.get('author') || '').toString().trim();
  const category = (formData.get('category') || '').toString().trim();
  const yearRaw = formData.get('year');
  const available = !!formData.get('available');
  if (!title || !author) { alert('Vui lòng nhập tiêu đề và tác giả'); return; }
  if (!bookID) bookID = 'BK' + Date.now();
  const year = yearRaw ? Number(yearRaw) : undefined;

  // Image upload logic
  let imageField = null;
  const file = imageFileInput?.files?.[0];
  const urlVal = imageUrlInput?.value.trim();
  try {
    if (file) {
  const fd = new FormData(); fd.append('file', file);
  const upRes = await fetch(`${API_BASE}/books/upload`, { method: 'POST', headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, body: fd });
      const upJson = await upRes.json();
      if (!upRes.ok || !upJson.image) { alert(upJson.message || 'Upload ảnh thất bại'); return; }
      imageField = upJson.image;
    } else if (urlVal) {
  const upRes = await fetch(`${API_BASE}/books/upload`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, body: JSON.stringify({ imageUrl: urlVal }) });
      const upJson = await upRes.json();
      if (!upRes.ok || !upJson.image) { alert(upJson.message || 'Tải ảnh URL thất bại'); return; }
      imageField = upJson.image;
    } else if (editingBookId) {
      // Keep existing
      const existingRow = [...booksTableBody.querySelectorAll('tr')].find(r => r.querySelector('.btn-edit-book')?.getAttribute('data-id') === editingBookId);
      const existingImg = existingRow?.querySelector('img');
      if (existingImg) {
        let src = existingImg.getAttribute('src') || '';
        // normalize '../img/...' -> 'img/...'
        const idx = src.lastIndexOf('/img/');
        if (idx !== -1) src = src.substring(idx + 1); // drop leading path up to 'img/...'
        imageField = src;
      }
    }
  } catch (imgErr) { console.error('Image error', imgErr); alert('Lỗi xử lý ảnh'); return; }

  const payload = { title, bookID, author, category, year, available, ...(imageField ? { image: imageField } : {}) };
  const token = getAuthToken();
  const method = editingBookId ? 'PUT' : 'POST';
  const endpoint = editingBookId ? `${API_BASE}/books/${editingBookId}` : `${API_BASE}/books`;
  try {
    const res = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, body: JSON.stringify(payload) });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401) {
        alert('Chưa đăng nhập hoặc token hết hạn. Vui lòng đăng nhập lại.');
      } else if (res.status === 403) {
        alert('Tài khoản không có quyền admin. Không thể thêm/sửa sách.');
      } else if (res.status === 400) {
        alert(body.message || 'Dữ liệu không hợp lệ (thiếu tiêu đề/tác giả hoặc mã sách trùng).');
      } else {
        alert(body.message || (editingBookId ? 'Cập nhật thất bại' : 'Thêm sách thất bại'));
      }
      return;
    }
    addBookForm.reset();
    if (imageUrlInput) imageUrlInput.value = '';
    if (imageFileInput) imageFileInput.value = '';
    editingBookId ? alert('Cập nhật sách thành công') : alert('Thêm sách thành công');
    editingBookId = null;
    submitBookBtn.textContent = 'Thêm sách';
    cancelEditBtn.style.display = 'none';
    fetchBooksAdmin();
  } catch (err) {
    console.error('Save book error', err);
    alert('Lỗi khi lưu sách');
  }
});

// Initial load
window.addEventListener('DOMContentLoaded', fetchBooksAdmin);

export { fetchBooksAdmin };
