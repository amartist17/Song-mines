const express = require("express");
const authController = require("./../controllers/authController");
// const userController = require('./../controllers/userController');
const viewController = require("./../controllers/viewController");

const router = express.Router();

router.use(authController.isLoggedIn);
router.get("/login", viewController.login);
router.post("/login", authController.login);
router.post("/register", authController.signup);
router.get("/logout", authController.logout);

router.get("/", viewController.home);

router.get("/dashboard", authController.protect, viewController.dashboard);

module.exports = router;
