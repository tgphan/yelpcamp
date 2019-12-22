const mongoose = require('mongoose'),
            passportLocalMongoose = require('passport-local-mongoose');

var NotificationsSchema = new mongoose.Schema({
    username: String,
    campground: String,
    isRead: {type: Boolean, default: false}
});

NotificationsSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Notification", NotificationsSchema);