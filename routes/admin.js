const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const User = require('../models/User');
const DeviceSession = require('../models/DeviceSession');
const AutoReply = require('../models/AutoReply');

// Dashboard (all users)
router.get('/admin', isLoggedIn, isAdmin, async (req, res) => {
  const users = await User.find();
  res.render('admin/index', { users });
});

// Toggle user activation
router.post('/admin/user/:id/toggle', isLoggedIn, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isActive = !user.isActive;
  await user.save();
  res.redirect('/admin');
});

// View devices per user
router.get('/admin/user/:id/devices', isLoggedIn, isAdmin, async (req, res) => {
  const devices = await DeviceSession.find({ userId: req.params.id });
  res.render('admin/devices', { devices });
});

// View replies per user
router.get('/admin/user/:id/replies', isLoggedIn, isAdmin, async (req, res) => {
  const replies = await AutoReply.find({ userId: req.params.id });
  res.render('admin/replies', { replies });
});

module.exports = router;
