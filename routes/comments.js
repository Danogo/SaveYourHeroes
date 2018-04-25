const express = require('express'),
      Camp = require('../models/camp'),
      router = express.Router();

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

//NEW - display form for creating new comments
router.get('/new', isLoggedIn, (req, res) => {
    Camp.findById(req.params.id.toLowerCase(), (err, foundCamp) => {
      if (err) {
        console.log(err);
      } else {
        res.render('comments/new', {camp: foundCamp});
      }
    });
});

//CREATE - create new comment and redirect to show
router.post('/', isLoggedIn, (req, res) => {
  Camp.findById(req.params.id.toLowerCase(), (err, foundCamp) => {
    if (err) {
      console.log(err);
    } else {
      //create comment using data send from the form
      Comment.create(req.body.comment, (err, createdComment) => {
        if (err) {
          //if error occured log info to console
          console.log(err);
        } else {
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

module.exports = router;
