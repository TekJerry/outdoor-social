import React, { useState } from "react";
import axios from "axios";

export default function CreatePostForm({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [visibility, setVisibility] = useState("public"); // Default to public

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/posts",
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

      alert("Post created successfully!");
      setContent("");
      setHashtags("");
      setImageUrl("");
      setVisibility("public");

      if (onPostCreated) onPostCreated(response.data); // Notify parent component
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create a Post</h3>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      ></textarea>
      <input
        type="text"
        placeholder="Hashtags (comma-separated)"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <select
        name="visibility"
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
      >
        <option value="public">Public</option>
        <option value="friends">Friends Only</option>
        <option value="private">Private</option>
      </select>
      <button type="submit">Post</button>
    </form>
  );
}
