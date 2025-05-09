import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import GettingStarted from "./pages/GettingStarted";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  useEffect(() => {
    window.addEventListener("storage", () => {
      setIsLoggedIn(localStorage.getItem("loggedIn") === "true");
    });
  }, []);
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<GettingStarted />} />

      <Route
        path="/signup"
        element={isLoggedIn ? <Navigate to="/home" replace /> : <Signup />}
      />
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/home" replace /> : <Login />}
      />

      {/* Protected Route */}
      <Route
        path="/home"
        element={ <Home />}
      />
    </Routes>
  );
}

export default App;
