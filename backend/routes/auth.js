const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

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
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
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
