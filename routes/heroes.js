const express = require('express'),
      Hero    = require('../models/hero'),
      //automatically looking for index.js file in folder
      middleware = require('../middleware'),
      router  = express.Router();

// === Routes ===

//handling GET request for heroes route, INDEX - displaying all the heroes
router.get('/', (req, res) => {
  Hero.find({}, (err, allHeroes) => {
    if (err) {
      console.log(err);
    } else {
      let user = req.user;
      //render page displaying all the heroes
      res.render('heroes/index', {heroes:allHeroes, user: user});
    }
  })
});

//handling POST request for heroes route, CREATE - adding new hero to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
  //grab data from form
  let name = req.body.name;
  let url = req.body.url;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  //create object with received data
  let newHero = {name: name, imageURL: url, description: desc, author: author};
  //create new document(record) in model(table/collection) using newHero object
  Hero.create(newHero, (err, newHerop) => {
    if (err) {
      console.log(err);
    } else {
      console.log('New Hero created Sir!');
      //redirect to handler for get request to /heroes
      res.redirect('/heroes');
    }
  });
});

//handling GET request for heroes/new route, NEW - show form to create new hero
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('heroes/new');
});

//handling GET request for /heroes/:id, SHOW - display details about specific hero
router.get('/:id', (req, res) => {
  let heroId = req.params.id;
  Hero.findById(heroId).populate('comments').exec((err, foundHero) => {
    //handling error if id is invalid(has different length) or if is valid but returns null/undefined (rare case, url tinkering)
    //to prevent application crush
    if (err || !foundHero) {
      console.log(err);
      //display error message to user
      req.flash('error', 'Hero not found');
      res.redirect('back');
    } else {
      //render show template and pass value of found hero to it
      res.render('heroes/show', {hero: foundHero});
    }
  });
});

//handling GET request to /heroes/:id/edit, EDIT - edit details about particular hero
router.get('/:id/edit', middleware.checkHeroOwnership, (req, res) => {
  Hero.findById(req.params.id, (err, foundHero) => {
      res.render('heroes/edit', {hero: foundHero});
  });
});

//handling PUT request to /heroes/:id, UPDATE - update details about selected hero
router.put('/:id', middleware.checkHeroOwnership, (req, res) => {
  Hero.findByIdAndUpdate(req.params.id, req.body.hero, (err, updatedHero) => {
    if (err) {
      console.log(err);
      res.redirect('/heroes');
    } else {
      res.redirect(`/heroes/${req.params.id}`);
    }
  });
});

//handling DELETE request to /heroes/:id, DESTROY - remove particular hero from database
router.delete('/:id', middleware.checkHeroOwnership, (req, res) => {
  Hero.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      res.redirect('/heroes');
    } else {
      res.redirect('/heroes');
    }
  });
});



module.exports = router;
