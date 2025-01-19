import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "../../components/Post/Post";
import CreatePostForm from "../../components/CreatePostForm/CreatePostForm";
import { Box, VStack, Spinner, Text } from "@chakra-ui/react";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://outdoor-social.onrender.com/api/posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPosts(response.data); // Update state with posts
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `https://outdoor-social.onrender.com/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? response.data : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      const response = await axios.post(
        `https://outdoor-social.onrender.com/api/posts/${postId}/comment`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? response.data : post
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post to the feed
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
        <Spinner size="xl" color="#385802" />
      </Box>
    );
  }

  return (
    <Box bg="#f7f7f7" minH="100vh" py={10}>
      <Box
        maxW="800px"
        mx="auto"
        bg="white"
        p={5}
        borderRadius="md"
        boxShadow="lg"
      >
        <Text fontSize="2xl" fontWeight="bold" color="#385802" mb={5}>
          Create a Post
        </Text>
        <CreatePostForm onPostCreated={handlePostCreated} />
      </Box>

      <VStack spacing={6} mt={8} maxW="800px" mx="auto">
        {posts.length === 0 ? (
          <Text>No posts available. Start following others to see posts!</Text>
        ) : (
          posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        )}
      </VStack>
    </Box>
  );
}
