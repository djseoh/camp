const Campground = require('../models/camp')
const Comment = require('../models/comment')

// all middleware
const middlewareObj = {}

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {    
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                res.redirect('back')
            } else {
            // does user own campground?
            // "foundCampground.author.id" is an object and "req.user.id" is a string
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back')
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {    
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect('back')
            } else {
            // does user own comment?
            // "foundComment.author.id" is an object and "req.user.id" is a string
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back')
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login');
}


module.exports = middlewareObj