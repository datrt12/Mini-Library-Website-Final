// Frontend authentication logic (login & register)
const API_BASE = 'http://localhost:3000';

function qs(sel){return document.querySelector(sel);} // tiny helper
function escapeHtml(str){if(typeof str!=='string')return str;return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}

// Register form handler
const registerForm = qs('#register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
  const username = qs('#username').value.trim();
  const password = qs('#password').value.trim();
  const roleEl = qs('#role');
  const role = roleEl ? roleEl.value : undefined;
    // Optional email not used in backend schema; ignoring for now
    if(!username || !password){alert('Nhập đầy đủ tên và mật khẩu');return;}
    try {
      const res = await fetch(`${API_BASE}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, ...(role ? { role } : {}) })
      });
      const data = await res.json().catch(()=>({}));
      if(!res.ok){alert(data.message || 'Đăng ký thất bại');return;}
      alert('Đăng ký thành công. Vui lòng đăng nhập.');
      window.location.href = 'login.html';
    } catch(err){
      console.error('Register error', err);
      alert('Lỗi đăng ký');
    }
  });
}

// Login form handler
const loginForm = qs('#login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = qs('#username').value.trim();
    const password = qs('#password').value.trim();
    if(!username || !password){alert('Nhập đầy đủ tên và mật khẩu');return;}
    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json().catch(()=>({}));
      if(!res.ok){alert(data.message || 'Đăng nhập thất bại');return;}
      if(data.token){
        localStorage.setItem('authToken', data.token);
        alert('Đăng nhập thành công');
        // Decode role and route accordingly
        try {
          const parts = data.token.split('.');
          const payload = JSON.parse(atob(parts[1]));
          const role = payload.role;
          if(role === 'admin'){
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'index.html';
          }
        } catch(_){
          window.location.href = 'index.html';
        }
      } else {
        alert('Không nhận được token');
      }
    } catch(err){
      console.error('Login error', err);
      alert('Lỗi đăng nhập');
    }
  });
}

// Optional: logout button logic if present
const logoutBtn = qs('#logout-btn');
if (logoutBtn){
  logoutBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    localStorage.removeItem('authToken');
    alert('Đã đăng xuất');
    window.location.href = 'login.html';
  });
}
