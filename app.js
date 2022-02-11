const express = require('express');
const app = express();
const path = require('path');
const exphandlebars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');

// const {allowInsecurePrototypeAccess} = require ('@handlebars/allow-prototype-access');
// const {Handlebars} = require('handlebars');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/cms').then(db => {
    console.log('connected to mongo');
}).catch(error => console.log("Connection Error with Mongo: " + error));

// Using Static

app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine

const {select} = require('./helpers/handlebars-helpers');
app.engine('handlebars', exphandlebars.engine({defaultLayout: 'home', helpers: {select: select}}));
app.set('view engine', 'handlebars');

// Upload Middleware

app.use(upload());

// Idk what this is

const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');

// Body Parser

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Method Override

app.use(methodOverride('_method'))

// Load Routes

app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);

// Use routes

app.listen(4500, () => {
    console.log(`listening to port 4500`);
});