const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Search for users by name or email
router.get("/search", authMiddleware, async (req, res) => {
    const { query } = req.query;
  
    try {
      const users = await User.find({
        $or: [
          { name: { $regex: query, $options: "i" } }, // Case-insensitive search
          { email: { $regex: query, $options: "i" } },
        ],
      }).select("name email");
  
      res.json(users);
    } catch (error) {
      console.error("Error searching for users:", error);
      res.status(500).json({ message: "Error searching for users" });
    }
  });

  // Get user's friends
router.get("/friends", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate("friends", "name email");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user.friends); // Return the list of friends
    } catch (error) {
      console.error("Error fetching friends:", error);
      res.status(500).json({ message: "Error fetching friends" });
    }
  });  

// Send a friend request
router.post("/friend-request", authMiddleware, async (req, res) => {
    const { to } = req.body; // ID of the user to send the request to
  
    try {
      const recipient = await User.findById(to);
  
      if (!recipient) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the request already exists
      const existingRequest = recipient.friendRequests.find(
        (request) => request.from.toString() === req.user.id
      );
  
      if (existingRequest) {
        return res.status(400).json({ message: "Friend request already sent" });
      }
  
      // Add the friend request
      recipient.friendRequests.push({ from: req.user.id, status: "pending" });
      await recipient.save();
  
      res.json({ message: "Friend request sent" });
    } catch (error) {
      console.error("Error sending friend request:", error);
      res.status(500).json({ message: "Error sending friend request" });
    }
  });

  // Get incoming friend requests
router.get("/friend-requests", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .populate("friendRequests.from", "name email") // Populate sender info
        .select("friendRequests");
  
      res.json(user.friendRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      res.status(500).json({ message: "Error fetching friend requests" });
    }
  });
  
  //Accept Friend
  router.post("/friend-requests/accept", authMiddleware, async (req, res) => {
    const { requestId } = req.body; // ID of the sender (friend request initiator)
  
    try {
      const user = await User.findById(req.user.id);
      const sender = await User.findById(requestId);
  
      if (!user || !sender) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the request exists
      const requestIndex = user.friendRequests.findIndex(
        (req) => req.from.toString() === requestId
      );
      if (requestIndex === -1) {
        return res.status(400).json({ message: "Friend request not found" });
      }
  
      // Add each other to the friends list
      user.friends.push(requestId);
      sender.friends.push(req.user.id);
  
      // Remove the friend request
      user.friendRequests.splice(requestIndex, 1);
  
      await user.save();
      await sender.save();
  
      res.json({ message: "Friend request accepted" });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      res.status(500).json({ message: "Error accepting friend request" });
    }
  });


  //Reject Friend
  router.post("/friend-requests/reject", authMiddleware, async (req, res) => {
    const { requestId } = req.body;
  
    try {
      const user = await User.findById(req.user.id);
  
      // Check if the request exists
      const requestIndex = user.friendRequests.findIndex(
        (req) => req.from.toString() === requestId
      );
      if (requestIndex === -1) {
        return res.status(400).json({ message: "Friend request not found" });
      }
  
      // Remove the friend request
      user.friendRequests.splice(requestIndex, 1);
      await user.save();
  
      res.json({ message: "Friend request rejected" });
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      res.status(500).json({ message: "Error rejecting friend request" });
    }
  });
  
  
  

module.exports = router;
