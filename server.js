const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const methodOverride = require('method-override')
const Campground = require('./models/camp')
const Comment = require('./models/comment')
const User = require('./models/user')
const seedDB = require('./seeds');

// requiring routes
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');

mongoose.Promise = global.Promise;
const PORT = process.env.PORT || 3001
const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/camp'
mongoose.connect( databaseUri, { useNewUrlParser: true, useUnifiedTopology: true, useMongoClient: true})
    .then(() => console.log(`Database connected`))
    .catch(err => console.log(`Database connection error: ${err.message}`));
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

// Passport configuration
app.use(require('express-session')({
    secret:'this is daniels secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next ) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes)

app.listen(PORT, () => {
    console.log(`Server has started on ${PORT}!`);
});