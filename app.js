const express = require('express');
const app = express();
const path = require('path');
const exphandlebars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDBUrl} = require('./config/database');
const passport = require('passport');
// const {allowInsecurePrototypeAccess} = require ('@handlebars/allow-prototype-access');
// const {Handlebars} = require('handlebars');

mongoose.Promise = global.Promise;

mongoose.connect(mongoDBUrl).then(db => {
    console.log('connected to mongo');
}).catch(error => console.log("Connection Error with Mongo: " + error));


// Using Static

app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine

const {select, generateTime} = require('./helpers/handlebars-helpers');
app.engine('handlebars', exphandlebars.engine({
    defaultLayout: 'home',
    helpers: {select: select, generateTime: generateTime}
}));
app.set('view engine', 'handlebars');

// Upload Middleware

app.use(upload());

// Idk what this is


const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');

// Body Parser

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Method Override

app.use(methodOverride('_method'))

app.use(session({

    secret: 'youknowwhatthisisIthinkProbablyMaybeYouDont',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// passport

app.use(passport.initialize());
app.use(passport.session());

// Local Variables using Middleware

app.use((req, res, next) => {
    res.locals.user = req.user || null
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.form_errors = req.flash('form_errors');
    res.locals.error = req.flash('error');
    next();
});


// Load Routes

app.use('/admin/categories', categories);
app.use('/admin/comments', comments);
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);

// Use routes

app.listen(4500, () => {
    console.log(`listening to port 4500`);
});