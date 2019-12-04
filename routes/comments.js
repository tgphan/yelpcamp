var express = require('express');
    router = express.Router({ mergeParams: true }),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    bodyParser = require('body-parser'),
    expressSanitizer = require('express-sanitizer'),
    middleware = require('../middleware');

//NEW COMMENTS - form to create a new comment for a specific campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: foundCampground });
        }
    });
});
//CREATE NEW COMMENT
router.post('/', middleware.isLoggedIn, (req, res) => {
    (async function addComment() {
        try {
            let campground = await Campground.findById(req.params.id);
            let comment = await Comment.create(req.body.comment);
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.campground = campground;
            console.log(comment.campground.image);
            comment.save();
            campground.comments.push(comment);
            campground.save();
            req.flash('success', 'Successfully added comment!');
            res.redirect(`/campgrounds/${req.params.id}`);
        } catch(error) {
            console.log(error);
            res.redirect('/campgrounds');
        }
    }());
});

//EDIT COMMENTS
router.get('/:comment_id/edit', middleware.isCommentCreator, (req, res) => {
    (async function editComment() {
        try {
            let comment = await Comment.findById(req.params.comment_id);
            res.render('comments/edit', {comment: comment, campground_id: req.params.id});
        } catch(err){
            console.error(err);
            res.redirect(`back`);
        }
    })();
});

//UPDATE COMMENTS
router.put('/:comment_id', middleware.isCommentCreator, (req, res) => {
    (async function updateComment() {
        try {
            await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
            res.redirect(`/campgrounds/${req.params.id}`);
        } catch(err) {
            console.log(err);
            res.redirect(`back`);
        }
    })();
});

//DELETE COMMENTS
router.delete('/:comment_id', middleware.isCommentCreator, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err, comment)=>{
        if(err || !comment){
            console.error(err);
            res.redirect(`/campgrounds/${req.params.id}`);
        } else {
            req.flash('success', "Comment deleted!");
            res.redirect(`/campgrounds/${req.params.id}`);        }
    });
});

module.exports = router;