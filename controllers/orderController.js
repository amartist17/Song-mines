const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// const Product = require("./../models/productModel");
const Singer = require("../models/singerModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
require("dotenv").config();
const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_SECRET_ID,
});

exports.createOrder = catchAsync(async (req, res, next) => {
  let singer = await Singer.findOne({ _id: req.params.id });

  const options = {
    amount: singer.price * 100, // amount in the smallest currency unit
    currency: "INR",
    notes: req.body.desc,
  };
  instance.orders.create(options, async function (err, order) {
    // console.log(order);
    // let newOrder = await Order.create({
    //   user: req.user._id,
    //   price: singer.price,
    //   desc: req.body.desc,
    // });
    res.send({ orderId: order.id });
  });
  // return next();
});

exports.success = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  let newOrder = await Order.create({
    user: req.user._id,
    singer: req.body.singer,
    price: req.body.price / 100,
    desc: req.body.desc,
    razorpay_payment_id: req.body.razorpay_payment_id,
    razorpay_order_id: req.body.razorpay_order_id,
    razorpay_signature: req.body.razorpay_signature,
  });
  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      orders: {
        $each: [newOrder._id],
        $position: 0,
      },
    },
  });

  await Singer.findByIdAndUpdate(req.user._id, {
    $push: {
      orders: {
        $each: [newOrder._id],
        $position: 0,
      },
    },
  });
  next();
});

exports.change = catchAsync(async (req, res, next) => {
  console.log(req.body);
  let order = await Order.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
  });
  res.redirect("/dashboard");
});
