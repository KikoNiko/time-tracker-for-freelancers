import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Jobs from "./Jobs";
import TimeTracker from "./TimeTracker";
import Login from "./components/Login";
import Register from "./components/Register";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/" element={token ? <Jobs /> : <Navigate to="/login" />} />
        <Route path="/tracker" element={token ? <TimeTracker /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
    </div>
  );
}
