const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(express.static("public"));

const url = "mongodb://localhost:27017/wikiDB";

mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true });

const articleScheema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleScheema);

app.route("/articles")
    .get((req, res) => {

        Article.find({}, (err, results) => {
            if (!err) {
                res.send(results);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {

        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });
        article.save( (err) =>{
            res.send(err)
        });
    })
    .delete((req, res) =>{

        Article.deleteMany({}, (err)=>{
            res.send(err);
        });
    });

app.route("/articles/:articleTitle")
    .get( (req, res) => {
        Article.findOne( {title : req.params.articleTitle}, (err, results) => {
           if(!err){
               res.send(results);
           }else{
               res.send(err);
            }
        });

    })
    .put((req, res)=>{
        Article.updateOne(
            {title : req.params.articleTitle},
            {
                title : req.body.title,
                content : req.body.content
            },
            { overwrite : true},
            (err) => {
               res.send(err);
            });

    })
    .patch( (req, res) =>{
        Article.updateOne(
            {title : req.params.articleTitle},
            {$set : req.body},
            (err) => {
                res.send(err);
            });

    })
    .delete( (req, res) =>{
        Article.deleteOne( {title : req.params.articleTitle}, (err) => {
            res.send(err);
        })
    });

app.listen(process.env.PORT ||port,  () =>{
    console.log(`listening at http://localhost:${port}`);
});