const express = require("express");
const authMiddleware = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");

const router = express.Router();

// Create a Post
router.post("/", authMiddleware, async (req, res) => {
    const { content, hashtags, photo, visibility } = req.body;
  
    try {
      const post = await Post.create({
        user: req.user.id,
        content,
        hashtags,
        photo,
        visibility,
      });
  
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Error creating post", error });
    }
  });
  

// Get All Posts
router.get("/", authMiddleware, async (req, res) => {
    try {
      // Fetch the current user and their friends
      const user = await User.findById(req.user.id).populate("friends");
      const friendIds = user.friends.map((friend) => friend._id);
  
      // Fetch posts based on visibility
      const posts = await Post.find({
        $or: [
          { visibility: "public" }, // Public posts
          { user: req.user.id }, // User's own posts
          { visibility: "friends", user: { $in: friendIds } }, // Friends-only posts
        ],
      })
        .populate("user", "name") // Populate the post author's name
        .sort({ createdAt: -1 });
  
      res.json(posts); // Send the posts as a response
    } catch (error) {
      console.error("Error in GET /api/posts:", error);
      res.status(500).json({ message: "Error fetching posts", error });
    }
  });

// Like a Post
router.put("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
    } else {
      post.likes = post.likes.filter((like) => like.toString() !== req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error });
  }
});

// Add a Comment
router.post("/:id/comment", authMiddleware, async (req, res) => {
  const { content } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    const comment = {
      user: req.user.id,
      content,
    };

    post.comments.push(comment);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

module.exports = router;

router.get("/myposts", authMiddleware, async (req, res) => {
  try {
    // Find posts created by the logged-in user
    const posts = await Post.find({ user: req.user.id })
      .populate("user", "name email") // Populate user's name and email
      .sort({ createdAt: -1 }); // Sort posts by creation date (most recent first)

    res.status(200).json(posts); // Return the user's posts
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    res.status(500).json({ message: "Error fetching user's posts", error });
  }
});
