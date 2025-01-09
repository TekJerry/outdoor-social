import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "../../components/Post/Post";
import CreatePostForm from "../../components/CreatePostForm/CreatePostForm";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/posts", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            setPosts(response.data); // Update state with posts
          } catch (error) {
            console.error("Error fetching posts:", error);
          }
        };
      
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${postId}/like`,
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
        `http://localhost:5000/api/posts/${postId}/comment`,
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

  return (
    <div>
      <h1>Feed</h1>
      <CreatePostForm onPostCreated={handlePostCreated} />
      <div>
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>
    </div>
  );
}
