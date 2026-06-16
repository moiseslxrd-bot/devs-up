import "../styles/About.css";

function About({ onBack }) {
  return (
    <div className="about">
      <button className="btn-back" onClick={onBack}>← Voltar</button>
      
      <div className="about-content">
        <span className="about-emoji">👋</span>
        <h2>Quem faz o Devs Up?</h2>
        
        <p>
          Um dev que já ficou travado em callbacks, já teve medo de Git, 
          já colou em teste técnico e pensou em desistir. Mais de uma vez.
        </p>
        
        <p>
          O Devs Up nasceu da ideia de que <strong>todo mundo trava</strong>. 
          A diferença é ter alguém pra explicar do jeito certo, 
          com exemplos reais e sem enrolação.
        </p>

        <div className="about-values">
          <div className="value-item">
            <span>🎯</span>
            <h3>Missão</h3>
            <p>Destravar devs com cursos direto ao ponto e preços acessíveis.</p>
          </div>
          <div className="value-item">
            <span>💎</span>
            <h3>Valor</h3>
            <p>Conteúdo real, feito por quem tá no corre, sem papo de coach.</p>
          </div>
          <div className="value-item">
            <span>🚀</span>
            <h3>Visão</h3>
            <p>Ser a primeira opção quando alguém travar na programação.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;