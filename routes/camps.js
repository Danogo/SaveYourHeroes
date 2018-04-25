const express = require('express'),
      Camp    = require('../models/camp'),
      router  = express.Router();

//handling GET request for camps route, INDEX - displaying all the campgrounds
router.get('/', (req, res) => {
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
router.post('/', (req, res) => {
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
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

//handling GET request for /camps/:id, SHOW - display details about specific campground
router.get('/:id', (req, res) => {
  let campId = req.params.id.toLowerCase();
  Camp.findById(campId).populate('comments').exec((err, foundCamp) => {
    if (err) {
      console.log(err);
    } else {
      //render show template and pass value of found camp to it
      res.render('campgrounds/show', {camp: foundCamp});
    }
  });
});

module.exports = router;
