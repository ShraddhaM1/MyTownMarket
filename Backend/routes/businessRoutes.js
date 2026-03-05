const express = require("express");
const router = express.Router();
const Business = require("../models/Business");
const { protect } = require("../src/middleware/authMiddleware");
const multer = require("multer");

// 🔥 Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "qrImage", maxCount: 1 }
]);

// =====================================
// 🔥 CREATE BUSINESS (Owner Only)
// =====================================
router.post("/", protect, uploadFields, async (req, res) => {
  try {

    const imagePaths = req.files?.images
      ? req.files.images.map((file) =>
          `http://localhost:5000/${file.path.replace(/\\/g, "/")}`
        )
      : [];

    const qrImagePath = req.files?.qrImage
      ? `http://localhost:5000/${req.files.qrImage[0].path.replace(/\\/g, "/")}`
      : null;

    const business = await Business.create({
      name: req.body.name,
      gst: req.body.gst,
      sector: req.body.sector,
      address: req.body.address,
      description: req.body.description,
      phone: req.body.phone,
      email: req.body.email,

      upi: req.body.upi,
      qrImage: qrImagePath,

      images: imagePaths,
      owner: req.user.id,
    });

    res.status(201).json(business);

  } catch (err) {
    console.error("Business creation error:", err);
    res.status(400).json({ message: err.message });
  }
});


// =====================================
// 🔥 UPDATE BUSINESS (NEW)
// =====================================
router.put("/:id", protect, uploadFields, async (req, res) => {
  try {

    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (business.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    business.name = req.body.name || business.name;
    business.gst = req.body.gst || business.gst;
    business.sector = req.body.sector || business.sector;
    business.address = req.body.address || business.address;
    business.description = req.body.description || business.description;
    business.phone = req.body.phone || business.phone;
    business.email = req.body.email || business.email;

    business.upi = req.body.upi || business.upi;

    // ⭐ update QR
    if (req.files?.qrImage) {
      business.qrImage =
        `http://localhost:5000/${req.files.qrImage[0].path.replace(/\\/g, "/")}`;
    }

    // ⭐ update business images
    if (req.files?.images) {
      const imagePaths = req.files.images.map((file) =>
        `http://localhost:5000/${file.path.replace(/\\/g, "/")}`
      );
      business.images = imagePaths;
    }

    const updatedBusiness = await business.save();

    res.json(updatedBusiness);

  } catch (error) {
    console.error("Business update error:", error);
    res.status(500).json({ message: error.message });
  }
});

// =====================================
// 🔥 GET ALL BUSINESSES
// =====================================
router.get("/", async (req, res) => {
  try {
    const businesses = await Business.find();
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =====================================
// 🔥 GET MY BUSINESSES
// =====================================
router.get("/my", protect, async (req, res) => {
  try {
    const businesses = await Business.find({
      owner: req.user.id,
    });
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =====================================
// 🔥 GET SINGLE BUSINESS
// =====================================
router.get("/:id", async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json(business);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;