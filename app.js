//=================================================
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

//config for AUTH
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

//==========
//  ROUTES
//==========
//handling GET request to root path
app.get('/', (req, res) => {
  //render landing page
  res.render('landingPage');
});
//handling GET request for camps route, INDEX - displaying all the campgrounds
app.get('/camps', (req, res) => {
  Camp.find({}, (err, allCamps) => {
    if (err) {
      console.log(err);
    } else {
      //render page displaying all the campgrounds
      res.render('campgrounds/index', {camps:allCamps});
    }
  })
});
//handling POST request for camps route, CREATE - adding new campground ot DB
app.post('/camps', (req, res) => {
  //grab data from form
  let name = req.body.name;
  let url = req.body.url;
  let desc = req.body.description;
  //create object with received data
  let newCamp = {name: name, imageURL: url, description: desc};
  //create new document(record) in model(table/collection) using newCamp object
  Camp.create(newCamp, (err, newCamp) => {
    if (err) {
      console.log(err);
    } else {
      console.log('New Camp created Sir!');
      //redirect to handler for get request to /camps
      res.redirect('/camps');
    }
  });
});
//handling GET request for camps/new route, NEW - show form to create new campground
app.get('/camps/new', (req, res) => {
  res.render('campgrounds/new');
});
//handling GET request for /camps/:id, SHOW - display details about specific campground
app.get('/camps/:id', (req, res) => {
  let campId = req.params.id.toLowerCase();
  Camp.findById(campId).populate('comments').exec((err, foundCamp) => {
    if (err) {
      console.log(err);
    } else {
      console.log(foundCamp);
      //render show template and pass value of found camp to it
      res.render('campgrounds/show', {camp: foundCamp});
    }
  });
});

//======= Comments routes ===========
//NEW - display form for creating new comments
app.get('/camps/:id/comments/new', (req, res) => {
    Camp.findById(req.params.id.toLowerCase(), (err, foundCamp) => {
      if (err) {
        console.log(err);
      } else {
        res.render('comments/new', {camp: foundCamp});
      }
    });
});
//CREATE - create new comment and redirect to show
app.post('/camps/:id/comments', (req, res) => {
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

//======= Authentication routes ===========
//handling GET request for /register route - NEW - show form to create new user
app.get('/register', (req, res) => {
  res.render('register');
});
//handling POST request for register route - CREATE - create new user and redirect to camps
app.post('/register', (req, res) => {
  //create user account using register method from passport-local-mongoose -
  // - added through plugin in user model
  //password is hashed/salted in db
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    } //auth of a user, try to login (authenticate also invokes req.login under the hood)
      passport.authenticate('local')(req, res, () => res.redirect("/camps"));
  })
});


// starting the server
app.listen(3000, () => console.log('Server is listening on port 3000..'));
