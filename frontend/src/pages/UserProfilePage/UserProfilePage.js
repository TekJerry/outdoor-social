import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  VStack,
  Heading,
  Avatar,
  Text,
  HStack,
  Divider,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `https://outdoor-social.onrender.com/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(userResponse.data.user);
        setFriends(userResponse.data.friends);

        const postsResponse = await axios.get(
          `https://outdoor-social.onrender.com/api/posts/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPosts(postsResponse.data);
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
    <Box maxW="85%" mx="auto" p={5}>
      {/* Main layout with three columns */}
      <SimpleGrid columns={[1, null, 3]} spacing={10}>
        {/* Left Column: Placeholder for future use */}
        <Box></Box>

        {/* Middle Column: User Info and Posts */}
        <Box>
          <VStack spacing={4} bg="gray.100" p={5} borderRadius="md" shadow="md">
            <Avatar size="xl" name={user.name} />
            <Heading>{user.name}</Heading>
            <Text>{user.location || "Location not provided"}</Text>
          </VStack>
          <Divider my={6} />
          <Heading size="md" mb={4}>
            Posts
          </Heading>
          <VStack spacing={4}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Box
                  key={post._id}
                  bg="white"
                  p={5}
                  borderRadius="md"
                  shadow="sm"
                  w="100%"
                >
                  <Text fontWeight="bold">{post.content}</Text>
                  {post.photo && (
                    <Box mt={3}>
                      <img
                        src={post.photo}
                        alt="Post"
                        style={{
                          width: "100%",
                          maxHeight: "400px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  )}
                  <HStack mt={3} justifyContent="space-between">
                    <Text fontSize="sm">
                      {post.hashtags.map((tag) => `#${tag} `)}
                    </Text>
                    <Text fontSize="sm">
                      {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
                    </Text>
                  </HStack>
                </Box>
              ))
            ) : (
              <Text>No posts available</Text>
            )}
          </VStack>
        </Box>

        {/* Right Column: Friends */}
        <Box>
          <Heading size="md" mb={4}>
            Friends
          </Heading>
          <VStack spacing={4}>
            {friends.map((friend) => (
              <HStack
                key={friend._id}
                w="100%"
                justifyContent="space-between"
                bg="gray.50"
                p={3}
                borderRadius="md"
                shadow="sm"
                _hover={{ bg: "gray.100", cursor: "pointer" }}
                onClick={() => navigate(`/user_profile/${friend._id}`)}
              >
                <HStack>
                  <Avatar name={friend.name} />
                  <Text fontWeight="bold">{friend.name}</Text>
                </HStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
