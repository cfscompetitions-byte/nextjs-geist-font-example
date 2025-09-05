const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join office room for real-time updates
    socket.on('join-office', (officeId) => {
      socket.join(`office-${officeId}`);
      console.log(`Socket ${socket.id} joined office-${officeId}`);
    });

    // Join queue room for real-time updates
    socket.on('join-queue', (queueId) => {
      socket.join(`queue-${queueId}`);
      console.log(`Socket ${socket.id} joined queue-${queueId}`);
    });

    // Join token room for personal updates
    socket.on('join-token', (tokenId) => {
      socket.join(`token-${tokenId}`);
      console.log(`Socket ${socket.id} joined token-${tokenId}`);
    });

    // Leave rooms
    socket.on('leave-office', (officeId) => {
      socket.leave(`office-${officeId}`);
    });

    socket.on('leave-queue', (queueId) => {
      socket.leave(`queue-${queueId}`);
    });

    socket.on('leave-token', (tokenId) => {
      socket.leave(`token-${tokenId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return {
    // Emit queue updates to all connected clients in office
    emitQueueUpdate: (officeId, queueData) => {
      io.to(`office-${officeId}`).emit('queue-updated', queueData);
    },

    // Emit token status update to specific token holder
    emitTokenUpdate: (tokenId, tokenData) => {
      io.to(`token-${tokenId}`).emit('token-updated', tokenData);
    },

    // Emit new token to queue watchers
    emitNewToken: (queueId, tokenData) => {
      io.to(`queue-${queueId}`).emit('new-token', tokenData);
    },

    // Emit token called notification
    emitTokenCalled: (tokenId, queueId, tokenData) => {
      io.to(`token-${tokenId}`).emit('token-called', tokenData);
      io.to(`queue-${queueId}`).emit('token-called', tokenData);
    },

    // Emit queue statistics update
    emitQueueStats: (officeId, stats) => {
      io.to(`office-${officeId}`).emit('queue-stats', stats);
    }
  };
};

module.exports = socketHandler;
