const { protect } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
} = require("../controllers/userController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);
// Get logged-in user
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user,
  });
});


// Test route
router.get("/test", (req, res) => {
  res.send("User route working");
});

module.exports = router;
