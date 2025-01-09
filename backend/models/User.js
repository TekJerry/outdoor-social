const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date },
  location: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Friend connections
  friendRequests: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Sender of the request
      status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }, // Request status
    },
  ],
  preferences: {
    favoriteLake: { type: String },
    favoriteHuntingReservoir: { type: String },
    favoriteHuntingLodge: { type: String },
    favoriteCampsites: { type: String },
    interests: [{ type: String }],
    skillLevels: {
      hunting: { type: String },
      fishing: { type: String },
      camping: { type: String },
    },
    notifications: {
      specialEvents: { type: Boolean, default: false },
      discounts: { type: Boolean, default: false },
      updates: { type: Boolean, default: false },
    },
    dreamDestination: { type: String },
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
