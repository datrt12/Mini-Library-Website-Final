// Quick API smoke tests
import fetch from 'node-fetch';

const API = process.env.API || 'http://localhost:3000';
const admin = { username: 'admin_test', password: '123456', role: 'admin' };
const user = { username: 'user_test', password: '123456' };

function log(title, data){
  console.log(`\n=== ${title} ===`);
  console.log(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
}

async function ensureUser(u){
  let r = await fetch(`${API}/api/users/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(u) });
  if(r.status === 400){
    log('register skip (exists)', await r.json());
  } else {
    log('register', await r.json());
  }
}

async function login(u){
  const r = await fetch(`${API}/api/users/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username: u.username, password: u.password }) });
  const data = await r.json();
  log('login', { status: r.status, data });
  if(!r.ok) throw new Error('login failed');
  return data.token;
}

async function addBook(token){
  const payload = { title: 'Test Book', author: 'QA', bookID: 'TB'+Date.now(), category: 'Test', year: 2025, available: true };
  const r = await fetch(`${API}/books`, { method:'POST', headers:{'Content-Type':'application/json', Authorization: `Bearer ${token}`}, body: JSON.stringify(payload) });
  const data = await r.json();
  log('add book', { status: r.status, data });
  if(!r.ok) throw new Error('add book failed');
  return data;
}

async function listBooks(){
  const r = await fetch(`${API}/books`);
  const data = await r.json();
  log('list books', { status: r.status, count: Array.isArray(data)? data.length : 'n/a' });
}

(async ()=>{
  try{
    await ensureUser(admin);
    await ensureUser(user);
    const token = await login(admin);
    await addBook(token);
    await listBooks();
    console.log('\nAll tests passed.');
  }catch(err){
    console.error('Test failed:', err.message);
    process.exit(1);
  }
})();
