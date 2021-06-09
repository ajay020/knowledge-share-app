const express = require('express');
const session = require('express-session');
const path = require('path');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const passport = require('passport')
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const exhbs = require('express-handlebars');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const {ifCond, getShortPost, formatDate} = require('./helpers/hbs');
const app = express();


app.use(express.static(path.join(__dirname, 'public')))
app.use(fileUpload());


// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

// logging, parsing, and session handling.
app.use(require('morgan')('combined'));

let result = require('dotenv').config();
if(result.error){
    throw result.error;
}
connectDB();

let hbs = exhbs.create({
    helpers: {
       ifCond,
       getShortPost,
       formatDate
    },
    extname:".hbs",
});

// Register `hbs.engine` with the Express app.
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Body parser
app.use(express.urlencoded({extended:true}));
app.use(express.json());


// Method override
app.use(methodOverride((req, res) =>{
    if(req.body && typeof req.body === 'object' && '_method' in req.body){
        // look in urlencodedPOST bodies and delete it
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

//Session
const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
})

app.use(cookieParser('secret'));

//Session set-up
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    store: sessionStore,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day
    }
}));

app.use(flash());

// Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error = req.flash('error');
    res.locals.errors = req.flash('errors');
    next();
  });

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));
app.use('/user', require('./routes/user'));



app.listen(process.env.PORT, () =>{
    console.log("Server is running on port " + process.env.PORT);
})