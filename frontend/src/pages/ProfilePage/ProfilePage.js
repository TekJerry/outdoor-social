import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../../components/Post/Post";
import { Box, Flex, VStack, Heading, Text, Avatar, Divider } from "@chakra-ui/react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndFriends = async () => {
      try {
        const profileResponse = await axios.get(
          "https://outdoor-social.onrender.com/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(profileResponse.data);

        const friendsResponse = await axios.get(
          "https://outdoor-social.onrender.com/api/users/friends",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFriends(friendsResponse.data);

        const postsResponse = await axios.get(
          "https://outdoor-social.onrender.com/api/posts/myposts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserPosts(postsResponse.data);
      } catch (error) {
        console.error(
          "Error fetching profile, friends, or posts:",
          error.response?.data?.message || error.message
        );
        alert("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndFriends();
  }, []);

  if (loading) return <Text textAlign="center">Loading...</Text>;

  return (
    <Flex
      className="p-4 mx-auto"
      gap={6}
      justifyContent="center"
      maxWidth="85%"
      margin="0 auto"
      alignItems="flex-start"
    >
      {/* Left Column (Blank for now) */}
      <Box flex="1" width="25%" />

      {/* Middle Column (Profile & Posts) */}
      <Box flex="2" width="50%" bg="white" shadow="md" rounded="lg" p={6}>
        <Box mb={6}>
          <Heading size="lg" mb={4} textAlign="center">
            {user.name}'s Profile
          </Heading>
          <Divider mb={4} />
          <Text textAlign="center" fontSize="lg" fontWeight="medium">
            <strong>Email:</strong> {user.email}
          </Text>
          <Text textAlign="center" fontSize="lg" fontWeight="medium">
            <strong>Location:</strong> {user.location || "Not provided"}
          </Text>
        </Box>

        <Box>
          {userPosts.length === 0 ? (
            <Text textAlign="center">No posts yet.</Text>
          ) : (
            <VStack spacing={4}>
              {userPosts.map((post) => (
                <Post
                  key={post._id}
                  post={post}
                  onLike={() => {}}
                  onComment={() => {}}
                />
              ))}
            </VStack>
          )}
        </Box>
      </Box>

      {/* Right Column (Friends List) */}
      <Box
        flex="1"
        width="25%"
        bg="white"
        shadow="md"
        rounded="lg"
        p={6}
        h="fit-content"
        maxH="80vh"
        overflowY="auto"
        position="sticky"
        top="20px"
      >
        <Heading size="md" mb={4} textAlign="center">
          Friends
        </Heading>
        {friends.length === 0 ? (
          <Text textAlign="center">No friends yet.</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {friends.map((friend) => (
              <Flex key={friend._id} align="center" gap={4}>
                <Avatar name={friend.name} />
                <Text fontWeight="medium">{friend.name}</Text>
              </Flex>
            ))}
          </VStack>
        )}
      </Box>
    </Flex>
  );
}
