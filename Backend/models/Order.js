const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: Number,

    status: {
      type: String,
      default: "Paid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);