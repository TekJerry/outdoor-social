import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, VStack, Heading, Avatar, Text, HStack, Flex, Divider } from "@chakra-ui/react";
import Post from "../../components/Post/Post";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleFriendClick = async (friendId) => {
    try {
      await axios.get(`https://outdoor-social.onrender.com/api/users/${friendId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate(`/user_profile/${friendId}`);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
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
  }, [userId]);

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
      <Box flex="1" width="25%" />

      <Box flex="2" width="50%" bg="white" shadow="md" rounded="lg" p={6}>
        <Box mb={6}>
          <Heading size="lg" mb={4} textAlign="center">
            {user.name}'s Profile
          </Heading>
          <Divider mb={4} />
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
                onClick={() => handleFriendClick(friend._id)}
                style={{ cursor: "pointer" }}
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
