const express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    User = require('../models/user'),
    middleware = require('../middleware');

// redirects to user page of current user or login page if username is specified
router.get('/', (req, res) => {
    if (req.user) {
        res.redirect(`/users/${req.user.username}`);
    } else {
        req.flash('success', 'Please sign in to see your account!');
        res.redirect('/login');
    }
});

// shows user page
router.get('/:username', (req, res) => {
    User.findOne({ 'username': req.params.username }, (err, user) => {
        if (err || !user) {
            req.flash('error', "Sorry, that user doesn't exist!");
            res.redirect(req.session.returnTo || '/campgrounds');
            delete req.session.returnTo;
        } else if (user) {
            req.session.returnTo = req.originalUrl;

            Campground.find().where('author.id').equals(user._id).exec((err, campgrounds) => {

                Comment.find().where('author.id').equals(user._id).exec((err, comments) => {
                    
                    res.render('users/show', {
                        user: user,
                        campgrounds: campgrounds,
                        comments: comments
                    });
                });
            });
        }
    });
});

module.exports = router;