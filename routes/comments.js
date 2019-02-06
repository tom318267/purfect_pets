var express = require("express");
var router = express.Router({mergeParams: true});
var Pets = require("../models/pets");
var Comment = require("../models/comment");
var User = require("../models/user");
var middleware = require("../middleware");

// Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
  Pets.findById(req.params.id, function(err, foundPic){
    if(err){
      console.log(err);
      res.redirect("/");
    } else {
      res.render("comments/new", {foundPic: foundPic});
    }
  });
});

// Comments create route
router.post("/", middleware.isLoggedIn, function(req, res){
  Pets.findById(req.params.id, function(err, postComment){
    if(err){
      console.log(err);
      res.redirect("/");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          // add username and id to comments
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          postComment.comments.push(comment);
          postComment.save();
          req.flash("success", "Successfully created comment!");
          res.redirect("/pets/" + postComment._id);
        }
      });
    }
  });
});

// Comments edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit", {foundPic_id: req.params.id, comment: foundComment});
    }
  });
});

// Comments update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/pets/" + req.params.id);
    }
  });
});

// Comments destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/pets/" + req.params.id);
    }
  });
});








module.exports = router;
