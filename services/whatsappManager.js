const { Client, LocalAuth } = require('whatsapp-web.js');
const DeviceSession = require('../models/DeviceSession');

const activeClients = {}; // { sessionId: client }

function initClient(sessionId, userId, io) {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: sessionId }),
    puppeteer: { headless: true, args: ['--no-sandbox'] }
  });

  client.on('qr', qr => {
    io.to(userId.toString()).emit('qr', { qr, sessionId });
  });

  client.on('ready', async () => {
    await DeviceSession.findByIdAndUpdate(sessionId, {
      status: 'connected'
    });
    activeClients[sessionId] = client;
    io.to(userId.toString()).emit('ready', { sessionId });
  });

  client.on('disconnected', async () => {
    await DeviceSession.findByIdAndUpdate(sessionId, {
      status: 'disconnected'
    });
    delete activeClients[sessionId];
  });

  client.initialize();
}

async function addNewDevice(userId, name, io) {
  const session = new DeviceSession({ userId, name });
  await session.save();
  initClient(session._id.toString(), userId, io);
  return session;
}

async function removeDevice(sessionId) {
  const client = activeClients[sessionId];
  if (client) {
    await client.destroy();
    delete activeClients[sessionId];
  }
  await DeviceSession.findByIdAndDelete(sessionId);
}

module.exports = {
  initClient,
  addNewDevice,
  removeDevice
const AutoReply = require('../models/AutoReply');

client.on('message', async msg => {
  const userDevices = await DeviceSession.findOne({ _id: sessionId });
  if (!userDevices) return;

  const rules = await AutoReply.find({ userId });
  const matched = rules.find(rule =>
    msg.body.toLowerCase().includes(rule.keyword.toLowerCase())
  );

  if (matched) {
    client.sendMessage(msg.from, matched.reply);
  }
});
