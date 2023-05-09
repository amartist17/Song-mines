const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const mailListSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("MailList", mailListSchema);
