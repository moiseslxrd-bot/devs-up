require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3001;
const SECRET = process.env.SECRET_KEY || "fallback_secret";

app.use(cors());
app.use(express.json());

// Banco de dados
const db = new Database("devsup.db");

// Cria tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    tag TEXT NOT NULL,
    emoji TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Cria admin padrão se não existir
const adminUser = process.env.ADMIN_USER || "admin";
const adminPass = process.env.ADMIN_PASS || "Moi.752573";
const adminExists = db.prepare("SELECT * FROM users WHERE username = ?").get(adminUser);
if (!adminExists) {
  const hash = bcrypt.hashSync(adminPass, 10);
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(adminUser, hash);
}

// Insere cursos iniciais
const count = db.prepare("SELECT COUNT(*) as total FROM courses").get();
if (count.total === 0) {
  const insert = db.prepare("INSERT INTO courses (title, description, price, tag, emoji) VALUES (?, ?, ?, ?, ?)");
  const courses = [
    ["O básico que não te ensinaram de JavaScript", "Arrays, objetos, loops e callbacks explicados com exemplos que realmente fazem sentido.", "R$ 27", "Desenrola JS", "🧠"],
    ["Git sem medo: do commit ao deploy", "Aprenda o fluxo real de trabalho em equipe: clone, branch, push, pull request.", "R$ 22", "Git real", "🔀"],
    ["React na prática: construa seu primeiro app", "Crie um site do zero entendendo componente, estado e props.", "R$ 34", "React mão na massa", "⚛️"],
    ["Desbuga sua lógica: exercícios comentados", "Resolução de 15 problemas comuns de lógica e algoritmos explicados linha a linha.", "R$ 19", "Algoritmos", "🔍"]
  ];
  const insertMany = db.transaction((courses) => {
    for (const course of courses) insert.run(...course);
  });
  insertMany(courses);
}

// Middleware de autenticação
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

// ROTAS PÚBLICAS

app.get("/courses", (req, res) => {
  const courses = db.prepare("SELECT * FROM courses").all();
  res.json(courses);
});

app.post("/suggestions", (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Título e descrição são obrigatórios." });
  }
  db.prepare("INSERT INTO suggestions (title, description) VALUES (?, ?)").run(title, description);
  res.status(201).json({ message: "Sugestão enviada com sucesso!" });
});

// LOGIN

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });
  
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: "Senha incorreta" });
  
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "24h" });
  res.json({ token, username: user.username });
});

// ROTAS PROTEGIDAS (ADMIN)

app.get("/admin/suggestions", authMiddleware, (req, res) => {
  const suggestions = db.prepare("SELECT * FROM suggestions ORDER BY created_at DESC").all();
  res.json(suggestions);
});

app.post("/admin/courses", authMiddleware, (req, res) => {
  const { title, description, price, tag, emoji } = req.body;
  if (!title || !description || !price || !tag || !emoji) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
  db.prepare("INSERT INTO courses (title, description, price, tag, emoji) VALUES (?, ?, ?, ?, ?)").run(title, description, price, tag, emoji);
  res.status(201).json({ message: "Curso criado com sucesso!" });
});

app.delete("/admin/courses/:id", authMiddleware, (req, res) => {
  db.prepare("DELETE FROM courses WHERE id = ?").run(req.params.id);
  res.json({ message: "Curso removido com sucesso!" });
});

// Listar todos os cursos (admin)
app.get("/admin/courses", authMiddleware, (req, res) => {
  const courses = db.prepare("SELECT * FROM courses ORDER BY id DESC").all();
  res.json(courses);
});

// Atualizar curso
app.put("/admin/courses/:id", authMiddleware, (req, res) => {
  const { title, description, price, tag, emoji } = req.body;
  db.prepare("UPDATE courses SET title=?, description=?, price=?, tag=?, emoji=? WHERE id=?")
    .run(title, description, price, tag, emoji, req.params.id);
  res.json({ message: "Curso atualizado!" });
});

// Estatísticas
app.get("/admin/stats", authMiddleware, (req, res) => {
  const totalCourses = db.prepare("SELECT COUNT(*) as total FROM courses").get();
  const totalSuggestions = db.prepare("SELECT COUNT(*) as total FROM suggestions").get();
  res.json({ courses: totalCourses.total, suggestions: totalSuggestions.total });
});

// Deletar sugestão
app.delete("/admin/suggestions/:id", authMiddleware, (req, res) => {
  db.prepare("DELETE FROM suggestions WHERE id = ?").run(req.params.id);
  res.json({ message: "Sugestão removida!" });
});

// Chave PIX (admin define)
app.get("/admin/pix", authMiddleware, (req, res) => {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get("pix_key");
  res.json({ pixKey: row?.value || "" });
});

app.put("/admin/pix", authMiddleware, (req, res) => {
  const { pixKey } = req.body;
  db.exec("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)");
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run("pix_key", pixKey);
  res.json({ message: "Chave PIX atualizada!" });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});