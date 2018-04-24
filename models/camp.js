const mongoose = require('mongoose');
//Set mongoose Schemas(templates for models)
const campgroundSchema = new mongoose.Schema({
  name: String,
  imageURL: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});
//create model(object with support for MongoDB functions) end export it
module.exports = mongoose.model('Camp', campgroundSchema);
