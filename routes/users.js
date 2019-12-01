const express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    User = require('../models/user'),
    middleware = require('../middleware');

// shows user page
router.get('/:username', (req, res) => {
    User.findOne({ 'username': req.params.username }, (err, user) => {
        if (err || !user) {
            req.flash('error', "Sorry, that user doesn't exist!");
            res.redirect(req.session.returnTo || '/campgrounds');
            delete req.session.returnTo;
        } else if (user) {
            req.session.returnTo = req.originalUrl;
            res.render('users/show', { user: user });
        }
    });
});

module.exports = router;