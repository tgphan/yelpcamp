require('dotenv').config();
const express = require('express'),
            app = express(),
            bodyParser = require('body-parser'),
            expressSanitizer = require('express-sanitizer'),
            mongoose = require('mongoose'),
            flash = require('connect-flash'),
            passport = require('passport'),
            LocalStrategy = require('passport-local').Strategy,
            Campground = require("./models/campground"),
            Comment = require('./models/comment'),
            User = require('./models/user'),
            Notification = require('./models/notifications'),
            seedDB = require('./seeds'),
            methodOverride = require('method-override'),
            moment = require('moment');

const commentRoutes = require('./routes/comments'),
            campgroundRoutes = require('./routes/campgrounds'),
            indexRoutes = require('./routes/index'),
            userRoutes = require('./routes/users');


app.locals.moment  = require('moment');
app.use(require('express-session')({
    secret: '108108108',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((User.serializeUser()));
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

//BUILD CONNECTION - between mongoose and mongodb
mongoose.connect('mongodb://localhost:27017/yelp_camp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
);
//seedDB();
//BODY-PARSER - lets express use body-parser
app.use(bodyParser.urlencoded({ extended: true }));
//VIEW ENGINE - tells express to look in views folder for ejs templates when rendering
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.static("semantic"));
//add semantic static here
app.use(async function (req, res, next) {
    res.locals.currentUser = req.user;
    if (req.user) {
        try {
            let user = await User.findOne({  'username' : req.user.username })
            .populate('notifications', null, { isRead: false }).exec();
            res.locals.newNotifications = user.notifications.reverse();
        } catch (err) {
            console.log(err.message);
        }
    }
    res.locals.errorHeader = req.flash('error header');
    res.locals.error = req.flash('error');
    res.locals.successHeader = req.flash('success header');
    res.locals.success = req.flash('success');
    res.locals.warningHeader = req.flash('warning header');
    res.locals.warning = req.flash('warning');
    res.locals.messageHeader = req.flash('message header');
    res.locals.message = req.flash('message');
    next();
});
app.use(methodOverride('_method'));
app.use(expressSanitizer());

//REQUIRING ROUTES
app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/users/', userRoutes);

//PORT - port for server and lets dev knows it's up and running
app.listen(3000, () => {
    console.log('Yelp Camp started on port 3g');
});