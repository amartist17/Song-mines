const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// const Product = require("./../models/productModel");
const Singer = require("./../models/singerModel");
const User = require("./../models/userModel");
const Order = require("./../models/orderModel");
const Form = require("./../models/formModel");

exports.home = catchAsync(async (req, res, next) => {
  let singers = await Singer.find({ active: true });
  res.status(200).render("index", { singers });
});
exports.form = catchAsync(async (req, res, next) => {
  res.status(200).render("form", { id: req.params.id });
});
exports.formSubmit = catchAsync(async (req, res, next) => {
  req.body.id = req.params.id;
  let newForm = await Form.create(req.body);
  res.redirect("/");
});

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("login");
});

exports.forgot = catchAsync(async (req, res, next) => {
  res.status(200).render("forgot-password");
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  res.status(200).render("update-password");
});

exports.dashboard = catchAsync(async (req, res, next) => {
  if (req.user.role === "admin") {
    let orders = await Order.find({})
      .sort({ date: -1 })
      .limit(10)
      .populate(["user", "singer"]);
    let singers = await Singer.find({ active: true });
    // console.log(orders);
    // orders.reverse();
    res.status(200).render("admin-dashboard", { orders, singers });
  } else {
    // console.log(req.user);
    let user = await User.findById(req.user._id).populate("orders");

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
