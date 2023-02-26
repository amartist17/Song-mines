const { promisify } = require("util");
const User = require("./../models/userModel");
// const APIFeatures = require('./../utils/apifeatures');
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// const SendEmail = require('./../utils/email');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { token } = require("morgan");
const nodemailer = require("nodemailer");
const { findByIdAndUpdate } = require("./../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  let cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  console.log(cookieOptions);
  if (process.env.ENVIRONMENT === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  //   res.status(statusCode).json({
  //     status: "success",
  //     token,
  //     data: {
  //       user,
  //     },
  //   });
  res.redirect("/");
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    let message = `Duplicate value: ${Object.values(err.keyValue)[0]} for ${
      Object.keys(err.keyValue)[0]
    } field`;
    return res.render("error", {
      status: 400,
      message: message,
    });
  }
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.render("error", {
      status: 400,
      message: "Please provide email and password",
    });
  // return next(new AppError("Please provide email and password", 400));

  let user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.passwordCheck(password, user.password)))
    // return next(new AppError("Invalid email or password", 401));
    return res.render("error", {
      status: 401,
      message: "Invalid email or password",
    });
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) If token exists
  let token;
  token = req.cookies.jwt;
  if (!token)
    // return next(
    //   new AppError("You are not logged in, Please login to get access.", 401)
    // );
    return res.redirect("/login");

  // 2) I token is valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //   3) Check if user still exists (not deleted)
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    // return next(
    //   new AppError("User belonging to this token doesn't Exist", 401)
    // );
    return res.render("error", {
      status: 401,
      message: "User belonging to this token doesn't Exist",
    });

  // 4) Check if password changed
  // if (currentUser.passwordChangedAfter(decoded.iat)) {
  //   return next(new AppError("User recently changed password", 401));
  // }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // 1) Token exists?
  if (req.cookies.jwt) {
    // 2)Verify token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    //   3) Check if user still exists (not deleted)
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next();

    // 4) Check if password changed
    // if (currentUser.passwordChangedAfter(decoded.iat)) {
    //   return next();
    // }

    // User is logged in
    res.locals.user = currentUser;
    return next();
  }
  res.locals.user = null;
  next();
});

exports.logout = (req, res) => {
  res.cookie("jwt", "Logged Out", {
    expires: new Date(Date.now() + 10 * 10),
    httpOnly: true,
  });
  // res.status(200).json({
  //   status: 'success',
  // });
  res.redirect("/");
};

// exports.forgotPassword = catchAsync(async (req, res, next) => {
//   // 1) get user based on email
//   let email = req.body.email;
//   let user = await User.findOne({ email });
//   if (!user) return next(new AppError('User not found', 404));

//   // 2) generate random reset token
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });

//   // 3) Send mail to user's email
//   const resetURL = `${req.protocol}://${req.get(
//     'host'
//   )}/api/v1/users/resetPassword/${resetToken}`;

//   const message = `Forget your password? submit a patch request with your new password and passwordConfirm to:
//         ${resetURL}.\n if you did not forget your password please ignore this email`;

//   try {
//     SendEmail({
//       email: email,
//       subject: 'Your password reset token valid for 10 min',
//       message,
//     });
//   } catch (error) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     return next(
//       new AppError(
//         'There was an error sending the email, Try again later.',
//         500
//       )
//     );
//   }
//   res.status(200).json({
//     status: 'success',
//     message: 'Token sent to mail',
//   });
// });

// exports.resetPassword = catchAsync(async (req, res, next) => {
//   // 1) Get user based on token
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex');
//   let user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   // 2) If token has not expired and user exists change password
//   if (!user) return next(new AppError('Token is invalid or has expired', 400));

//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   createSendToken(user, 200, res);
// });

// exports.updatePassword = catchAsync(async (req, res, next) => {
//   // 1) Get user
//   const user = await User.findById(req.user._id).select('+password');
//   // if (!user) return next(new AppError('User does not exist', 400));

//   // 2) Compare posted password
//   if (!(await user.passwordCheck(req.body.passwordCurrent, user.password)))
//     return next(new AppError('Invalid password', 401));

//   // 3) Update password
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   await user.save();

//   // 4) Log user in, send jwt
//   createSendToken(user, 200, res);
// });

exports.updatePassword = async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  console.log(req.body);
  if (req.body.otp == user.otp) {
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    res.redirect("/dashboard");
  } else {
    // res.send("Invalid Otp");
    return res.render("error", {
      status: 401,
      message: "Invalid OTP",
    });
  }
};

exports.generateOtp = async (req, res, next) => {
  // let transporter = nodemailer.createTransport({
  //   host: "mail.amardeepsingh.tech",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: process.env.EMAILID, // generated ethereal user
  //     pass: process.env.EMAILPASSWORD, // generated ethereal password
  //   },
  // });
  // // send mail with defined transport object
  // let info = await transporter.sendMail({
  //   from: process.env.EMAILID, // sender address
  //   to: "gujraal2006@gmail.com", // list of receivers
  //   subject: req.body.subject, // Subject line
  //   text: "By: " + req.body.senderMail + "\n" + req.body.msgBody + "", // plain text body
  // });
  // res.redirect("/");

  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  console.log(otp);
  let user = await User.findOneAndUpdate(
    { email: req.body.email },
    { otp: otp }
  );
  res.redirect("/update-password");
};
