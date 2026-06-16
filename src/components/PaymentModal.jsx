import { useState, useEffect } from "react";
import API_URL from "../config";
import "../styles/PaymentModal.css";

function PaymentModal({ course, onClose }) {
  const [pixKey, setPixKey] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/admin/pix`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
    })
      .then((res) => res.json())
      .then((data) => setPixKey(data.pixKey || "chave_pix@exemplo.com"));
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-emoji">{course.emoji}</div>
        <h3>{course.title}</h3>
        <p className="modal-description">{course.description}</p>
        <div className="modal-price">{course.price}</div>

        <div className="pix-section">
          <h4>📱 Pagamento via PIX</h4>
          <p>Copie a chave PIX abaixo e faça o pagamento no seu banco:</p>
          <div className="pix-key-box">
            <code>{pixKey}</code>
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? "✅ Copiado!" : "📋 Copiar"}
            </button>
          </div>
          <p className="pix-note">
            Após o pagamento, enviaremos o acesso por e-mail em até 5 minutos.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;