var express = require("express");
var router = express.Router();
var passport = require("passport");
var middleware = require("../middleware");
var User = require("../models/user");

// Home route
router.get("/", function(req, res){
  res.render("pets/home");
});

// Auth routes

// show register form
router.get("/register", function(req, res){
  res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to Purfect Pets " + user.username + "!");
      res.redirect("/");
    });
  });
});

// show login form
router.get("/login", function(req, res){
  res.render("login");
});

// handling login logic
router.post("/login", passport.authenticate("local",
 {
   // successRedirect: "/",
   failureRedirect: "/login"
 }), function(req, res){
     req.flash("success", "Welcome back " + req.user.username + "!");
     res.redirect("/");
});

// logout route
router.get("/logout", middleware.isLoggedIn, function(req, res){
  req.logout();
  req.flash("success", "You logged out!");
  res.redirect("/");
});


module.exports = router;
