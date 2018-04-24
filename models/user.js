const mongoose              = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

//add some methods and functionalities for authentication to User model
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
