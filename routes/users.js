const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const passport = require('passport');

const router = express.Router();

// User Login Route
router.get('/login', (req,res) => {
  res.render('users/login');
});

// User Registration
router.get('/register', (req,res) => {
  res.render('users/register');
});

//Registration Form Post Process
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({text: 'Passwords do not match.'});
  }
  if (req.body.password.length < 4) {
    errors.push({text: 'Pasword must be atleast 4 characters'})
  }

  if (errors.length > 0) {
    res.render('users/register',{
      errors,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    const newUser = {
     title: req.body.name,
     contents: req.body.email,
     password: req.body.password
    }
    bcrypt.genSalt();
    console.log(newUser);
    // new Note(newUser)
    //     .save()
    //     .then(note => {
    //       req.flash('success_msg', 'Note Added.');
    //       res.redirect('/notes');
    //     })
  }
});

module.exports = router;
