const express = require("express");
const authController = require("./../controllers/authController");
// const userController = require('./../controllers/userController');

const router = express.Router({ mergeParams: true });

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
// router.route('/forgotPassword').post(authController.forgotPassword);
// router.route('/resetPassword/:token').patch(authController.resetPassword);

// router
//   .route('/updateMyPassword')
//   .patch(authController.protect, authController.updatePassword);

// router
//   .route('/updateMe')
//   .patch(authController.protect, userController.updateMe);

// router
//   .route('/deleteMe')
//   .delete(authController.protect, userController.deleteMe);

// router.route('/').get(userController.getAllUsers);
//   .post(productController.createProduct);

// router
//   .route('/:id')
//   // .get(productController.getProduct)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
