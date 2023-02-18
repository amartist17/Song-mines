const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));

// app.get("/", (req, res) => {
//   res.render("index");
// });

const viewRouter = require("./routes/viewRoute");
app.use("/", viewRouter);
const orderRouter = require("./routes/orderRoute");
app.use("/order", orderRouter);

const Singer = require("./models/singerModel");
app.post("/add-singer", async (req, res) => {
  let singer = await Singer.create(req.body);
  res.send(singer);
});

module.exports = app;
