import { useState, useEffect } from "react";
import API_URL from "../config";
import "../styles/Feedback.css";

function Feedback() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/admin/feedbacks`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFeedbacks(data.slice(0, 3));
      })
      .catch(() => {});
  }, [sent]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !message) return;

    fetch(`${API_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    })
      .then(() => {
        setSent(true);
        setName("");
        setMessage("");
      });
  }

  if (sent) {
    return (
      <div className="feedback">
        <div className="feedback-success">
          <span>✅</span>
          <h3>Valeu pelo feedback!</h3>
          <p>Sua opinião ajuda a melhorar o Devs Up.</p>
          <button className="btn-back" onClick={() => setSent(false)}>Enviar outro</button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-section">
      <div className="feedback">
        <h2>💬 Deixe seu feedback</h2>
        <p className="feedback-subtitle">O que você achou do Devs Up?</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            required
          />
          <button type="submit" className="btn-buy">Enviar</button>
        </form>
      </div>

      {feedbacks.length > 0 && (
        <div className="feedbacks-list">
          <h3>🌟 O que estão dizendo</h3>
          {feedbacks.map((fb) => (
            <div key={fb.id} className="feedback-item">
              <strong>{fb.name}</strong>
              <p>{fb.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feedback;