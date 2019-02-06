var Pets = require("../models/pets");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkPetOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Pets.findById(req.params.id, function(err, foundPic){
      if(err){
        req.flash("error", "User not found")
        res.redirect("back");
      } else {
        if(!foundPic){
          req.flash("error", "Not found")
          return res.redirect("back");
        }
        // is this user the client?
        if(foundPic.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You don't have permission to do that!");
    res.redirect("back");
  }
}


middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    req.flash("error", "User not found");
                    res.redirect("back");
                } else {
                    // is this user the client?
                    if(foundComment.author.id.equals(req.user._id)){
                       next();
                    } else {
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("back");
                    }

                }
            });
        } else {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
}




middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please login first!");
  res.redirect("/login");
}


module.exports = middlewareObj;
