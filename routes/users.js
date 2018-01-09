const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// User Login Route
router.get('/login', (req,res) => {
  res.send('LOGIN');
});

// User Registration
router.get('/register', (req,res) => {
  res.send('Register');
});

module.exports = router;
