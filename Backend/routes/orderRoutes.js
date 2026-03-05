const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ============================
// CREATE ORDER
// ============================
router.post("/", async (req, res) => {
  try {
    const order = new Order({
      businessId: req.body.businessId,
      items: req.body.items,
      totalAmount: req.body.totalAmount
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});


// ============================
// GET ORDERS (FILTER BY BUSINESS)
// ============================
router.get("/", async (req, res) => {
  try {

    const { business } = req.query;

    let filter = {};

    // If business id is provided, filter orders
    if (business) {
      filter.businessId = business;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;