const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const passport = require('passport');

const router = express.Router();

// Load User Model
require('../models/Users');
const User = mongoose.model('users');

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
    errors.push({text: 'Password must be atleast 4 characters'})
  }

  if (errors.length > 0) {
    res.render('users/register',{
      errors,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    User.findOne({email: req.body.email})
    .then(user => {
      if (user) {
        req.flash('error_msg', 'Email already registered.');
        res.redirect('/users/register');
      } else {
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        };
        req.body.password = req.body.password2 = 'password';
        console.log(req.body.password + req.body.password2);
        bcrypt.genSalt(10 ,(err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            new User(newUser).save()
            .then(user => {
              req.flash('success_msg', 'You are now registered. You can log in.');
              res.redirect('/users/login');
            })
            .catch(err => {
              console.log(err.toString());
              return;
            });
          });
        });
      }
    });
  }
});

module.exports = router;
