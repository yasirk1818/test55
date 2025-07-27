const { Server } = require('socket.io');

function setupSockets(server) {
  const io = new Server(server);

  io.on('connection', socket => {
    console.log('Socket connected:', socket.id);

    socket.on('join', userId => {
      socket.join(userId); // Join room by user ID
    });
  });

  return io;
}

module.exports = setupSockets;
