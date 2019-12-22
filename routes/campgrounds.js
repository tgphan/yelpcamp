const express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    Notification = require('../models/notifications'),
    expressSanitizer = require('express-sanitizer'),
    middleware = require('../middleware'),
    NodeGeocoder = require('node-geocoder'),
    options = {
        provider: 'google',
        httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null
    },
    geocoder = NodeGeocoder(options);

//router.use(methodOverride('_method'));
router.use(expressSanitizer());

//INDEX - page to display all campgrounds
router.get('/', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/campgrounds', { campgrounds: allCampgrounds, currentUser: req.user });
        }
    });
});

//NEW - displays the form to create a new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});
//CREATE - adds a created campground to the database and redirects to show all campgrounds
router.post('/', middleware.isLoggedIn, (req, res) => {
    var name = req.body.name,
        price = req.body.price,
        image = req.body.image,
        description = req.body.description;

    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log(err);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude,
            lng = data[0].longitude,
            location = data[0].formattedAddress;

            User.findById(req.user._id).populate('followers').exec((err, user) => {
                Campground.create(
                    {
                        name: name,
                        price: price,
                        image: image,
                        description: description,
                        lat: lat,
                        lng: lng,
                        location: location,
                        author: user
                    }, (err, campground) => {
                        if (err) {
                            console.log(err);
                            res.redirect('/campgrounds');
                        } else {
                            user.campgrounds.push(campground);
                            user.save();
                            Notification.create({
                                username: user.username,
                                campground: campground._id,
                            }, (err, notification) => {
                                if (err) {
                                    console.log(err);
                                }
                                for (const follower of user.followers) {
                                    follower.notifications.push(notification);
                                    follower.save();
                                }
                            });

                            res.redirect('/campgrounds');
        
                        }
                    });
                
            });

    });
});


//SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('author')
    .populate('comments').exec((err, campground) => {
        if (err || !campground) {
            console.log(err);
            req.flash('error', 'Campground not found');
            res.redirect(`/campgrounds`);
        } else {
            res.render('campgrounds/show', { campground: campground });
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.isCampgroundCreator, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
            req.flash('error', "Campground not found");
            res.redirect('/:id');
            console.log(err);
        } else {
            res.render('campgrounds/edit', { campground: campground });
        }
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.isCampgroundCreator, function (req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;

        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, campground) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success", "Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});

// DESTROY
router.delete('/:id', middleware.isCampgroundCreator, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err, campground) => {
        if (err || !campground) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;