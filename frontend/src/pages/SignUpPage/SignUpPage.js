import React, { useState } from "react";
import axios from "axios";

export default function SignUpPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message || "Error signing up");
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
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
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}
