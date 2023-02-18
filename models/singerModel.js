const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const singerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  orders: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  ],
  imageName: {
    type: String,
  },
  audioName: {
    type: String,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Singer", singerSchema);
