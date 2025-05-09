

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:9000/auth/signup', { name, email, password })
      .then(result => {
        console.log("Signup successful:", result.data);
        localStorage.setItem("loggedIn", "true");
        setError(""); 
        navigate("/login");
      })
      .catch(err => {
        const message = err.response?.data?.message || "Signup failed";
        setError(message);
        console.error("Signup failed:", err);
      });
  };

  return (
    <div className="max-w-sm mx-auto p-4 pt-16">
      <form onSubmit={handleSubmit}>
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
          Register
        </h1>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            <strong>Name</strong>
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter Name"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            <strong>Your email</strong>
          </label>
          <input
            type="email"
            id="email"
            placeholder="name@example.com"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            <strong>Your password</strong>
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Register new account
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Already have an account?
        </p>
        <Link
          to="/login"
          className="block w-full text-center text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
