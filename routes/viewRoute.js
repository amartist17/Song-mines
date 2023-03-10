const express = require("express");
const authController = require("./../controllers/authController");
// const userController = require('./../controllers/userController');
const viewController = require("./../controllers/viewController");
const adminController = require("./../controllers/adminController");
const router = express.Router({ mergeParams: true });
const upload = require("express-fileupload");
router.use(upload());
router.use(authController.isLoggedIn);
router.get("/login", viewController.login);
router.post("/login", authController.login);
router.post("/register", authController.signup);
router.get("/logout", authController.logout);
router.get("/forgot", viewController.forgot);
router.get("/update-password", viewController.updatePassword);
router.route("/generate-otp").post(authController.generateOtp);
router.route("/update-password").post(authController.updatePassword);

router.get("/", viewController.home);
router.get(
  "/checkout/:singer",
  authController.protect,
  viewController.checkout
);
// router.get("/checkout", viewController.checkout);

router.get("/dashboard", authController.protect, viewController.dashboard);
router.post("/add-singer", authController.protect, adminController.addSinger);
router.post(
  "/delete-singer",
  authController.protect,
  adminController.deleteSinger
);
module.exports = router;
