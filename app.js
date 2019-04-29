var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var multer = require("multer");
var fs = require("fs-extra");
var path = require("path");
var port = 3000;
var ip = "localhost";
app.use(express.static("./"))
var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

var upload = multer({
  storage: Storage
});

mongoose.connect("mongodb://localhost:27017/images_db", {
  useNewUrlParser: true
});

var imagesSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Image = mongoose.model("Image", imagesSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  Image.find({}, function (err, allImages) {
    if (err) {
      console.log(err);
    } else {
      res.render("gallery.ejs", { images: allImages });
    }
  });
});

app.post("/", upload.single("photo"), function (req, res) {
  var name = req.body.name;
  var image = req.file.filename;
  var newimage = { name: name, image: image };
  Image.create(newimage, function () {
    res.redirect("/");
  });
});

app.get("/new", function (req, res) {
  res.render("new.ejs");
});

app.listen(port, ip, function () {
  console.log("Gallery");
});
