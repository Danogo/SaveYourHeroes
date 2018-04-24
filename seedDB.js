const mongoose = require("mongoose");
const Camp     = require("./models/camp");
const Comment  = require("./models/comment");

const data = [
    {
        name: "Cloud's Rest",
        imageURL: "https://images.unsplash.com/photo-1522205419828-f5b336fc3931?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7b10bf52b7ea50de3250fe021944e57d&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Magic Forest",
        imageURL: "https://images.unsplash.com/photo-1524261399568-56d8c862aaf8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=eb319f95e1b6e9454e00526cbb0daaa4&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Paradise Hills",
        imageURL: "https://images.unsplash.com/photo-1523612192437-66de9804ac3c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=59310f54610ead00fcc3d07732d5d473&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Sunset above the Sea",
        imageURL: "https://images.unsplash.com/photo-1524410411359-24e9a0aa7076?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=00ae8ec957379832eb16396ddcb43c36&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Cloud's Rest",
        imageURL: "https://images.unsplash.com/photo-1474139242267-eef6daa88e13?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1784214629de074de845bf3726857d67&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

const seedDB = () => {
   //Remove all campgrounds
   Camp.remove({}, err => {
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, err => {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach( seed => {
                Camp.create(seed, (err, createdCamp) => {
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
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
                                    createdCamp.comments.push(comment);
                                    createdCamp.save();
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
