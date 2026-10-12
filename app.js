const defaultBooks = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", available: true },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", category: "Biography", available: true },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", category: "Technology", available: false },
  { id: 4, title: "Atomic Habits", author: "James Clear", category: "Self-help", available: true }
];

function getData(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}
function saveData(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function getBooks() {
  if (!localStorage.getItem("libraryBooks")) saveData("libraryBooks", defaultBooks);
  return getData("libraryBooks", defaultBooks);
}
function getUsers() { return getData("libraryUsers", []); }
function getCurrentUser() { return getData("libraryCurrentUser", null); }
function showMessage(text, success = false) {
  const message = document.getElementById("message");
  if (message) { message.textContent = text; message.className = success ? "message success" : "message"; }
}

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
if (loginTab && signupTab) {
  loginTab.addEventListener("click", () => {
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("signupForm").classList.add("hidden");
    loginTab.classList.add("active"); signupTab.classList.remove("active"); showMessage("");
  });
  signupTab.addEventListener("click", () => {
    document.getElementById("signupForm").classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");
    signupTab.classList.add("active"); loginTab.classList.remove("active"); showMessage("");
  });
  document.getElementById("signupForm").addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    const role = document.getElementById("signupRole").value;
    const users = getUsers();
    if (users.some(user => user.email === email)) return showMessage("This email is already registered.");
    users.push({ name, email, password, role, borrowed: [] });
    saveData("libraryUsers", users);
    showMessage("Account created! Please log in.", true);
    document.getElementById("signupForm").reset();
    loginTab.click();
    document.getElementById("loginEmail").value = email;
  });
  document.getElementById("loginForm").addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const user = getUsers().find(item => item.email === email && item.password === password);
    if (!user) return showMessage("Account not found. Check details or sign up first.");
    saveData("libraryCurrentUser", { name: user.name, email: user.email, role: user.role });
    window.location.href = user.role === "admin" ? "admin.html" : "user.html";
  });
}

function logout() {
  localStorage.removeItem("libraryCurrentUser");
  window.location.href = "index.html";
}
window.logout = logout;

function requireRole(role) {
  const user = getCurrentUser();
  if (!user) { window.location.href = "index.html"; return null; }
  if (user.role !== role) {
    window.location.href = user.role === "admin" ? "admin.html" : "user.html";
    return null;
  }
  const welcome = document.getElementById("welcomeName");
  if (welcome) welcome.textContent = user.name;
  return user;
}

function renderAdmin() {
  const user = requireRole("admin");
  if (!user) return;
  const books = getBooks();
  const users = getUsers();
  document.getElementById("bookCount").textContent = books.length;
  document.getElementById("memberCount").textContent = users.length;
  document.getElementById("availableCount").textContent = books.filter(book => book.available).length;
  const query = (document.getElementById("bookSearch").value || "").toLowerCase();
  const filtered = books.filter(book => (book.title + " " + book.author + " " + book.category).toLowerCase().includes(query));
  document.getElementById("bookRows").innerHTML = filtered.map(book => `
    <tr><td><strong>${escapeHTML(book.title)}</strong></td><td>${escapeHTML(book.author)}</td><td>${escapeHTML(book.category)}</td>
    <td><span class="status ${book.available ? "" : "borrowed"}">${book.available ? "Available" : "Borrowed"}</span></td>
    <td><button class="small-btn" onclick="toggleBook(${book.id})">${book.available ? "Mark borrowed" : "Mark available"}</button></td></tr>`).join("") || '<tr><td colspan="5">No books found.</td></tr>';
  document.getElementById("memberList").innerHTML = users.map(member => `<span class="member-chip">👤 ${escapeHTML(member.name)} · ${escapeHTML(member.role)}</span>`).join("") || '<p class="muted">No accounts created yet.</p>';
}
function toggleBook(id) {
  const books = getBooks();
  const book = books.find(item => item.id === id);
  if (book) book.available = !book.available;
  saveData("libraryBooks", books); renderAdmin();
}
window.toggleBook = toggleBook;

const addBookBtn = document.getElementById("addBookBtn");
if (addBookBtn) {
  addBookBtn.addEventListener("click", () => {
    const title = prompt("Enter book title:");
    if (!title || !title.trim()) return;
    const author = prompt("Enter author name:") || "Unknown author";
    const category = prompt("Enter category:") || "General";
    const books = getBooks();
    books.push({ id: Date.now(), title: title.trim(), author: author.trim(), category: category.trim(), available: true });
    saveData("libraryBooks", books); renderAdmin();
  });
}
const bookSearch = document.getElementById("bookSearch");
if (bookSearch) bookSearch.addEventListener("input", renderAdmin);

function renderUser() {
  const user = requireRole("user");
  if (!user) return;
  const books = getBooks();
  const latestUser = getUsers().find(item => item.email === user.email);
  const borrowed = latestUser ? (latestUser.borrowed || []) : [];
  document.getElementById("userBookCount").textContent = books.length;
  document.getElementById("borrowedCount").textContent = borrowed.length;
  document.getElementById("userAvailableCount").textContent = books.filter(book => book.available).length;
  const query = (document.getElementById("userBookSearch").value || "").toLowerCase();
  const filtered = books.filter(book => (book.title + " " + book.author + " " + book.category).toLowerCase().includes(query));
  document.getElementById("bookCards").innerHTML = filtered.map(book => `
    <article class="book-card"><div class="book-cover">📘</div><div class="book-info">
      <h3>${escapeHTML(book.title)}</h3><p>${escapeHTML(book.author)} · ${escapeHTML(book.category)}</p>
      <span class="status ${book.available ? "" : "borrowed"}">${book.available ? "Available" : "Not available"}</span><br><br>
      ${book.available ? `<button class="primary" onclick="borrowBook(${book.id})">Borrow book</button>` : ""}
    </div></article>`).join("") || '<p class="empty">No matching books.</p>';
  document.getElementById("borrowedBooks").innerHTML = borrowed.length
    ? borrowed.map(title => `<div class="borrowed-item">📗 ${escapeHTML(title)}</div>`).join("")
    : '<p class="muted">You have not borrowed any books yet.</p>';
}
function borrowBook(id) {
  const user = getCurrentUser();
  const books = getBooks();
  const book = books.find(item => item.id === id);
  if (!user || !book || !book.available) return;
  const users = getUsers();
  const account = users.find(item => item.email === user.email);
  if (!account) return;
  account.borrowed = account.borrowed || [];
  account.borrowed.push(book.title);
  book.available = false;
  saveData("libraryUsers", users); saveData("libraryBooks", books); renderUser();
}
window.borrowBook = borrowBook;
const userBookSearch = document.getElementById("userBookSearch");
if (userBookSearch) userBookSearch.addEventListener("input", renderUser);

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
if (document.body.dataset.page === "admin") renderAdmin();
if (document.body.dataset.page === "user") renderUser();
