const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// const Product = require("./../models/productModel");
const Singer = require("./../models/singerModel");
const User = require("./../models/userModel");
const Order = require("./../models/orderModel");
const Form = require("./../models/formModel");
const MailList = require("./../models/mailListModel");
const nodemailer = require("nodemailer");

exports.home = catchAsync(async (req, res, next) => {
  let singers = await Singer.find({ active: true });
  res.status(200).render("index", { singers });
});
exports.form = catchAsync(async (req, res, next) => {
  let singers = await Singer.find({ active: true });
  res.status(200).render("form", { singers });
});
exports.addMailList = catchAsync(async (req, res, next) => {
  let newMail = await MailList.create(req.body);
  res.redirect("/");
});
exports.formSubmit = catchAsync(async (req, res, next) => {
  let newForm = await Form.create(req.body);
  // console.log(req.body);
  // res.redirect("/checkout/" + newForm._id + "/" + req.body.id);
  res.redirect("/thank-you");
});
exports.thankYou = catchAsync(async (req, res, next) => {
  // let newForm = await Form.create(req.body);
  // console.log(req.body);
  // res.redirect("/checkout/" + newForm._id + "/" + req.body.id);
  res.render("thank-you");
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
    // let orders = await Order.find({})
    //   .sort({ date: -1 })
    //   .limit(10)
    //   .populate(["user", "singer"]);
    let forms = await Form.find({}).sort({ date: -1 }).limit(10);
    // .populate(["user", "singer"]);
    let singers = await Singer.find({ active: true });
    // console.log(orders);
    // orders.reverse();
    res.status(200).render("admin-dashboard", { forms, singers });
  } else {
    // console.log(req.user);
    let user = await User.findById(req.user._id).populate("orders");

    console.log(user);
    res.status(200).render("user-dashboard", { user });
  }
});

exports.viewForm = catchAsync(async (req, res, next) => {
  let form = await Form.findOne({ _id: req.params.formid });
  res.json(form);
});

exports.checkout = catchAsync(async (req, res, next) => {
  if (
    req.params.form.match(/^[0-9a-fA-F]{24}$/) &&
    req.params.singer.match(/^[0-9a-fA-F]{24}$/)
  ) {
    let singer = await Singer.findOne({ _id: req.params.singer });
    res.status(200).render("checkout", { singer, form: req.params.form });
  }
});

exports.mail = catchAsync(async (req, res, next) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "mail.songmines.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SERVEREMAILID, // generated ethereal user
        pass: process.env.SERVEREMAILPASSWORD, // generated ethereal password
      },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "info@songmines.com", // sender address
      to: "info@songmines.com", // list of receivers
      subject: req.body.subject, // Subject line
      text:
        "By: " +
        req.body.name +
        "\nfrom: " +
        req.body.email +
        "\n" +
        req.body.message +
        " ", // plain text body
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// exports.me = catchAsync(async (req, res, next) => {});
