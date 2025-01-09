const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
