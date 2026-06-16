import { useState } from "react";
import API_URL from "../config";
import "../styles/PaymentModal.css";

function PaymentModal({ course, onClose }) {
  const [loading, setLoading] = useState(false);

  function handlePay() {
    setLoading(true);

    fetch(`${API_URL}/create-preference`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: course.id,
        title: course.title,
        price: course.price,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.init_point) {
          window.location.href = data.init_point;
        } else {
          alert("Erro ao gerar pagamento");
          setLoading(false);
        }
      })
      .catch(() => {
        alert("Erro de conexão");
        setLoading(false);
      });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-emoji">{course.emoji}</div>
        <h3>{course.title}</h3>
        <p className="modal-description">{course.description}</p>
        <div className="modal-price">{course.price}</div>

        <button className="btn-mp" onClick={handlePay} disabled={loading}>
          {loading ? "Redirecionando..." : "💳 Pagar com Mercado Pago"}
        </button>

        <p className="secure-note">🔒 Pagamento seguro via Mercado Pago</p>
      </div>
    </div>
  );
}

export default PaymentModal;