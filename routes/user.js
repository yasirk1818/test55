const express = require('express');
const router = express.Router();
const DeviceSession = require('../models/DeviceSession');
const { addNewDevice, removeDevice } = require('../services/whatsappManager');

// Middleware to protect routes
function isLoggedIn(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

// Show devices
router.get('/devices', isLoggedIn, async (req, res) => {
  const devices = await DeviceSession.find({ userId: req.session.user.id });
  res.render('dashboard/devices', { devices });
});

// Add device (starts WhatsApp QR flow)
router.post('/devices/add', isLoggedIn, async (req, res) => {
  const { name } = req.body;
  const session = await addNewDevice(req.session.user.id, name, req.io);
  res.redirect('/devices');
});

// Delete/disconnect device
router.post('/devices/:id/delete', isLoggedIn, async (req, res) => {
  await removeDevice(req.params.id);
  res.redirect('/devices');
});

module.exports = router;

const AutoReply = require('../models/AutoReply');

// Show auto-reply page
router.get('/auto-replies', isLoggedIn, async (req, res) => {
  const rules = await AutoReply.find({ userId: req.session.user.id });
  res.render('dashboard/auto-replies', { rules });
});

// Add new rule
router.post('/auto-replies/add', isLoggedIn, async (req, res) => {
  const { keyword, reply } = req.body;
  await AutoReply.create({
    userId: req.session.user.id,
    keyword,
    reply
  });
  res.redirect('/auto-replies');
});

// Delete rule
router.post('/auto-replies/:id/delete', isLoggedIn, async (req, res) => {
  await AutoReply.findByIdAndDelete(req.params.id);
  res.redirect('/auto-replies');
});
