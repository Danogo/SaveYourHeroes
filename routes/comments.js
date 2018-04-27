const express = require('express'),
      Camp = require('../models/camp'),
      Comment = require('../models/comment'),
      router = express.Router({mergeParams: true});

//=== Middlewares ===
//middleware checking if user is logged in
const isLoggedIn = (req, res, next) => {
  //check if request is authenticated using passport method
  if (req.isAuthenticated()) {
    return next();
  } else {
  //if not redirect to login
    res.redirect('/login');
  }
};

//middleware checking if user is logged in and if created particular comment, AUTHORIZATION
const checkCommentOwnership = (req, res, next) => {
  //if user is logged in
  if (req.isAuthenticated()) {
    //find comment to compare author.id with logged user's _id
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        console.log(err);
        //redirect to where user came from
        res.redirect('back');
      } else {
        //check if logged in user created particular comment
        //equality comparison(=== or ==) doesn't work because author.id is mongoose object and user._id is a string
        //therefore equals() method is used
        if (foundComment.author.id.equals(req.user._id)) {
            //if ids are equal move on to next callback function
            next();
        } else {
          //redirect to where user came from
          res.redirect('back');
        }
      }
    });
  } else {
    //if user is not logged in redirect to where user came from
    res.redirect('back');
  }
};

// === Routes ===

//NEW - display form for creating new comments
router.get('/new', isLoggedIn, (req, res) => {
    Camp.findById(req.params.id, (err, foundCamp) => {
      if (err) {
        console.log(err);
      } else {
        res.render('comments/new', {camp: foundCamp});
      }
    });
});

//CREATE - create new comment and redirect to show
router.post('/', isLoggedIn, (req, res) => {
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
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
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

//UPDATE - update particular comment
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
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
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
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
