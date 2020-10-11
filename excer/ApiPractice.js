var express = require("express");
var request = require("request");
var app = express();
app.set("view engine", "ejs");

app.get("/", function(req,res){
    res.send("hello main page");
});

app.get("/search", function(req,res){
    res.render("search");
});

app.get("/result", function(req,res){
    var ResultItem = req.query.searchterm;
    var website = "http://www.omdbapi.com/?s=" + ResultItem + "&apikey=thewdb";
    request(website, function(error, response, body){
        if (!error & response.statusCode == 200){
            var datas = JSON.parse(body);
            console.log(datas); 
            // res.send(data);
            res.render("results", {data: datas});
        }
    });
});

app.listen(3000, function(){
    console.log("Program started");
});
