const express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    User = require('../models/user'),
    Notification = require('../models/notifications'),
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
    User.findOne({ 'username': req.params.username }).
        populate('campgrounds').
        populate({
            path: 'comments',
            populate: { path: 'campground' }
        }).
        exec((err, user) => {
            if (err || !user) {
                req.flash('error', "Sorry, that user doesn't exist!");
                res.redirect(req.session.returnTo || '/campgrounds');
                delete req.session.returnTo;
            } else if (user) {
                req.session.returnTo = req.originalUrl;

                //make a new array with a comment array inside campground objects
                var campgroundArray = [];
                for (const comment of user.comments) {
                    campgroundArray.push({
                        id: comment.campground._id,
                        image: comment.campground.image,
                        name: comment.campground.name,
                        comments: []
                    });
                }

                //filter the campgroundArray to remove duplicate campgrounds
                campgroundArray = campgroundArray.filter((campground, index, self) =>
                    index === self.findIndex((t) => (
                        t.id.equals(campground.id)
                    ))
                )

                //iterate through user.comments and compare campgrounds with campgroundArray
                for (const campground of campgroundArray) {
                    for (const comment of user.comments) {
                        //push comments from matching campgrounds in user.comments into campgroundArray
                        if (comment.campground._id.equals(campground.id)) {
                            campground.comments.push({
                                text: comment.text,
                                createdAt: comment.createdAt
                            });
                        }
                    }
                }
                res.render('users/show', { user: user, sortedComments: campgroundArray });
            }
        });
});

// shows user edit page
router.get('/:username/edit', middleware.isUser, (req, res) => {
    User.findOne({ 'username': req.params.username }, (err, user) => {
        if (err) {
            req.flash('error', "Sorry, that user doesn't exist");
            res.redirect(req.session.returnTo || '/campgrounds');
            delete req.session.returnTo;
        }
        req.session.returnTo = req.originalUrl;
        res.render('users/edit', { user: user });
    });
});

// user update route
router.put('/:username', middleware.checkPassword, (req, res) => {
    updatedUser = req.body.user;
    User.findOneAndUpdate({ 'username': req.params.username },
        updatedUser, (err, user) => {
            if (err) {
                req.flash('error', "Sorry, we couldn't update your info!");
                res.redirect(req.session.returnTo || '/campgrounds');
                delete req.session.returnTo;
            }
            req.flash('success', "Your information was successfully updated!");
            res.redirect(req.session.returnTo || `/users/${req.params.username}`);
            delete req.session.returnTo;
        });
});

// follow a user
router.get('/follow/:username', middleware.isLoggedIn, async function (req, res) {
    try {
        let user = await User.findOneAndUpdate(
        { 'username': req.params.username },
        { 'followers' : req.user._id },
        { strict: false });
        // user.folowers.push(req.user._id);
        // user.save();
        req.flash('success header', `Success!`);
        req.flash('success', `You are now following ${ req.params.username }!`);
        res.redirect(req.session.returnTo || `/users/${ req.params.username }`);
        delete req.session.returnTo;
    } catch (err) {
        console.log(err);
        console .log('didn\'t work!');
        req.flash('error header',
            `Oops! We were unable to process your request to follow ${ req.params.username }.`);
        req.flash('error', err.message);
        res.redirect(req.session.returnTo || `/users/${ req.params.username }`);
        delete req.session.returnTo;
    }
});

// view all notifications
router.get('/notifications', middleware.isLoggedIn, async function (req, res) {
    try {
        let user = await User.findOne({ 'username': req.user.username })
            .populate({
                path: 'notifications',
                options: { sort: { '_id': -1 } }
            }).exec();
        let notifications = user.notifications;
        req.session.returnTo = req.originalUrl;
        res.render('notifications', { notifications });
    } catch (err) {
        console.log(err);
        req.flash('error header', `Sorry!`);
        req.flash('error', `We were unable to load your notifications.`);
        res.redirect(req.session.returnTo || `/users/${user.username}`);
        delete req.session.returnTo;
    }
});

// show notification source when clicked
router.get('/notifications/:id', middleware.isLoggedIn, async function (req, res) {
    try {
        let notification = await Notification.findByIdAndUpdate(req.params.id,
            { 'isRead' : true }
        );
        // notification.isRead = true;
        // notification.save();
        res.redirect(`/campgrounds/${notification.campground}`);
        delete req.session.returnTo;
    } catch (err) {
        console.log(err);
        req.flash('error header', `Sorry!`);
        req.flash('error', `We were unable to load your notifications.`);
        res.redirect(req.session.returnTo || `back`);
        delete req.session.returnTo;
    }
});

router.post('/notifications/allread', middleware.isLoggedIn, async function(req, res) {
    try {
        let user = User.findOneAndUpdate({ 'username' : req.user.username })
            .populate( 'notifications' )
            .excec();

            let notifications = user.notifications;

            for (const notification of notifications) {
                notification.isRead = true;
            }

    } catch (err) {

    }
});

module.exports = router;