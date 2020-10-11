var express = require("express");
    request = require("request");
    app = express();
    bodyparser = require("body-parser");
    mongoose = require("mongoose");


app.use(bodyparser.urlencoded({extented:true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var campgrounddb = mongoose.model("campgrounddb", campgroundSchema);
/*
campgrounddb.create(
    {
        name: "Salmon Creek",
        image: "https://cf.bstatic.com/images/hotel/max1280x900/264/264280398.jpg"
    }, function(err, back_of_campground){
        if(err){
            console.log(err);
        }
        else {
            console.log("successfully add a new campground");
            console.log(back_of_campground);
        }
    });
*/

app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campground", function(req,res){
    campgrounddb.find({}, function(err, all_back_of_campground){
        if(err){
            console.log(err);
        }
        else{
            console.log("/campground successfully get data");
            res.render("campground", {campgrounds: all_back_of_campground});
        }
    });
});

app.post("/campground", function(req,res){
    var newname = req.body.nameofimage;
    var newurl = req.body.urlofimage;
    campgrounddb.create(
        {
            name: newname,
            image: newurl
        }, function(err, back_of_campground){
            if(err){
                console.log(err);
            }
            else {
                console.log("successfully add a new campground");
                console.log(back_of_campground);
                res.redirect("/campground");
            }
        });
    
});

app.get("/campground/new", function(req,res){
    res.render("newcamp");
});

app.listen(3000, function(){
    console.log("Program started");
});