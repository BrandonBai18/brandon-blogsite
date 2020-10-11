var express = require("express");
const passport = require("passport");
var request = require("request");
    bodyparser = require("body-parser");
    mongoose = require("mongoose");
    app = express();
    LocalStrategy = require("passport-local");
    User = require("./models/user");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

//packages setup finish


//creating blog database and blog model
mongoose.connect("mongodb://localhost/blog");
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{
        type: Date, 
        default: Date.now
    }
});
var blog = mongoose.model("blog", blogSchema);
// finishing blog database creation!



//authorization setup:
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user; 
    next();  
});
//autheorization setup finish!




app.get("/blogs", function(req,res){
    blog.find({}, function(err, back_blog){
        if (err){
            console.log(err);
        }
        else {
            console.log(back_blog);
            res.render("index", {blogs: back_blog, currentUser: req.user});
        }
    });
});

app.post("/blogs", function(req,res){
    blog.create(req.body.addedblog, function(err, back_blog){
            if(err){
                console.log(err);
            }
            else {
                console.log("successfully add a test blog");
                console.log(back_blog);
                res.redirect("/blogs");
            }
        });
});

app.get("/blogs/new",isLoggedIn, function(req,res){
    res.render("new");
});

app.get("/blogs/:Id", function(req,res){
    blog.findById(req.params.Id, function(err, back_blog){
        if (err){
            res.redirect("/blogs");
        } 
        else{
            res.render("show", {blog: back_blog});
        }
    })
});

app.get("/register", function(req,res){
    res.render("register");   
});

app.post("/register", function(req, res){
    var username = req.body.username;
    var password = req.body.password;   
    var newUser = new User({username: username});
    User.register(newUser, password, function(err, user){
        if (err){
            console.log(err);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log(req.user);
            res.redirect("/blogs");
        });
    });
});

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req,res){
});


app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/login");
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, function(){
    console.log("Server is running");
});




/* 
blog.create(
    {
        title: "test of title ",
        image: "test of image",
        body: "test of body "
    }, function(err, back_blog){
        if(err){
            console.log(err);
        }
        else {
            console.log("successfully add a test blog");
            console.log(back_blog);
        }
    });
*/