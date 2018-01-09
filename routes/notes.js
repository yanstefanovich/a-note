const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Load Note Model
require('../models/Notes');
const Note = mongoose.model('notes');

// Note Index Page
router.get('/', (req, res)=>{
  Note.find({})
      .sort({date:'desc'})
      .then(notes =>{
        res.render('notes/index',{
          notes
        });
      });
});

// Add Note Form
router.get('/add',(req,res)=>{
  res.render('notes/add');
});

//Edit Note Form
router.get('/edit/:id',(req,res) => {
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
router.post('/', (req,res) =>{
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
router.put('/:id', (req,res)=>{
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
router.delete('/:id', (req,res) => {
  Note.remove({_id:req.params.id})
  .then(() => {
    req.flash('success_msg', 'Note Removed.');
    res.redirect('/notes');
  });
});

module.exports = router;
