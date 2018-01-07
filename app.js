const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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
const port = 5000;

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

// Process form
app.post('/ideas', (req,res) =>{
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
          res.redirect('/notes');
        })
  }
});

// Notify Server Running
app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});
