const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);
////////////////////Request targeting all the article ////////////////////////////////
app.route("/article")
  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("successfully added a new Article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("successfully deleted all the articles");
      } else {
        res.send(err);
      }
    })
  });

////////////////////Request targeting a specific article ////////////////////////////////

app.route("/article/:articleTitle")

   .get(function(req,res){
     const Title = req.params.articleTitle;
        Article.findOne({title:Title},function(err,foundArticle){
          if(!err){
            res.send(foundArticle);
          }else{
            console.log(err);
            res.send("NO Matching Article is Founded");
          }
        });
   })
   .put(function(req,res){
     Article.update(
     {title:req.params.articleTitle},
     {title:req.body.title , content:req.body.content},
     {overwrite:true},
     function(err){
       if(!err){
         res.send("successfully updated the specific article .");
       }
     }

     );
   })
   .patch(function(req,res){
     Article.update(
       {title : req.params.articleTitle},
       {$set: req.body},
       function(err){
         if(!err){
           res.send("successfully updated the given field");
         }else{
           res.send(err);
         }
       }
     );
   })
   .delete(function(req,res){
     Article.deleteOne({title:req.params.articleTitle},function(err){
       if(!err){
         res.send("successfully deleted the article");
       }else{
         res.send(err);
       }
     });
   });



app.listen(3000, function() {
  console.log("Server is running at Port : 3000 ");
});
