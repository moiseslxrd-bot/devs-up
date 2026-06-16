import { useState } from "react";
import API_URL from "../config";
import "../styles/Feedback.css";

function Feedback() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

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
    <div className="feedback">
      <h2>💬 Deixe seu feedback</h2>
      <p className="feedback-subtitle">O que você achou do Devs Up? Tem alguma sugestão?</p>
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
          rows={4}
          required
        />
        <button type="submit" className="btn-buy">Enviar feedback</button>
      </form>
    </div>
  );
}

export default Feedback;