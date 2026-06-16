import "../styles/Home.css";

function Home({ onNavigate }) {
  const phone = "5515991009103";
  const message = "Olá! Quero saber mais sobre criação de sites personalizados";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">
          <span className="gradient-text">Moiso Devs</span>
        </h1>
        <p className="home-subtitle">
          Desenvolvimento web sob medida para você ou sua empresa.
        </p>
        <p className="home-description">
          Crio sites, landing pages e sistemas personalizados de acordo com o que você precisa. 
          Do design à funcionalidade, tudo feito pra entregar resultado.
        </p>

        <div className="home-services">
          <div className="service-card">
            <span>🌐</span>
            <h3>Sites Institucionais</h3>
            <p>Páginas profissionais para sua empresa ou marca pessoal.</p>
          </div>
          <div className="service-card">
            <span>🛒</span>
            <h3>Lojas Online</h3>
            <p>E-commerce simples e direto pra começar a vender.</p>
          </div>
          <div className="service-card">
            <span>📱</span>
            <h3>Landing Pages</h3>
            <p>Páginas de vendas e captura de leads que convertem.</p>
          </div>
          <div className="service-card">
            <span>⚙️</span>
            <h3>Sistemas Web</h3>
            <p>Plataformas completas com painel, login e banco de dados.</p>
          </div>
        </div>

        <div className="home-cta">
          <h2>💡 Valor sob consulta</h2>
          <p>Cada projeto é único. Me chama no WhatsApp que a gente conversa e faz um orçamento sem compromisso.</p>
          <a href={whatsappUrl} target="_blank" className="btn-whatsapp">
            📱 Fazer orçamento
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;