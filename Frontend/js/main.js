// Frontend main.js - fetch and display books on landing page
const API_BASE = 'http://localhost:3000';

async function fetchBooks() {
	try {
		const res = await fetch(`${API_BASE}/books`);
		const listEl = document.getElementById('book-list');
		if (!listEl) return;
		if (!res.ok) {
			listEl.innerHTML = '<p>Không thể tải danh sách sách.</p>';
			return;
		}
		const books = await res.json();
		if (!Array.isArray(books) || books.length === 0) {
			listEl.innerHTML = '<p>Chưa có sách nào.</p>';
			return;
		}
		listEl.innerHTML = '';
		books.forEach(b => {
			const div = document.createElement('div');
			div.className = 'book-card';
			const img = b.image ? `<img src="${b.image.startsWith('img/')? ('../'+b.image): b.image}" alt="${escapeHtml(b.title||'Sách')}" />` : '';
			const canBorrow = !!b.available;
			const loggedIn = !!localStorage.getItem('authToken');
			let actionHtml = '';
			if (canBorrow) {
				if (loggedIn) {
					actionHtml = `<button class=\"btn btn-borrow\" data-book-id=\"${b._id}\">Mượn</button>`;
				} else {
					actionHtml = `<button class=\"btn btn-borrow\" disabled title=\"Đăng nhập để mượn\">Đăng nhập để mượn</button>`;
				}
			} else {
				actionHtml = '<div style="font-size:13px;color:#D32F2F;font-weight:bold;">Đang được mượn</div>';
			}
			div.innerHTML = `
				${img}
				<h3>${escapeHtml(b.title || '')}</h3>
				<p>Tác giả: ${escapeHtml(b.author || 'Không rõ')}</p>
				<p>Mã: ${escapeHtml(b.bookID || '')}</p>
				<p>Trạng thái: <span class="${b.available?'status-available':'status-borrowed'}">${b.available?'Có sẵn':'Đã mượn'}</span></p>
				<div class="borrow-action">${actionHtml}</div>
			`;
			listEl.appendChild(div);
		});
		attachBorrowHandlers();
	} catch (err) {
		console.error('Fetch books error', err);
	}
}

function attachBorrowHandlers(){
	const buttons = document.querySelectorAll('.btn-borrow[data-book-id]');
	buttons.forEach(btn => {
		btn.addEventListener('click', async (e)=>{
			const bookId = btn.getAttribute('data-book-id');
			if(!bookId) return;
			btn.disabled = true;
			btn.textContent = 'Đang xử lý...';
			try {
				const token = localStorage.getItem('authToken');
				if(!token){
					alert('Vui lòng đăng nhập');
					window.location.href = 'login.html';
					return;
				}
				// Decode user id from JWT payload (no verification, just decode)
				let userId = null;
				try {
					const parts = token.split('.');
					if(parts.length === 3){
						const payload = JSON.parse(atob(parts[1]));
						userId = payload.id;
					}
				} catch(_){ /* ignore */ }
				if(!userId){
					alert('Không xác định được tài khoản. Vui lòng đăng nhập lại.');
					localStorage.removeItem('authToken');
					window.location.href = 'login.html';
					return;
				}
				const res = await fetch(`${API_BASE}/borrows`, {
					method:'POST',
					headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
					body: JSON.stringify({ bookId, userId })
				});
				const data = await res.json().catch(()=>({}));
				if(!res.ok){
					alert(data.message || 'Mượn sách thất bại');
					btn.disabled=false; btn.textContent='Mượn';
					return;
				}
				alert('Mượn sách thành công');
				fetchBooks();
			} catch(err){
				console.error('Borrow error', err);
				alert('Lỗi mượn sách');
				btn.disabled=false; btn.textContent='Mượn';
			}
		});
	});
}

function escapeHtml(str){
	if(typeof str!== 'string') return str;
	return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

document.addEventListener('DOMContentLoaded', fetchBooks);
