import { useState, useRef, useEffect } from "react";
import "../styles/ChatBot.css";

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Olá! Sou o assistente do Devs Up. Como posso ajudar?\n\nPode perguntar sobre:\n📚 Cursos disponíveis\n💰 Valores\n🎓 Como funciona\n💬 Suporte" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    "cursos": "📚 Temos 4 cursos incríveis:\n\n🧠 O básico que não te ensinaram de JavaScript - R$ 27\n🔀 Git sem medo: do commit ao deploy - R$ 22\n⚛️ React na prática - R$ 34\n🔍 Desbuga sua lógica - R$ 19\n\nTodos com acesso vitalício!",
    "curso": "📚 Nossos cursos:\n\n🧠 JavaScript - R$ 27\n🔀 Git - R$ 22\n⚛️ React - R$ 34\n🔍 Lógica - R$ 19\n\nQual te interessa?",
    "valor": "💰 Nossos preços são super acessíveis:\n\nJavaScript - R$ 27\nGit - R$ 22\nReact - R$ 34\nLógica - R$ 19\n\nPagamento via PIX!",
    "preço": "💰 Preços:\nJavaScript - R$ 27\nGit - R$ 22\nReact - R$ 34\nLógica - R$ 19",
    "preco": "💰 Preços:\nJavaScript - R$ 27\nGit - R$ 22\nReact - R$ 34\nLógica - R$ 19",
    "pix": "📱 Aceitamos PIX! A chave aparece na hora da compra. É só clicar em 'Quero destravar' no curso desejado.",
    "pagamento": "📱 Pagamento via PIX! Clique em 'Quero destravar' no curso que você quer e siga as instruções.",
    "como funciona": "🎓 É simples:\n1. Escolha seu curso\n2. Clique em 'Quero destravar'\n3. Faça o PIX\n4. Enviamos o acesso por e-mail\n\nDúvidas? Fale no WhatsApp!",
    "suporte": "💬 Precisa de ajuda? Fale direto no WhatsApp: (15) 99100-9103\n\nOu use o formulário de suporte no site!",
    "javascript": "🧠 JavaScript - R$ 27\n\nAprenda: Variáveis, Arrays, Objetos, Loops, Callbacks, Promises e Async/Await.\nIdeal pra quem já começou mas ainda trava!",
    "git": "🔀 Git sem medo - R$ 22\n\nAprenda: Init, Clone, Branch, Merge, Push, Pull, Pull Request e Deploy.\nChega de medo de Git!",
    "react": "⚛️ React na prática - R$ 34\n\nAprenda: Componentes, Props, useState, useEffect, Rotas e Deploy na Vercel.\nCrie seu primeiro app completo!",
    "lógica": "🔍 Desbuga sua lógica - R$ 19\n\nExercícios comentados de algoritmos: Entrada/Saída, Condicionais, Laços, Arrays, Recursão e Ordenação.",
    "logica": "🔍 Desbuga sua lógica - R$ 19\n\nExercícios comentados de algoritmos: Entrada/Saída, Condicionais, Laços, Arrays, Recursão e Ordenação.",
    "oi": "👋 Olá! Tudo bem? Sou o assistente do Devs Up.\n\nPosso te ajudar com:\n📚 Cursos\n💰 Preços\n💬 Suporte\n\nO que você precisa?",
    "ola": "👋 Olá! Como posso ajudar? Pergunte sobre cursos, preços ou suporte!",
    "olá": "👋 Olá! Como posso ajudar? Pergunte sobre cursos, preços ou suporte!",
    "obrigado": "😊 Por nada! Qualquer dúvida é só chamar. Bons estudos! 🚀",
    "obrigada": "😊 Por nada! Qualquer dúvida é só chamar. Bons estudos! 🚀",
    "valeu": "😊 Valeu você! Precisando, tamo junto! 🚀",
    "tchau": "👋 Até mais! Bons estudos e qualquer coisa é só voltar aqui. 🚀",
  };

  function getBotReply(text) {
    const lower = text.toLowerCase();
    
    for (const [key, reply] of Object.entries(botResponses)) {
      if (lower.includes(key)) return reply;
    }
    
    return "🤔 Não entendi muito bem. Tente perguntar sobre:\n📚 'Cursos'\n💰 'Preços'\n💬 'Suporte'\n\nOu fale direto no WhatsApp: (15) 99100-9103";
  }

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages([...messages, { from: "user", text: userMsg }]);
    setInput("");

    setTimeout(() => {
      const reply = getBotReply(userMsg);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 500);
  }

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="chatbot">
          <div className="chatbot-header">
            <span>🤖 Assistente Devs Up</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.from}`}>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Digite sua dúvida..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">➤</button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatBot;