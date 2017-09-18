
/* Showing Mongoose's "Populated" Method
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

const PORT = process.env.PORT || 3000;

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
mongoose.connect("mongodb://heroku_q61w77qh:k2rg3q7k759g4pu4ohhp0kveq1@ds139844.mlab.com:39844/heroku_q61w77qh");
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
  var result = {};
  request("https://www.nytimes.com/", function(error, response, html) {
    // console.log("entered request");
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // var arr = [];

    // Now, we grab every h2 within an article tag, and do the following:
    $("article.story.theme-summary").each(function(i, element) {
      // console.log("entered loop");
      // Save an empty result object
      // var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("h2").text();
      result.link = $(this).children("h2").children("a").attr("href");
      result.summary = $(this).children("p.summary").text().trim();

      // result.link = $(this).children("a").attr("href");
      if(result.title && result.summary && result.link){
        // arr.push(result);
        let newArticle = new Article(result);

        newArticle.save(function(err, doc){
          if(err){
            console.log(err);
          }
          else{
            console.log('saved stuff: ',doc);
          }
        });

      }
    });
    res.redirect("/");
    // console.log(arr);
  });
  // Tell the browser that we finished scraping the text
  console.log("Scrape Complete");
});

app.get("/allarticles", function(req, res){
  Article.find({}, function(err, articles) {
  //do stuff
  if(err){
    console.log(err);
  }else{
    res.json(articles);
  }
  });
})

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
