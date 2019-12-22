var mongoose = require('mongoose');

//SCHEMA - schema for mongodb'campground' entries
var campgroundSchema = new mongoose.Schema({
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});
//MODEL - makes new model for mongoose so we can manipulate
module.exports = mongoose.model('Campground', campgroundSchema);