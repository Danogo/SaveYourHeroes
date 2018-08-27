const express = require('express'),
      Hero = require('../models/hero'),
      Comment = require('../models/comment'),
      //automatically looking for index.js file in folder
      middleware = require('../middleware'),
      router = express.Router({mergeParams: true});

// === Routes ===

//NEW - display form for creating new comments
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Hero.findById(req.params.id, (err, foundHero) => {
      if (err || !foundHero) {
        console.log(err);
        req.flash('error', 'Hero not found. You cannot add comment to non-existing hero');
        res.redirect('back');
      } else {
        res.render('comments/new', {hero: foundHero});
      }
    });
});

//CREATE - create new comment and redirect to show
router.post('/', middleware.isLoggedIn, (req, res) => {
  Hero.findById(req.params.id, (err, foundHero) => {
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
          //otherwise put comment into hero.comments array
          foundHero.comments.push(createdComment);
          //and save that hero containing created comments
          foundHero.save();
          console.log('Added coment to hero');
          //redirect to /heroes/:id route to show
          //all details about that hero with new added comments
          //could also be /heroes/${foundHero._id}
          res.redirect(`/heroes/${req.params.id}`);
        }
      });
    }
  })
});

//EDIT - show form to edit existing comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  //first check if hero exists (in case of url tinkering)
  Hero.findById(req.params.id, (err, foundHero) => {
    if (err || !foundHero) {
      console.log(err);
      req.flash('error', 'Hero not found. You cannot edit comment about non-existing hero');
      return res.redirect('back');
    }
    //find comment based on params in query string
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        //if hero wasn't found
        console.log(err);
        //take user back to show page
        res.redirect('back');
      } else {
        //otherwise display form to edit particular comment
        res.render('comments/edit', {heroId: req.params.id, comment: foundComment});
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
      res.redirect(`/heroes/${req.params.id}`);
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
      res.redirect(`/heroes/${req.params.id}`);
    }
  });
});
module.exports = router;
