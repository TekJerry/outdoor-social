import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://outdoor-social.onrender.com/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token); // Store the token in localStorage
      navigate("/feed"); // Redirect the user to the feed page
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="10" p="5" bg="gray.100" borderRadius="md">
      <Text fontSize="2xl" fontWeight="bold" mb={3}>
        Login
      </Text>
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
    </Box>
  );
};

export default LoginPage;
