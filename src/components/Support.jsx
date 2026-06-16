import "../styles/Support.css";

function Support() {
  const phone = "5515991009103";
  const message = "Olá! Preciso de ajuda com o Devs Up";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="support">
      <div className="support-content">
        <span className="support-emoji">💬</span>
        <h2>Precisa de ajuda?</h2>
        <p>
          Fale direto com a gente no WhatsApp. Respondemos rápido!
        </p>
        <a href={whatsappUrl} target="_blank" className="btn-whatsapp">
          📱 (15) 99100-9103
        </a>
      </div>
    </div>
  );
}

export default Support;