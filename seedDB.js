const mongoose = require("mongoose");
const Hero     = require("./models/hero");
const Comment  = require("./models/comment");

const data = [
    {
        name: "My super friendly dog",
        imageURL: "https://images.unsplash.com/photo-1532202802379-df93d543bac3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=83d6daa0c0584b4ddf642f08db3f61cb&auto=format&fit=crop&w=2134&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Spiderman",
        imageURL: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fb2712e6af187020db480d5f8af7a843&auto=format&fit=crop&w=634&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Deadpool",
        imageURL: "https://images.unsplash.com/photo-1501432377862-3d0432b87a14?ixlib=rb-0.3.5&s=0333326b3ea1edab8e5bea9d701ce4e0&auto=format&fit=crop&w=634&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Fighter",
        imageURL: "https://images.unsplash.com/photo-1496979551903-46e46589a88b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cda12b505afa1beb06e49d89014cbd65&auto=format&fit=crop&w=634&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Batman",
        imageURL: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8f3a60bf9e8a9655e744221bcbb6574b&auto=format&fit=crop&w=634&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

const seedDB = () => {
   //Remove all heroes
   Hero.remove({}, err => {
        if(err){
            console.log(err);
        }
        console.log("removed heroes!");
        Comment.remove({}, err => {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few heroes
            data.forEach( seed => {
                Hero.create(seed, (err, createdHero) => {
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a hero");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, (err, comment) => {
                                if(err){
                                    console.log(err);
                                } else {
                                    //add a few comments
                                    createdHero.comments.push(comment);
                                    createdHero.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    });

}

module.exports = seedDB;
