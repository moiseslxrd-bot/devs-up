import { useState, useEffect } from "react";
import API_URL from "../config";
import "../styles/PaymentModal.css";

function PaymentModal({ course, onClose }) {
  const [pixKey, setPixKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("pix"); // pix ou confirmado

  useEffect(() => {
    fetch(`${API_URL}/admin/pix`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
    })
      .then((res) => res.json())
      .then((data) => setPixKey(data.pixKey || ""));
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleConfirm() {
    if (!email) return;
    setStep("confirmado");
  }

  if (step === "confirmado") {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="modal-emoji">✅</div>
          <h3>Pagamento em análise</h3>
          <p className="modal-description">
            Assim que o PIX for confirmado, enviaremos o acesso para <strong>{email}</strong>.
          </p>
          <button className="btn-buy" onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
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

        <div className="email-section">
          <h4>📧 Seu melhor e-mail</h4>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn-buy" onClick={handleConfirm}>
            Já paguei, enviar acesso
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;