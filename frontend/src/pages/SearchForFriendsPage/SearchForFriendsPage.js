import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Avatar,
  HStack,
} from "@chakra-ui/react";

export default function SearchForFriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `https://outdoor-social.onrender.com/api/users/search?query=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching for users:", error);
      alert("Failed to search for users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFriendAction = async (userId) => {
    try {
      const response = await axios.post(
        "https://outdoor-social.onrender.com/api/users/friend-request",
        { to: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.message === "Already a Friend") {
        navigate(`/user-profile/${userId}`); // Navigate to their public profile
      } else {
        alert(response.data.message || "Friend added successfully!");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      alert("Failed to send friend request.");
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>
        Search for Friends
      </Text>
      <VStack spacing={4}>
        <Input
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          onClick={handleSearch}
          isLoading={loading}
          loadingText="Searching..."
          colorScheme="green"
        >
          Search
        </Button>
      </VStack>
      <VStack spacing={4} mt={6}>
        {searchResults.map((user) => (
          <HStack
            key={user._id}
            w="100%"
            p={4}
            bg="gray.100"
            rounded="md"
            justifyContent="space-between"
          >
            <HStack>
              <Avatar name={user.name} />
              <Text>{user.name}</Text>
            </HStack>
            <Button
              onClick={() => handleFriendAction(user._id)}
              colorScheme="green"
              variant="outline"
            >
              Add Friend
            </Button>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
