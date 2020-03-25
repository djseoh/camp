const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const Campground = require('./models/camp')
const Comment = require('./models/comment')
const User = require('./models/user')
const seedDB = require('./seeds');
const PORT = process.env.PORT || 3001

mongoose.connect('mongodb://localhost:27017/camp', { useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

seedDB();

app.get('/', (req, res) => {
    res.render('landing');
}) 

// INDEX ROUTE - show all campgrounds
app.get('/campgrounds', (req, res) => {
    Campground.find({},(err, campgrounds) => {
        if(err) {
            console.log(err)
        } else {
            res.render('campgrounds/index', { campgrounds: campgrounds });
        }
    })
})


// CREATE ROUTE - add new campground to DB
app.post('/campgrounds', (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newCampground = { name: name, image: image, description: desc}
    Campground.create( newCampground, (err, newlyCreated) => {
        if(err) {
            console.log(err)
        } else {
            res.redirect('campgrounds')
        }
    })
});

// NEW ROUTE - show form to create new camp
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// SHOW ROUTE - shows more info about one campground
app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if(err){
            console.log(err)
        } else {
            res.render('campgrounds/show', {campground: foundCampground})
        }
    })
});

// =================================
// COMMENTS ROUTES

app.get('campgrounds/:id/comments/new', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.loge(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    })
});

app.post('/campgrounds/:id/comments', (req, res) => {
    // looup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
                redirect('/campgrounds')
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err)
                } else {
                    campground.comments.push(comment)
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
    // create new commnet
    // connect new comment to campground
    // redirect campground show page
})

app.listen(PORT, () => {
    console.log(`Server has started on ${PORT}!`);
});