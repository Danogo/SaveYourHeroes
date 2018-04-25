// ================================================
// Loading modules (and models) and setting them up
// ================================================
const express       = require('express'),
      app           = express(),
      session       = require('express-session'),
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      Camp          = require('./models/camp'),
      Comment       = require('./models/comment'),
      User          = require('./models/user'),
      seedDB        = require('./seedDB');

// === Importing routes ===
const campsRoutes    = require('./routes/camps'),
      commentsRoutes = require('./routes/comments'),
      indexRoutes    = require('./routes/index');

// === Setup ===
//set template engine to ejs
app.set('view engine', 'ejs');
//add middleware which parses x-ww-form-urlencoded
//request bodies so we can grab data posted through the form
// using req.body.somedata, true allows for complex data
app.use(express.urlencoded({extended: true}));
//add middleware which sets public folder for external static assets
app.use(express.static(__dirname + '/public'));
//connect mongoose to mongodb,connect directly to yelp_camp db(or create first and then bind if didn't find one)
mongoose.connect('mongodb://localhost/yelp_camp');
seedDB();

//=== Config for AUTH ===
//use express-session
app.use(session({
  secret: 'Black Mirror is better than Westworld',
  resave: false,
  saveUninitialized: false
}));
//set initialization and handling persistent login sessions using passport methods as middlewares
app.use(passport.initialize());
app.use(passport.session());
//set strategy for authentication using passport-local-mongoose method
passport.use(new LocalStrategy(User.authenticate()));
//coding and encoding sessions using passport-local-mongoose methods
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
//use middleware which allows to access data about
//user in every template, so we don't need to pass it everywhere
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//==========
//  ROUTES
//==========
app.use('/camps', campsRoutes);
app.use('/', indexRoutes);
app.use('/camps/:id/comments', commentsRoutes);

//=== Starting the server ===
app.listen(3000, () => console.log('Server is listening on port 3000..'));
