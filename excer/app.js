var express = require("express");
var app = express();



app.get("/", function(req, res){
	res.send("Hi there! Here is the main page");
});

app.get("/dog", function(req,res){
	res.send("Here is the dog database!");
});

app.get("/:subpage", function(req,res){
	var subpagename = (req.params.subpage);
	res.send("The subpage name is + " + subpagename);
});

app.get("*", function(req,res){
	res.send("error:404");
});

app.listen(3000, function(){
	console.log("Server has started!!");
});
