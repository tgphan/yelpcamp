const express = require('express'),
            router = express.Router(),
            passport = require('passport'),
            User = require('../models/user');

// landing page
router.get('/', (req, res) => {
    res.render('landing');
});

//  show register
router.get('/register', (req, res) => {
    res.render('register');
});

// handle sign up logic
router.post('/register', (req, res) =>{
    var newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        avatar: req.body.avatar 
    };
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err.message);
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, ()=>{
            req.flash('success', `Welcome to YelpCamp ${user.username}`);
            res.redirect('/campgrounds');
        });
    });
});

//show login form
router.get('/login', (req, res)=>{
    res.render('login');
});

// login logic
router.post('/login', passport.authenticate('local', { 
    successReturnToOrRedirect: '/campgrounds', 
    failureRedirect: '/login',
    failureFlash: true 
    }),(req, res)=> {
});

//logout route
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/campgrounds');
});

module.exports = router;