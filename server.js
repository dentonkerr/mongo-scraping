var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");
var exphbs = require("express-handlebars");

var db = require("./models");

var PORT = 3000;

var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoScraping");

//Set up handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// test connection
app.get("/", function (req, res) {
    res.send("Hello world");
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.reddit.com/r/sports/").then(function (response) {

        var $ = cheerio.load(response.data);

        $("p.title").each(function (i, element) {

            var result = {};

            result.title = $(this).text();
            result.link = $(this).children("a").attr("href");

            console.log(result.title);
            console.log(result.link);

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });
    })
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});