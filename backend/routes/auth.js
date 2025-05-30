const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Sign-Up Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", { email, password }); // Log request data

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Invalid credentials");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("JWT_SECRET from environment:", process.env.JWT_SECRET);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Login successful:", { token });
    res.json({ token, email: user.email });
  } catch (error) {
    console.error("Login error:", error); // Log the error
    res.status(500).json({ message: "Server hitting error" });
  }
});

// Protected Route Example
router.get("/profile", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password"); // Exclude the password
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  // Fetch user preferences (Protected)
  router.get("/preferences", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("preferences");
      res.json(user.preferences || {});
    } catch (error) {
      res.status(500).json({ message: "Error fetching preferences" });
    }
  });
  
  // Update user preferences (Protected)
  router.put("/preferences", authMiddleware, async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { preferences: req.body },
        { new: true, runValidators: true }
      ).select("preferences");
  
      res.json(updatedUser.preferences);
    } catch (error) {
      res.status(500).json({ message: "Error updating preferences" });
    }
  });

  // In-memory blacklist for simplicity (replace with a database in production)
let tokenBlacklist = [];

router.post('/logout', (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    tokenBlacklist.push(token); // Add token to blacklist
    res.status(200).json({ message: "Logged out successfully." });
  } else {
    res.status(400).json({ message: "No token provided." });
  }
});

module.exports = router;
