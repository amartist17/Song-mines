const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// const Product = require("./../models/productModel");

exports.home = catchAsync(async (req, res, next) => {
  res.status(200).render("index");
});

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("login");
});

exports.dashboard = catchAsync(async (req, res, next) => {
  if (req.user.role === "admin") {
    res.status(200).render("admin-dashboard");
  } else {
    
    res.status(200).render("user-dashboard");
  }
});
// exports.me = catchAsync(async (req, res, next) => {});
