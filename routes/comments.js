const express = require('express'),
      Camp = require('../models/camp'),
      Comment = require('../models/comment'),
      //automatically looking for index.js file in folder
      middleware = require('../middleware'),
      router = express.Router({mergeParams: true});

// === Routes ===

//NEW - display form for creating new comments
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Camp.findById(req.params.id, (err, foundCamp) => {
      if (err || !foundCamp) {
        console.log(err);
        req.flash('error', 'Campground not found. You cannot add comment to non-existing campground');
        res.redirect('back');
      } else {
        res.render('comments/new', {camp: foundCamp});
      }
    });
});

//CREATE - create new comment and redirect to show
router.post('/', middleware.isLoggedIn, (req, res) => {
  Camp.findById(req.params.id, (err, foundCamp) => {
    if (err) {
      console.log(err);
    } else {
      //create comment using data send from the form
      Comment.create(req.body.comment, (err, createdComment) => {
        if (err) {
          //if error occured log info to console
          console.log(err);
        } else {
          //associate comment with user
          createdComment.author.id = req.user._id;
          createdComment.author.username = req.user.username;
          createdComment.save();
          //otherwise put comment into camp.comments array
          foundCamp.comments.push(createdComment);
          //and save that camp containing created comments
          foundCamp.save();
          console.log('Added coment to campground');
          //redirect to /camps/:id route to show
          //all details about that camp with new added comments
          //could also be /camps/${foundCamp._id}
          res.redirect(`/camps/${req.params.id}`);
        }
      });
    }
  })
});

//EDIT - show form to edit existing comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  //first check if campground exists (in case of url tinkering)
  Camp.findById(req.params.id, (err, foundCamp) => {
    if (err || !foundCamp) {
      console.log(err);
      req.flash('error', 'Campground not found. You cannot edit comment about non-existing campground');
      return res.redirect('back');
    }
    //find comment based on params in query string
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        //if camp wasn't found
        console.log(err);
        //take user back to show page
        res.redirect('back');
      } else {
        //otherwise display form to edit particular comment
        res.render('comments/edit', {campId: req.params.id, comment: foundComment});
      }
    });
  });
});

//UPDATE - update particular comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.redirect(`/camps/${req.params.id}`);
    }
  });
});

//DELETE - remove particular comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.redirect(`/camps/${req.params.id}`);
    }
  });
});
module.exports = router;
