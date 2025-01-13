import React from "react";
import {
  Box,
  Text,
  Image,
  HStack,
  VStack,
  Button,
  Input,
  Divider,
  Avatar,
  Flex,
} from "@chakra-ui/react";

export default function Post({ post, onLike, onComment }) {
  return (
    <Box
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      p={5}
      maxW="600px"
      w="100%"
      mx="auto"
    >
      {/* User Info */}
      <HStack spacing={3} mb={4}>
        <Avatar size="sm" name={post.user.name} />
        <Text fontWeight="bold" fontSize="lg">
          {post.user.name}
        </Text>
      </HStack>

      {/* Post Content */}
      <Text mb={3}>{post.content}</Text>

      {/* Post Photo */}
      {post.photo && (
        <Flex justifyContent="center" mb={4}>
          <Image
            src={post.photo}
            alt="Post"
            borderRadius="md"
            maxH="300px"
            objectFit="cover"
          />
        </Flex>
      )}

      {/* Hashtags */}
      <HStack spacing={2} wrap="wrap" mb={4}>
        {post.hashtags.map((tag, index) => (
          <Text key={index} fontSize="sm" color="#385802" fontWeight="bold">
            #{tag}
          </Text>
        ))}
      </HStack>

      {/* Like Button */}
      <HStack spacing={4} mb={4}>
        <Button
          colorScheme="green"
          variant="outline"
          size="sm"
          onClick={() => onLike(post._id)}
        >
          {post.likes.includes(localStorage.getItem("userId")) ? "Unlike" : "Like"} ({post.likes.length})
        </Button>
      </HStack>

      <Divider mb={4} />

      {/* Comments Section */}
      <VStack align="start" spacing={3}>
        <Text fontWeight="bold">Comments:</Text>
        {post.comments.length > 0 ? (
          post.comments.map((comment, index) => (
            <Box key={index} bg="gray.100" p={3} borderRadius="md" w="100%">
              <Text fontSize="sm" fontWeight="bold">
                {comment.user?.name || "Anonymous"}:
              </Text>
              <Text fontSize="sm">{comment.content}</Text>
            </Box>
          ))
        ) : (
          <Text fontSize="sm" color="gray.500">
            No comments yet.
          </Text>
        )}
      </VStack>

      {/* Add Comment */}
      <HStack mt={4} spacing={2} w="100%">
        <Input
          placeholder="Add a comment..."
          size="sm"
          bg="gray.50"
          flex="1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              onComment(post._id, e.target.value);
              e.target.value = ""; // Clear input after submission
            }
          }}
        />
        <Button
          colorScheme="green"
          size="sm"
          onClick={(e) => {
            const input = e.target.previousSibling; // Find the input element
            if (input && input.value.trim()) {
              onComment(post._id, input.value);
              input.value = ""; // Clear input after submission
            }
          }}
        >
          Submit
        </Button>
      </HStack>
    </Box>
  );
}
