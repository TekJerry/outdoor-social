import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, VStack, Heading, Avatar, Text, HStack } from "@chakra-ui/react";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data.user);
        setFriends(response.data.friends);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <Text>Loading...</Text>;

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <Avatar size="xl" name={user.name} />
        <Heading>{user.name}</Heading>
        <Text>{user.location || "Location not provided"}</Text>
      </VStack>
      <Box mt={6}>
        <Heading size="md" mb={4}>
          Friends
        </Heading>
        <VStack spacing={4}>
          {friends.map((friend) => (
            <HStack key={friend._id} w="100%" justifyContent="space-between">
              <HStack>
                <Avatar name={friend.name} />
                <Text>{friend.name}</Text>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
