const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: "https://outdoor-social.netlify.app/", // Replace with your actual frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/api", (req, res) => {
  res.send("Welcome to the Outdoor Social Platform!");
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/post"));


const userRoutes = require("./routes/user"); // Adjust the path as needed
app.use("/api/users", userRoutes);



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
