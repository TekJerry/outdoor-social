import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react";

export default function SearchForFriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return; // Don't search for empty queries

    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/search?query=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSearchResults(response.data); // Update search results
    } catch (error) {
      console.error("Error searching for users:", error);
      toast({
        title: "Search failed",
        description: "Failed to search for users. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/users/friend-request`,
        { to: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast({
        title: "Friend request sent",
        description: "Your friend request has been sent successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        title: "Failed to send request",
        description: "Could not send the friend request. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="600px" mx="auto" py={10} px={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={5} textAlign="center" color="#385802">
        Search for Friends
      </Text>
      <VStack spacing={4}>
        {/* Search Input */}
        <HStack w="full">
          <Input
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="gray.50"
            flex="1"
          />
          <Button
            colorScheme="green"
            onClick={handleSearch}
            isLoading={loading}
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </HStack>

        {/* Search Results */}
        <VStack spacing={4} w="full">
          {loading ? (
            <Spinner color="#385802" />
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <HStack
                key={user._id}
                w="full"
                p={3}
                bg="white"
                borderRadius="md"
                shadow="md"
                justifyContent="space-between"
              >
                <Text>
                  {user.name} ({user.email})
                </Text>
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() => handleSendFriendRequest(user._id)}
                >
                  Add Friend
                </Button>
              </HStack>
            ))
          ) : (
            <Text color="gray.500">No results found. Try a different search term.</Text>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
