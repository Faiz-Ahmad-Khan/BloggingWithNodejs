var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var port = 3000;

app.set("view engine","ejs");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));

const options = {
    useNewUrlParser: true,
  };

mongoose.connect('mongodb://127.0.0.1:27017/bloggingApp', options).then(()=>{
    console.log("Connected");
})
.catch((err)=>{
    console.log("Error",err);
    process.exit(1);
});

var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body  : String,
    created : {type : Date, default:  Date.now}
});

var blog = mongoose.model("blog", blogSchema);

// blog.create({
//     title : "Test",
//     image : "https://images.unsplash.com/photo-1533458504656-81a904b29a69?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b888832a29d97d8eb911d207d29f7cf5&auto=format&fit=crop&w=500&q=60",
//     body : "A test blog body description"
// });

app.get("/",function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req, res){
    blog.find({}, function(err, blogs){
        if(err){
            console.log("An Error Occured");
            console.log(err);
        }
        else{
            res.render("index",{blogs: blogs});
        }
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs",function(req, res){
    blog.create(req.body.blog, function(err, Blog){
        if(err){
            console.log(err);
            res.send("There occurred an Error");
        }else{
            console.log(Blog);
            res.redirect("/");
        }
    });
});





app.listen(port , function(){
    console.log("The server started on port"+port);
});