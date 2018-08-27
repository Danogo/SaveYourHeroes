const Hero    = require('../models/hero'),
      Comment       = require('../models/comment'),
      middlewareObj = {};

//=== Middlewares ===

//middleware checking if user is logged in, AUTHENTICATION
middlewareObj.isLoggedIn = (req, res, next) => {
  //check if request is authenticated using passport method
  if (req.isAuthenticated()) {
    return next();
  } else {
    //if not - display prepared flash message
    //and redirect to login
    req.flash('error', 'You need to be logged in to do that.');
    res.redirect('/login');
  }
};

//middleware checking if user is logged in and owns particular hero, AUTHORIZATION
middlewareObj.checkHeroOwnership = (req, res, next) => {
  //if user is logged in
  if (req.isAuthenticated()) {
    //find hero to compare author.id with logged user's _id
    Hero.findById(req.params.id, (err, foundHero) => {
      //handling error if id is invalid(has different length) or if is valid but returns null/undefined(rare case, url tinkering)
      //to prevent application crush
      if (err || !foundHero) {
        console.log(err);
        //display error to user
        req.flash('error', 'Hero not found');
        //redirect to where user came from
        res.redirect('back');
      } else {
        //check if logged in user owns showed hero
        //equality comparison(=== or ==) doesn't work because author.id is mongoose object and user._id is a string
        //therefore equals() method is used
        if (foundHero.author.id.equals(req.user._id)) {
            //if ids are equal move on to next callback function
            next();
        } else {
          //display message if user doesn't own hero (in case of outside browser requests)
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
