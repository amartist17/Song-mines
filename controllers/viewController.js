const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// const Product = require("./../models/productModel");
const Singer = require("./../models/singerModel");
const User = require("./../models/userModel");

exports.home = catchAsync(async (req, res, next) => {
  let singers = await Singer.find({});
  res.status(200).render("index", { singers });
});

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("login");
});

exports.dashboard = catchAsync(async (req, res, next) => {
  if (req.user.role === "admin") {
    res.status(200).render("admin-dashboard");
  } else {
    let user = await User.findOne({ id: req.user._id }).populate("orders");

    console.log(user);
    res.status(200).render("user-dashboard", { user });
  }
});

exports.checkout = catchAsync(async (req, res, next) => {
  if (req.params.singer.match(/^[0-9a-fA-F]{24}$/)) {
    let singer = await Singer.findOne({ _id: req.params.singer });
    res.status(200).render("checkout", { singer });
  }
});
// exports.me = catchAsync(async (req, res, next) => {});
