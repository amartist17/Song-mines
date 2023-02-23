const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/create-order/:id")
  .post(authController.protect, orderController.createOrder);
router.route("/success").post(authController.protect, orderController.success);
router
  .route("/change-order-status/:id")
  .post(authController.protect, orderController.change);

module.exports = router;
