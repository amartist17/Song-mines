const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  let message = `Invalid ${err.path}: ${err.value}`;
  // return new AppError(message, 400);
  return res.render("error", {
    status: 400,
    message: message,
  });
};
const handleDuplicateFieldsDB = (err) => {
  let message = `Duplicate value: ${Object.values(err.keyValue)[0]} for ${
    Object.keys(err.keyValue)[0]
  } field`;
  // return new AppError(message, 400);
  return res.render("error", {
    status: 400,
    message: message,
  });
};
const handleValidationErrorDB = (err) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  let message = `Invalid input data. ${errors.join(", ")}`;
  // return new AppError(message, 400);
  return res.render("error", {
    status: 400,
    message: message,
  });
};
const handleJWTError = (err) => {
  let message = `Invalid Token, Please login again`;
  // return new AppError(message, 401);
  return res.render("error", {
    status: 401,
    message: message,
  });
};
const handleJWTExpiredError = (err) => {
  let message = `Token Expired, Please login again`;
  // return new AppError(message, 401);
  return res.render("error", {
    status: 401,
    message: message,
  });
};
// const sendErrDev = (err, res) => {
//   // res.status(err.statusCode).json({
//   //   status: err.status,
//   //   error: err,
//   //   message: err.message,
//   //   stack: err.stack,
//   // });
//   res.render("error", {
//     status: err.status,
//     message: err.message,
//   });
// };
// const sendErrProd = (err, res) => {
//   // if (err.isOperational) {
//   //   res.status(err.statusCode).json({
//   //     status: err.status,
//   //     message: err.message,
//   //   });
//   // } else {
//   //   // programming or unknown error
//   //   console.error("ERROR!!!", err);
//   //   res.status(500).json({
//   //     status: "error",
//   //     message: "Something went wrong",
//   //   });
//   // }
//   res.render("error", {
//     status: err.status,
//     message: err.message,
//   });
// };

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log("Error");
  res.render("error", {
    status: err.status,
    message: err.message,
  });
  // sendErrProd(err, res);
  // if (process.env.NODE_ENV == "production") {
  //   let error = { ...err };
  //   if (err.name === "CastError") error = handleCastErrorDB(error);
  //   if (error.code == 11000) error = handleDuplicateFieldsDB(error);
  //   if (err.name === "ValidationError") error = handleValidationErrorDB(error);
  //   if (err.name === "JsonWebTokenError") error = handleJWTError(error);
  //   if (err.name === "TokenExpiredError") error = handleJWTExpiredError(error);
  //   sendErrProd(err, res);
  // } else {
  //   sendErrDev(err, res);
  // }
};
// if (process.env.NODE_ENV == 'development')
