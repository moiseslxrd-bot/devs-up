import { useState } from "react";
import Home from "./components/Home";
import CourseList from "./components/CourseList";
import CourseDetail from "./components/CourseDetail";
import SuggestionForm from "./components/SuggestionForm";
import Support from "./components/Support";
import Feedback from "./components/Feedback";
import About from "./components/About";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import StudentLogin from "./components/StudentLogin";
import Register from "./components/Register";
import StudentPanel from "./components/StudentPanel";
import ChatBot from "./components/ChatBot";
import "./styles/App.css";

function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [page, setPage] = useState("home");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [studentToken, setStudentToken] = useState(localStorage.getItem("studentToken") || null);
  const [authPage, setAuthPage] = useState("login");

  function handleLogin(token, username) {
    setToken(token);
    setPage("admin");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setPage("home");
  }

  function handleStudentLogin(token, name) {
    setStudentToken(token);
  }

  function handleStudentLogout() {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentEmail");
    setStudentToken(null);
    setPage("home");
  }

  function handleNavClick(pageName) {
    setPage(pageName);
    setSelectedCourse(null);
  }

  function handleSugerir() {
    handleNavClick("home");
    setTimeout(() => {
      document.getElementById("sugestao")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  if (page === "admin" && token) {
    return <AdminPanel token={token} onLogout={handleLogout} />;
  }

  if (page === "login") {
    return <Login onLogin={handleLogin} />;
  }

  if (studentToken && page === "student") {
    return <StudentPanel token={studentToken} onLogout={handleStudentLogout} />;
  }

  if (page === "student" && !studentToken) {
    if (authPage === "register") {
      return <Register onSwitch={() => setAuthPage("login")} />;
    }
    return <StudentLogin onLogin={handleStudentLogin} onSwitch={() => setAuthPage("register")} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-inner">
          <span className="nav-logo" onClick={() => handleNavClick("home")} style={{cursor: "pointer"}}>
            🚀 Devs Up
          </span>
          <div className="nav-links">
            <button className="nav-link" onClick={() => handleNavClick("home")}>Início</button>
            <button className="nav-link" onClick={() => handleNavClick("cursos")}>Cursos</button>
            <button className="nav-link" onClick={() => handleNavClick("about")}>Sobre</button>
            <button className="nav-link" onClick={handleSugerir}>Suporte</button>
            <button className="nav-link" onClick={() => { setPage("student"); setAuthPage("login"); }}>Área do Aluno</button>
            <button className="nav-link" onClick={() => handleNavClick("login")}>Login</button>
          </div>
        </div>
      </nav>

      {page === "home" && <Home onNavigate={handleNavClick} />}

      {page === "cursos" && (
        <>
          <header className="app-header">
            <h1><span className="gradient-text">Devs Up</span></h1>
            <p className="subtitle">Cursos práticos pra quem tá travado na programação.</p>
          </header>
          <main>
            {selectedCourse ? (
              <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />
            ) : (
              <CourseList onSelectCourse={setSelectedCourse} />
            )}
          </main>
          <Feedback />
          <div id="sugestao">
            <Support />
            <SuggestionForm />
          </div>
        </>
      )}

      {page === "about" && (
        <div style={{paddingTop: "6rem"}}>
          <About onBack={() => handleNavClick("home")} />
        </div>
      )}

      <footer className="app-footer">
        <p>© 2026 Devs Up — feito por <strong>Moiso Devs</strong></p>
      </footer>

      <ChatBot />
    </div>
  );
}

export default App;