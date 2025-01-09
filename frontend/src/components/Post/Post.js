import React from "react";

export default function Post({ post, onLike, onComment }) {
  return (
    <div>
      <h3>{post.user.name}</h3>
      <p>{post.content}</p>
      {post.photo && <img src={post.photo} alt="Post" style={{ width: "100%" }} />}
      <p>
        {post.hashtags.map((tag, index) => (
          <span key={index}>#{tag} </span>
        ))}
      </p>
      {/* Like Button */}
      <button onClick={() => onLike(post._id)}>
        {post.likes.includes(localStorage.getItem("userId")) ? "Unlike" : "Like"} ({post.likes.length})
      </button>
      <div>
        <h4>Comments:</h4>
        {post.comments.map((comment, index) => (
          <div key={index}>
            <strong>{comment.user?.name || "Anonymous"}:</strong> {comment.content}
          </div>
        ))}
        {/* Comment Input */}
        <input
          type="text"
          placeholder="Add a comment..."
          onKeyDown={(e) => {
            if (e.key === "Enter") onComment(post._id, e.target.value);
          }}
        />
        {/* Submit Button for Comments */}
        <button
          onClick={(e) => {
            const input = e.target.previousSibling; // Find the input element
            if (input && input.value.trim()) {
              onComment(post._id, input.value);
              input.value = ""; // Clear input after submission
            }
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

