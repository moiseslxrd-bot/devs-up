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
    "cursos": "📚 Temos 4 cursos incríveis:\n\n🧠 JavaScript - R$ 27\n🔀 Git - R$ 22\n⚛️ React - R$ 34\n🔍 Lógica - R$ 19",
    "preço": "💰 Preços:\nJavaScript - R$ 27\nGit - R$ 22\nReact - R$ 34\nLógica - R$ 19",
    "suporte": "💬 Fale no WhatsApp: (15) 99100-9103",
    "oi": "👋 Olá! Pergunte sobre cursos, preços ou suporte!",
  };

  function getBotReply(text) {
    const lower = text.toLowerCase();
    for (const [key, reply] of Object.entries(botResponses)) {
      if (lower.includes(key)) return reply;
    }
    return "🤔 Tente perguntar sobre:\n📚 Cursos\n💰 Preços\n💬 Suporte";
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
            <input type="text" placeholder="Digite sua dúvida..." value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="submit">➤</button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatBot;