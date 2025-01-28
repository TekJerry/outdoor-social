import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, VStack, Heading, Avatar, Text, HStack, Flex } from "@chakra-ui/react";

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://outdoor-social.onrender.com/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data.user);
        setFriends(response.data.friends);

        // Fetch the user's posts
        const postsResponse = await axios.get(
          `https://outdoor-social.onrender.com/api/posts/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserPosts(postsResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]); // Add userId as a dependency to re-run the effect when it changes

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

      {/* Middle Column (User Profile & Posts) */}
      <Box flex="2" width="50%" bg="white" shadow="md" rounded="lg" p={6}>
        <Box mb={6}>
          <Heading size="lg" mb={4} textAlign="center">
            {user.name}'s Profile
          </Heading>
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
                <Box
                  key={post._id}
                  bg="gray.50"
                  p={4}
                  shadow="sm"
                  rounded="lg"
                  width="100%"
                >
                  <Text fontWeight="bold">{post.content}</Text>
                  {post.photo && (
                    <img
                      src={post.photo}
                      alt="Post"
                      style={{ width: "100%", borderRadius: "8px", marginTop: "8px" }}
                    />
                  )}
                </Box>
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
              <Flex
                key={friend._id}
                align="center"
                gap={4}
                _hover={{ bg: "gray.100", cursor: "pointer" }}
                p={2}
                rounded="md"
                onClick={() => navigate(`/user_profile/${friend._id}`)}
              >
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
