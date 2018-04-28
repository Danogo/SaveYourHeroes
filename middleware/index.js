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
    req.flash('error', 'You need to be logged in to do that.');
    res.redirect('/login');
  }
};

//middleware checking if user is logged in and owns particular campground, AUTHORIZATION
middlewareObj.checkCampOwnership = (req, res, next) => {
  //if user is logged in
  if (req.isAuthenticated()) {
    //find camp to compare author.id with logged user's _id
    Camp.findById(req.params.id, (err, foundCamp) => {
      //handling error if id is invalid(has different length) or if is valid but returns null/undefined(rare case, url tinkering)
      //to prevent application crush
      if (err || !foundCamp) {
        console.log(err);
        //display error to user
        req.flash('error', 'Campground not found');
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
          //display message if user doesn't own campground (in case of outside browser requests)
          req.flash('error', 'You don\'t have permission to do that');
          //redirect to where user came from
          res.redirect('back');
        }
      }
    });
  } else {
    //display message if user is not logged in
    req.flash('error', 'You need to be logged in to do that');
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
      //handling error if id is invalid(has different length) or if is valid but returns null/undefined (rare case, url tinkering)
      //to prevent application crush
      if (err || !foundComment) {
        console.log(err);
        //display error message to user
        req.flash('error', 'Comment not found');
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
          //display message if user doesn't own comment (in case of outside browser requests)
          req.flash('error', 'You don\'t have permission to do that');
          //redirect to where user came from
          res.redirect('back');
        }
      }
    });
  } else {
    //display message if user is not logged in
    req.flash('error', 'You need to be logged in to do that');
    //if user is not logged in redirect to where user came from
    res.redirect('back');
  }
};

module.exports = middlewareObj;
