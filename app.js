var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var Comment = require("./models/comment");
var methodOverride = require("method-override");

// requiring routes
var petRoutes = require("./routes/pets");
var indexRoutes = require("./routes/index");
var commentRoutes = require("./routes/comments");

mongoose.set("useFindAndModify", false);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Configuration
app.use(require("express-session")({
  secret: "Purfect Pets!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var url = process.env.DATABASEURL || "mongodb://localhost/purfect_pets";
mongoose.connect(url, {useNewUrlParser: true});

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/pets", petRoutes);
app.use("/pets/:id/comments", commentRoutes);




app.listen(process.env.PORT || 3000, function(){
  console.log("server running");
});
