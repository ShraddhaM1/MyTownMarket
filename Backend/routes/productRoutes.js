const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Business = require("../models/Business");
const { protect } = require("../src/middleware/authMiddleware");
const multer = require("multer");

// 🔥 Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// =====================================
// ✅ CREATE PRODUCT (Owner Only)
// =====================================
router.post("/", protect, upload.array("images"), async (req, res) => {
  try {
    const { name, description, price, business } = req.body;

    // Check business exists
    const existingBusiness = await Business.findById(business);
    if (!existingBusiness) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Ensure logged-in user owns this business
    if (existingBusiness.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const imagePaths = req.files
      ? req.files.map((file) =>
          `http://localhost:5000/${file.path.replace(/\\/g, "/")}`
        )
      : [];

    const product = await Product.create({
      name,
      description,
      price,
      business,
      images: imagePaths,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(400).json({ message: error.message });
  }
});

// =====================================
// ✅ GET PRODUCTS BY BUSINESS
// =====================================
router.get("/by-business/:businessId", async (req, res) => {
  try {
    const products = await Product.find({
      business: req.params.businessId,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// // =====================================
// ✅ UPDATE PRODUCT (WITH IMAGE SUPPORT)
// =====================================
router.put("/:id", protect, upload.array("images"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("business");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ownership check
    if (product.business.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;

    // If new images uploaded → replace old ones
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) =>
        `http://localhost:5000/${file.path.replace(/\\/g, "/")}`
      );
      product.images = imagePaths;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);

  } catch (error) {
    console.error("Product update error:", error);
    res.status(500).json({ message: error.message });
  }
});

// =====================================
// ✅ DELETE PRODUCT
// =====================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("business");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check ownership
    if (product.business.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;