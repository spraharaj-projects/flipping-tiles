import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/loginForm/LoginForm";
import Game from "./components/game/Game";
import Admin from "./components/admin/Admin";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/game" element={<Game />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
