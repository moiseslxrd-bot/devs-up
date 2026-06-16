import { useState } from "react";
import API_URL from "../config";
import "../styles/SuggestionForm.css";

function SuggestionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !description) return;
    
    setLoading(true);
    
    fetch(`${API_URL}/suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })
      .then(() => {
        setSent(true);
        setTitle("");
        setDescription("");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  if (sent) {
    return (
      <div className="suggestion-form">
        <div className="success-message">
          <span>✅</span>
          <h3>Valeu pela sugestão!</h3>
          <p>A gente vai analisar e quem sabe vira um curso em breve.</p>
          <button className="btn-back" onClick={() => setSent(false)}>Mandar outra</button>
        </div>
      </div>
    );
  }

  return (
    <div className="suggestion-form">
      <h2>💡 Sugere um curso</h2>
      <p className="form-subtitle">Tá travado em algum tema? Conta pra gente!</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título do curso"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Descreve o que você gostaria de aprender..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <button type="submit" className="btn-buy" disabled={loading}>
          {loading ? "Enviando..." : "Enviar sugestão"}
        </button>
      </form>
    </div>
  );
}

export default SuggestionForm;