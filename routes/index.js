const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user')

// Middleware
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login');
}

// root route
router.get('/', (req, res) => {
    res.render('landing');
}) 

// show register form
router.get('/register', (req, res) => {
    res.render('register')
})

// handle signup logic
router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds')
        })
    })
})

// login routes
router.get('/login', (req, res)=> {
    res.render('login')
})

//handling login form
router.post('/login', passport.authenticate('local', 
    {
        successRedirect:'/campgrounds',
        failureRedirect: '/login'
    }), (req, res) => {
});

// logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds')
})


module.exports = router;