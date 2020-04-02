const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/camp')
const Comment = require('../models/comment')

// Middleware
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login');
}

// Comments New
router.get('/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.loge(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    })
});

// Comments create
router.post('/', isLoggedIn, (req, res) => {
    // loop campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
                redirect('/campgrounds')
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err)
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // save comment
                    campground.comments.push(comment)
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
})


module.exports = router