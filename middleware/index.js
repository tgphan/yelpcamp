var middlewareObj = {};

middlewareObj.isCommentCreator = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err || !campground) {
                req.flash('error', "Sorry, we couldn't find the campground.");
                res.redirect('/campgrounds');
            } else {
                Comment.findById(req.params.comment_id, (err, comment) => {
                    if (err || !comment) {
                        req.flash('error', "Sorry, we couldn't find the comment.");
                        res.redirect(`/campgrounds/${req.params.id}`);
                    } else if (comment.author.id.equals(req.user._id) || req.user.isAdmin) {
                        return next();
                    } else {
                        req.flash('error', "Sorry, you don't have permission to do that.");
                        res.redirect('/login');
                    }
                });
            }
        });
    } else {
        req.flash('error', 'You need to be signed in to do that!');
        res.redirect('/login');
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that!');
    res.redirect('/login');
}

middlewareObj.isUser = (req, res, next) => {
    if (req.user && req.user.username === req.params.username) {
        return next();
    }
    req.flash("You don't have permission to do that!")
    res.redirect(req.session.returnTo || '/campgrounds');
    delete req.session.returnTo;
}

middlewareObj.isCampgroundCreator = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (error, campground) => {
            if (error || !campground) {
                req.flash('error', "Campground not found!");
                res.redirect('back');
            } else if (campground.author.id.equals(req.user._id) || req.user.isAdmin) {
                return next();
            } else {
                res.redirect('/login');
            }
        });
    } else {
        req.flash('error', "You need to be logged in to do that!");
        res.redirect('/login');
    }
}

module.exports = middlewareObj;