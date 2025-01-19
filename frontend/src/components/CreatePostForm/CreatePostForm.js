import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Input,
  Select,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  HStack,
} from "@chakra-ui/react";

export default function CreatePostForm({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [visibility, setVisibility] = useState("public"); // Default to public

  const { isOpen, onOpen, onClose } = useDisclosure(); // Control modal visibility
  const toast = useToast(); // Chakra UI's toast for notifications

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://outdoor-social.onrender.com/api/posts",
        {
          content,
          hashtags: hashtags.split(",").map((tag) => tag.trim()), // Parse hashtags
          photo: imageUrl,
          visibility, // Include visibility setting
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast({
        title: "Post created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form fields
      setContent("");
      setHashtags("");
      setImageUrl("");
      setVisibility("public");
      onClose(); // Close modal after submission

      if (onPostCreated) onPostCreated(response.data); // Notify parent component
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Failed to create post. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <HStack justifyContent="center" mb={8}>
      {/* Create a Post Button */}
      <Button
        colorScheme="green"
        variant="ghost"
        size="lg"
        onClick={onOpen}
        fontWeight="bold"
        border="2px solid"
        borderColor="green.500"
        _hover={{
          background: "green.100",
        }}
      >
        Create a Post
      </Button>

      {/* Modal for Creating Post */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired mb={4}>
                <FormLabel>What's on your mind?</FormLabel>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  resize="none"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Hashtags</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter hashtags (comma-separated)"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Image URL</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter an image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Visibility</FormLabel>
                <Select
                  name="visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </Select>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Post
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </HStack>
  );
}
