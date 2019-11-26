var mongoose = require('mongoose');

//SCHEMA - schema for mongodb'campground' entries
var campgroundSchema = new mongoose.Schema(
    {
    name: String,
    price: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: {
        type: Date, 
        default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
    }
);
//MODEL - makes new model for mongoose so we can manipulate
module.exports = mongoose.model('Campground', campgroundSchema);