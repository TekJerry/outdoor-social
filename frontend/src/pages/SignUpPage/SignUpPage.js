import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );
      toast({
        title: "Account created successfully.",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFormData({ name: "", email: "", password: "" }); // Clear the form
    } catch (error) {
      toast({
        title: "Error signing up.",
        description:
          error.response?.data?.message || "Something went wrong. Try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      bg="#f9f9f9"
    >
      <Box
        bg="white"
        p={8}
        rounded="lg"
        boxShadow="md"
        maxWidth="400px"
        w="full"
      >
        <Heading as="h1" size="lg" textAlign="center" mb={6} color="#385802">
          Sign Up
        </Heading>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              focusBorderColor="green.500"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              focusBorderColor="green.500"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              focusBorderColor="green.500"
            />
          </FormControl>

          <Button
            colorScheme="green"
            width="full"
            onClick={handleSignUp}
            isLoading={loading}
          >
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
