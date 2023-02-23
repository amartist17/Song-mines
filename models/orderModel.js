const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  singer: {
    type: mongoose.Schema.ObjectId,
    ref: "Singer",
  },
  razorpay_payment_id: String,
  razorpay_order_id: String,
  razorpay_signature: String,
  price: {
    type: Number,
  },
  desc: {
    type: String,
  },

  status: {
    type: String,
    enum: ["Cancelled", "Processing", "Delivered"],
    default: "Processing",
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
