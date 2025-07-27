const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Show login page
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Show register page
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Handle register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    req.flash('success', 'Registered successfully. Please login.');
    res.redirect('/login');
  } catch (err) {
    req.flash('error', 'Username already exists.');
    res.redirect('/register');
  }
});

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !await user.comparePassword(password)) {
    req.flash('error', 'Invalid credentials');
    return res.redirect('/login');
  }
  req.session.user = { id: user._id, username: user.username, isAdmin: user.isAdmin };
  res.redirect('/dashboard');
});

// Dashboard route
router.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.send(`Welcome, ${req.session.user.username}`);
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
