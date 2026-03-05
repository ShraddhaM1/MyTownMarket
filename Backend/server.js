const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const connectDB = require("./src/config/db");

// Routes
const userRoutes = require("./src/routes/userRoutes");
const businessRoutes = require("./routes/businessRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// =============================
// DB
// =============================
connectDB();

// =============================
// Middleware
// =============================
app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================
// Test route
// =============================
app.get("/", (req, res) => {
  res.send("MyTownMarket API running 🚀");
});

// =============================
// API Routes
// =============================
app.use("/api/users", userRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes); // ⭐ THIS WAS MISSING

// =============================
// Server
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});