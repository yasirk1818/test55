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
