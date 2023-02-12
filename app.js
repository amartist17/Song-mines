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

module.exports = app;
