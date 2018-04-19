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

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraping";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});


// test connection
app.get("/", function (req, res) {
    res.send("Hello world");
});

app.get("/scrape", function (req, res) {
    let url = "https://www.nytimes.com/section/sports/"
    axios.get(url).then(function (response) {
        //console.log('resp', response)
        var $ = cheerio.load(response.data);
        var results = []
        $("a.story-link").each(function (i, element) {

            var result = {}

            result.title = $(this).children().children('h2').text().trim()
            result.link = $(this).attr("href");
            result.description = $(this).children().children('p').text();

            console.log('title', result.title);
            console.log('link', result.link);
            console.log('description', result.description);

            results.push(result);

        });
        db.Article.create(results)
            .then(function (dbArticle) {
                db.Article.find({})
                    .then(function (articles) {
                        console.log('articles', articles)
                        res.json(articles);
                    })
                    .catch(function (err) {
                        res.json(err);
                    });
            })
            .catch(function (err) {
                return res.json(err);
            });
    });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});