var express = require("express");
var router = express.Router();
var Pets = require("../models/pets");
var multer = require("multer");
var middleware = require("../middleware");
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})



// Index route - show all pics
router.get("/", function(req, res){
  Pets.find({}, function(err, findPic){
    if(err){
      console.log(err);
    } else {
      res.render("pets/index", {findPic: findPic});
    }
  });
});

// New route
router.get("/post", function(req, res){
  res.render("pets/post");
});


router.post("/", isLoggedIn, function(req, res){
  // get data from form and add to array
  var name = req.body.name;
  var image = req.body.image;
  var newPic = {name: name, image: image};
  // Create a new pic and save to db
  Pets.create(newPic, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      // redirect back to pets index page
      res.redirect("/pets");
    }
  });
});



// Show route
router.get("/:id", function(req, res){
  // find pic with provided // ID
  Pets.findById(req.params.id).populate("comments").exec (function(err, foundPic){
    if(err){
      console.log(err);
    } else {
      // render show template with that pic
      res.render("pets/show", {foundPic: foundPic});
    }
  });
});


// Edit route
router.get("/:id/edit", isLoggedIn, function(req, res){
  Pets.findById(req.params.id, function(err, foundPic){
    if(!foundPic){
      return res.status(400).send("Item not found.")
    }
    res.render("pets/edit", {foundPic: foundPic});
  });
});

// Update route
router.put("/:id", isLoggedIn, function(req, res){
  Pets.findByIdAndUpdate(req.params.id, req.body.pets, function(err, updatedPic){
    if(err){
      res.redirect("/pets");
    } else {
      res.redirect("/pets");
    }
  });
});


// Delete route
router.delete("/:id", isLoggedIn, function(req, res){
  // destroy pic
  Pets.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/pets");
    } else {
      res.redirect("/pets");
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please login first!");
  res.redirect("/login");
}



module.exports = router;
