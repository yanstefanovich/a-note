// Load Modules
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Load Routes
const notes = require('./routes/notes');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);
const port = process.env.PORT || 5000;

// DB Config
const db = require('./config/database');

// Server Setup
const app = express();

//Connect to Mongoose
mongoose.connect(db.mongoURI)
.then(() => console.log(`MongoDB Connected`))
.catch( err => console.log(err.toString()));

//Handlebars Middeware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'assets')));

// Method Override Middleware
app.use(methodOverride('_method'));

// Express Session Middeware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// GLobal Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//How Middle Works
app.use(function(req,res,next) {
  req.name = 'Yan';
  next();
});

//Index Route
app.get('/',(req,res) => {
  const title = 'A Note';
  res.render('index',{
    title
  });
});

//About Route
app.get('/about',(req,res) => {
  res.render('about');
});

// Use Routes
app.use('/notes', notes);
app.use('/users', users);

// Notify Server Running
app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});
