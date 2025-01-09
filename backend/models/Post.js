const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Author
  content: { type: String, required: true }, // Text content
  photo: { type: String }, // URL of the image
  hashtags: [{ type: String }], // Array of hashtags
  visibility: { type: String, enum: ["public", "friends", "private"], default: "public" }, // Visibility settings
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked the post
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Author of the comment
      content: { type: String }, // Comment text
      createdAt: { type: Date, default: Date.now }, // Timestamp
    },
  ],
  createdAt: { type: Date, default: Date.now, expires: "30d" }, // Post expires after 30 days
});

module.exports = mongoose.model("Post", postSchema);
