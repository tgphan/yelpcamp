const express = require('express'),
            router = express.Router(),
            Campground = require('../models/campground'),
            Comment = require('../models/comment'),
            User = require('../models/user'),
            middleware = require('../middleware');

// shows user page
router.get('/:username', (req, res) =>{
    console.log(req.params);
    User.findOne({'username': req.params.username}, (err, user) => {
        console.log(user);
        if(err || !user){
            req.flash('error', "Sorry, that user doesn't exist!");
            res.redirect('back');
        } else if (user) {
            res.render('users/show', {user: user} );
        }
    });
});

module.exports = router;