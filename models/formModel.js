const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const formSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
  },
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  occasion: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  relationship: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: true,
  },
  storyMust: {
    type: String,
    required: true,
  },
  feel: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
  tempo: {
    type: String,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Form", formSchema);
