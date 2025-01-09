import React, { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      const token = response.data.token; //This will get the token from the response.
      localStorage.setItem("token", token); //This will store the token in localStorage
      alert("Login successful");
    } catch (error) {
      alert(error.response.data.message || "Error logging in");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
