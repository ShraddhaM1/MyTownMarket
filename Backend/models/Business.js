const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    sector: {
      type: String,
    },

    description: {
      type: String,
    },

    phone: {
      type: String,
    },

    address: {
      type: String,
    },

    // ⭐ Payment fields
    upi: {
      type: String,
    },

    qrImage: {
      type: String,
    },

    // ⭐ Business images
    images: [
      {
        type: String,
      },
    ],

    // ⭐ Owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", BusinessSchema);