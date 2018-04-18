//========= Loading modules and setting them up=========
const express = require('express'),
      app = express(),
      mongoose = require('mongoose');

//set template engine to ejs
app.set('view engine', 'ejs');
//send data through url query string, true allows for complex data
app.use(express.urlencoded({extended: true}));
//set public folder for external static assets
app.use(express.static('public'))

//connect mongoose to mongodb,connect directly to yelp_camp db(or create first and then bind if didn't find one)
mongoose.connect('mongodb://localhost/yelp_camp');
//Set mongoose Schemas(templates for models)
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});
//create model
const Camp = mongoose.model('Camp', campgroundSchema);
//create document in model
Camp.create({name: 'Obozowisko bandytów'}, (err, newCamp) => {
  if (err) {
    console.log(err);
  } else {
    console.log(newCamp);
    console.log('New Camp created Sir!');
  }
});

//========== Routes ============
//global variables for routes
const camps = [
  {
    name: 'mountain',
    time: 25,
    url: 'https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d1c8cc988efddbda8746281871c0c8bf&auto=format&fit=crop&w=500&q=60'
  },
  {
    name: 'cloudy',
    time: 15,
    url: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c85daa025ee04c951b6ac12fe3ba031a&auto=format&fit=crop&w=1350&q=80'
  },
  {
    name: 'forest',
    time: 10,
    url: 'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b7ca353cfcc4299e6c3d431ff862e1cf&auto=format&fit=crop&w=500&q=60'
  }
];

//path to landing page
app.get('/', (req, res) => {
  res.render('landingPage');
});

//path to camps
//GET request for camps route
app.get('/camps', (req, res) => {
  res.render('campsPage', {camps:camps});
});
//POST request for camps route
app.post('/camps', (req, res) => {
  let name = req.body.name;
  let url = req.body.url;
  let newCamp = {name: name, url: url};
  camps.push(newCamp);
  res.redirect('/camps');
});
//GET request for camps/new route
app.get('/camps/new', (req, res) => {
  res.render('newCampPage');
});

// starting the server
app.listen(3000, () => console.log('Server is listening on port 3000..'));
