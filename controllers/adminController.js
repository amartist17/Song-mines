const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// const Product = require("./../models/productModel");
const Singer = require("../models/singerModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const path = require("path");

exports.addSinger = catchAsync(async (req, res) => {
  console.log("okay");

  if (req.user.role === "admin") {
    if (req.files) {
      let audio = req.files.audio;
      let image = req.files.image;
      let audioName =
        req.body.name.split(" ").join("") + path.extname(audio.name);
      let imageName =
        req.body.name.split(" ").join("") + path.extname(image.name);
      audio.mv(
        path.join(__dirname, "../static", "singers", "audio/" + audioName),
        function (err) {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          } else return res.send("Singer Added");
        }
      );
      image.mv(
        path.join(__dirname, "../static", "singers", "image/" + imageName),
        async function (err) {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          } else {
            const newSinger = await Singer.create({
              name: req.body.name,
              price: req.body.price,
              imageName: imageName,
              audioName: audioName,
            });
            // return res.redirect("/dashboard");
          }
        }
      );
    }
  }
});

exports.deleteSinger = catchAsync(async (req, res) => {
  let singer = await Singer.findByIdAndUpdate(req.body.id, {
    active: false,
  });
  res.send("Singer Deleted");
});
