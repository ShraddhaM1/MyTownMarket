const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    images: [String], // later Cloudinary
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
