
/* Showing Mongoose's "Populated" Method
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
// var Note = require("./models/Note.js");
// var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

app.use(express.static("assets"));

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/skeyeskraper");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// require("./controllers/controller.js")
app.get("/", function(req, res) {
  console.log("entered get")
  res.render("../views/index",{});
});

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  // console.log("entered /scrape");
  request("https://www.nytimes.com/", function(error, response, html) {
    // console.log("entered request");
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    var arr = [];
    // Now, we grab every h2 within an article tag, and do the following:
    $("article.story.theme-summary").each(function(i, element) {
      // console.log("entered loop");
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.headline = $(this).children("a").text().trim();
      result.summary = $(this).children("p").text().trim();
      result.url = $(this).children("h2").children("a").attr("href");
      // result.link = $(this).children("a").attr("href");
      if(result.headline){
        arr.push(result);
      }
      //save articles in db
    });
    res.json(arr);
    // console.log(arr);
  });
  // Tell the browser that we finished scraping the text
  console.log("Scrape Complete");
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
