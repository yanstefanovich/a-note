const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

const port = 5000;

const app = express();

//Connect to Mongoose
mongoose.connect('mongodb://localhost/a-note-dev')
.then(() => console.log(`MongoDB Connected`))
.catch( err => console.log(err.toString()));

// Load Note Model
require('./models/Notes');
const Note = mongoose.model('notes');

//Handlebars Middeware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parse Middleware
app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride('_method'));

// Express Session Middeware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Connect Flash
app.use(flash());

// GLobal Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
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

// Note Index Page
app.get('/notes', (req, res)=>{
  Note.find({})
      .sort({date:'desc'})
      .then(notes =>{
        res.render('notes/index',{
          notes
        });
      });
});

// Add Note Form
app.get('/notes/add',(req,res)=>{
  res.render('notes/add');
});

//Edit Note Form
app.get('/notes/edit/:id',(req,res) => {
  Note.findOne({
    _id: req.params.id,
  })
  .then(note=>{
    res.render('notes/edit',{
      note
    });
  })
});

// Add Note Process Form
app.post('/notes', (req,res) =>{
  let errors = [];

  if (!req.body.title) {
    errors.push({text: 'Please add a title'});
  }
  if (!req.body.contents) {
    errors.push({text: 'Please add some note contents'})
  }


  if (errors.length > 0) {
    res.render('notes/add',{
      errors,
      title: req.body.title,
      contents: req.body.contents
    });
  } else {
    const newUser = {
      title: req.body.title,
      contents: req.body.contents
    }
    new Note(newUser)
        .save()
        .then(note => {
          req.flash('success_msg', 'Note Added.');
          res.redirect('/notes');
        })
  }
});

//Edit Note Form
app.put('/notes/:id', (req,res)=>{
  Note.findOne({
    _id:req.params.id
  })
  .then(note => {
    note.title = req.body.title;
    note.contents = req.body.contents;

    note.save()
    .then(note => {
      req.flash('success_msg', 'Note Updated.');
      res.redirect('/notes');
    });
  });
});

// Delete Note Form
app.delete('/notes/:id', (req,res) => {
  Note.remove({_id:req.params.id})
  .then(() => {
    req.flash('success_msg', 'Note Removed.');
    res.redirect('/notes');
  });
});

// Notify Server Running
app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});
