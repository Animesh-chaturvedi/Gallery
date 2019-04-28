var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var multer = require("multer");
var fs = require("fs-extra");
var port = 3000;
var ip = "localhost";

var upload = multer({ dest: "uploads/" });

mongoose.connect("mongodb://localhost:27017/images_db", {
  useNewUrlParser: true
});

var imagesSchema = new mongoose.Schema({
  name: String,
  image: { data: Buffer, contentType: String }
});

var Image = mongoose.model("Image", imagesSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  Image.find({}, function(err, allImages) {
    if (err) {
      console.log(err);
    } else {
      res.render("gallery.ejs", { images: allImages });
    }
  });
});

app.post("/", upload.single("photo"), function(req, res) {
  var a = new Image();
  a.name = req.body.name;
  var img = fs.readFileSync(req.file.path);
  a.image.data = img.toString("base64");
  a.image.contentType = "image/jpg";
  a.save(function(err, a) {
    if (err) throw err;

    console.error("saved img to mongo");
    res.redirect("/");
  });
});

app.get("/new", function(req, res) {
  res.render("new.ejs");
});

app.listen(port, ip, function() {
  console.log("Gallery");
});
