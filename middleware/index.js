const Camp    = require('../models/camp'),
      Comment       = require('../models/comment'),
      middlewareObj = {};

//=== Middlewares ===

//middleware checking if user is logged in, AUTHENTICATION
middlewareObj.isLoggedIn = (req, res, next) => {
  //check if request is authenticated using passport method
  if (req.isAuthenticated()) {
    return next();
  } else {
    //if not - display prepare flash message
    //and redirect to login
    req.flash('errorMsg', 'You have to login to do that.');
    res.redirect('/login');
  }
};

//middleware checking if user is logged in and owns particular campground, AUTHORIZATION
middlewareObj.checkCampOwnership = (req, res, next) => {
  //if user is logged in
  if (req.isAuthenticated()) {
    //find camp to compare author.id with logged user's _id
    Camp.findById(req.params.id, (err, foundCamp) => {
      if (err) {
        console.log(err);
        //redirect to where user came from
        res.redirect('back');
      } else {
        //check if logged in user owns showed campground
        //equality comparison(=== or ==) doesn't work because author.id is mongoose object and user._id is a string
        //therefore equals() method is used
        if (foundCamp.author.id.equals(req.user._id)) {
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

//middleware checking if user is logged in and if created particular comment, AUTHORIZATION
middlewareObj.checkCommentOwnership = (req, res, next) => {
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

module.exports = middlewareObj;
