var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    campground: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campground"
        }
});

module.exports = mongoose.model('Comment', commentSchema);