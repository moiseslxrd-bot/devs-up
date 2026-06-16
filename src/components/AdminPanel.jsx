import { useState, useEffect } from "react";
import API_URL from "../config";
import "../styles/AdminPanel.css";

function PixConfig({ token }) {
  const [pixKey, setPixKey] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/admin/pix`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setPixKey(d.pixKey || ""));
  }, [token]);

  function handleSave(e) {
    e.preventDefault();
    fetch(`${API_URL}/admin/pix`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ pixKey }),
    })
      .then(r => r.json())
      .then(d => setMsg(d.message));
  }

  return (
    <form onSubmit={handleSave}>
      {msg && <p className="success-msg">{msg}</p>}
      <input
        type="text"
        placeholder="Sua chave PIX (CPF, e-mail, telefone...)"
        value={pixKey}
        onChange={e => setPixKey(e.target.value)}
      />
      <button type="submit" className="btn-buy">Salvar chave PIX</button>
    </form>
  );
}

function AdminPanel({ token, onLogout }) {
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState({ courses: 0, suggestions: 0 });
  const [courses, setCourses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tag, setTag] = useState("");
  const [emoji, setEmoji] = useState("");
  const [msg, setMsg] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  function loadStats() {
    fetch(`${API_URL}/admin/stats`, { headers }).then(r => r.json()).then(setStats);
  }

  function loadCourses() {
    fetch(`${API_URL}/admin/courses`, { headers }).then(r => r.json()).then(setCourses);
  }

  function loadSuggestions() {
    fetch(`${API_URL}/admin/suggestions`, { headers }).then(r => r.json()).then(setSuggestions);
  }

  useEffect(() => { loadStats(); loadCourses(); loadSuggestions(); }, []);

  function clearForm() {
    setTitle(""); setDescription(""); setPrice(""); setTag(""); setEmoji(""); setEditId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const body = { title, description, price, tag, emoji };
    const url = editId
      ? `${API_URL}/admin/courses/${editId}`
      : `${API_URL}/admin/courses`;
    const method = editId ? "PUT" : "POST";

    fetch(url, { method, headers, body: JSON.stringify(body) })
      .then(r => r.json())
      .then(data => {
        setMsg(data.message);
        clearForm();
        loadCourses();
        loadStats();
      });
  }

  function handleEdit(course) {
    setEditId(course.id);
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setTag(course.tag);
    setEmoji(course.emoji);
    setTab("add");
  }

  function handleDeleteCourse(id) {
    if (!confirm("Deletar este curso?")) return;
    fetch(`${API_URL}/admin/courses/${id}`, { method: "DELETE", headers })
      .then(() => { loadCourses(); loadStats(); });
  }

  function handleDeleteSuggestion(id) {
    fetch(`${API_URL}/admin/suggestions/${id}`, { method: "DELETE", headers })
      .then(() => loadSuggestions());
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>⚙️ Devs Up Admin</h2>
        <button className="btn-logout" onClick={onLogout}>Sair</button>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn ${tab === "stats" ? "active" : ""}`} onClick={() => setTab("stats")}>📊 Dashboard</button>
        <button className={`tab-btn ${tab === "add" ? "active" : ""}`} onClick={() => { setTab("add"); clearForm(); }}>{editId ? "✏️ Editar" : "➕ Novo"}</button>
        <button className={`tab-btn ${tab === "courses" ? "active" : ""}`} onClick={() => setTab("courses")}>📚 Cursos ({stats.courses})</button>
        <button className={`tab-btn ${tab === "suggestions" ? "active" : ""}`} onClick={() => setTab("suggestions")}>📩 Sugestões ({stats.suggestions})</button>
      </div>

      {tab === "stats" && (
        <>
          <div className="stats-grid">
            <div className="stat-card"><span>📚</span><strong>{stats.courses}</strong><p>Cursos</p></div>
            <div className="stat-card"><span>📩</span><strong>{stats.suggestions}</strong><p>Sugestões</p></div>
          </div>
          <div className="admin-card" style={{marginTop: "1.5rem"}}>
            <h3>🔑 Chave PIX</h3>
            <PixConfig token={token} />
          </div>
        </>
      )}

      {tab === "add" && (
        <div className="admin-card">
          <h3>{editId ? "✏️ Editar Curso" : "➕ Novo Curso"}</h3>
          {msg && <p className="success-msg">{msg}</p>}
          <form onSubmit={handleSubmit}>
            <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required />
            <input placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} required />
            <input placeholder="Preço (R$ 27)" value={price} onChange={e => setPrice(e.target.value)} required />
            <input placeholder="Tag (React)" value={tag} onChange={e => setTag(e.target.value)} required />
            <input placeholder="Emoji (🧠)" value={emoji} onChange={e => setEmoji(e.target.value)} required />
            <div className="form-buttons">
              <button type="submit" className="btn-buy">{editId ? "Atualizar" : "Adicionar"}</button>
              {editId && <button type="button" className="btn-cancel" onClick={clearForm}>Cancelar</button>}
            </div>
          </form>
        </div>
      )}

      {tab === "courses" && (
        <div className="admin-card">
          <h3>📚 Todos os Cursos</h3>
          {courses.map(c => (
            <div key={c.id} className="list-item">
              <div><span>{c.emoji}</span> <strong>{c.title}</strong> — {c.price}</div>
              <div className="item-actions">
                <button className="btn-sm edit" onClick={() => handleEdit(c)}>Editar</button>
                <button className="btn-sm delete" onClick={() => handleDeleteCourse(c.id)}>Deletar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "suggestions" && (
        <div className="admin-card">
          <h3>📩 Sugestões</h3>
          {suggestions.length === 0 && <p className="empty">Nenhuma ainda.</p>}
          {suggestions.map(s => (
            <div key={s.id} className="list-item">
              <div><strong>{s.title}</strong><p>{s.description}</p><span className="date">{new Date(s.created_at).toLocaleDateString("pt-BR")}</span></div>
              <button className="btn-sm delete" onClick={() => handleDeleteSuggestion(s.id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;