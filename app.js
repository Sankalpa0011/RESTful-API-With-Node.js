const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');


const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB");


const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);



// Chaining route handlers using express middleware
app.route("/articles")
.get(async (req, res) => {
    try {
        const foundArticles = await Article.find({});
        res.send(foundArticles);
        console.log(foundArticles);
    } catch (err) {
        res.send(err);
        console.error(err);
    }
})

.post(async (req, res) => {
    //console.log(req.body.title);
    //console.log(req.body.content);  

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    try {
        await newArticle.save();
        res.send("Successfully added a new article");
        console.log("Successfully added a new article");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
})

.delete(async (req, res) => {
    try {
        await Article.deleteMany({});
        res.send("Successfully deleted all articles");
        console.log("Successfully deleted all articles");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
});





// Create a get route to fetch a specific article
app.route("/articles/:articleTitle")
.get(async (req, res) => {
    try {
        const foundArticle = await Article.findOne({title: req.params.articleTitle});
        if (foundArticle) {
            res.send(foundArticle);
            console.log(foundArticle);
        } else {
            res.send(`Article ${req.params.articleTitle} not found`);
            console.log(`Article ${req.params.articleTitle} not found`);
        }
    } catch (err) {
        res.send(err);
        console.error(err);
    }
})

.put(async (req, res) => {
    try {
        await Article.updateOne({title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content}, 
            {overwrite: true});
        res.send("Successfully updated article");
        console.log("Successfully updated article");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
})

.patch(async (req, res) => {
    try {
        await Article.updateOne({title: req.params.articleTitle}, 
            {$set: req.body});
        res.send("Successfully updated article");
        console.log("Successfully updated article");
    } catch (err) {
        res.send(err);
        console.error(err);
    };
})

.delete(async (req, res) => {
    try { 
        await Article.deleteOne({title: req.params.articleTitle});
        res.send("Successfully deleted article");
        console.log("Successfully deleted article");
    } catch (err) {
        res.send(err);
        console.error(err);
    };
})










// // Create get route to fetch all articles
// app.get("/articles", );


// // Create post route to add new article
// app.post("/articles", );


// // Delete post route to remove all articles
// app.delete("/articles", );



app.listen(3000, () => {
    console.log('Server is running on port 3000');
})