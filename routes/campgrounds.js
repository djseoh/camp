const express = require('express');
const router = express.Router();
const Campground = require('../models/camp')

// Middleware
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login');
}

const checkCampgroundOwnership = (req, res, next) => {
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

// INDEX ROUTE - show all campgrounds
router.get('/', (req, res) => {
    Campground.find({},(err, campgrounds) => {
        if(err) {
            console.log(err)
        } else {
            res.render('campgrounds/index', { campgrounds: campgrounds, currentUser: req.user});
        }
    })
})


// CREATE ROUTE - add new campground to DB
router.post('/', isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = { name: name, image: image, description: desc, author: author}
    Campground.create( newCampground, (err, newlyCreated) => {
        if(err) {
            console.log(err)
        } else {
            res.redirect('campgrounds')
        }
    })
});

// NEW ROUTE - show form to create new camp
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW ROUTE - shows more info about one campground
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if(err){
            console.log(err)
        } else {
            res.render('campgrounds/show', {campground: foundCampground})
        }
    })
});

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground});
    })
})

// UPDATE CAMPGROUND ROUTE
router.put('/:id', checkCampgroundOwnership, (req, res) => {
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updateCampground) => {
        if(err) {
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds')
        }
    })
})

module.exports = router;