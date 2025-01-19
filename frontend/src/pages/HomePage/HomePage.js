import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://outdoor-social.onrender.com/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token); // Store the token
      localStorage.setItem("email", response.data.email);
      navigate("/feed"); // Redirect to feed
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      {/* Container */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg flex overflow-hidden">
        {/* Left Section: Introduction */}
        <div
          className="w-1/2 p-8 text-white flex flex-col justify-center"
          style={{ backgroundColor: "#385802" }}
        >
          <h1 className="text-4xl font-bold mb-4">Welcome to Outdoor Social</h1>
          <p className="text-lg">
            Connect with outdoor enthusiasts, share your adventures, and
            explore the best spots for camping, hunting, and fishing.
          </p>
        </div>

        {/* Right Section: Login Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6">Log in to your account</h2>
          {error && (
            <Text color="red.500" mb={3}>
              {error}
            </Text>
          )}
          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" colorScheme="green" width="full">
                Login
              </Button>
            </VStack>
          </form>
          <Text textAlign="center" mt={4}>
            Don't have an account?{" "}
            <Button
              variant="link"
              colorScheme="green"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </Text>
        </div>
      </div>
    </div>
  );
}
