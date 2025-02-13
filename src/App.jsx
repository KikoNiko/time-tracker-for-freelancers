import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Jobs from "./Jobs";
import TimeTracker from "./TimeTracker";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Jobs />} />
        <Route path="/tracker" element={<TimeTracker />} />
      </Routes>
    </Router>
  );
}
