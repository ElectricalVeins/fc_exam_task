const socketio = require('socket.io');
const chatController=require('./server/controllers/sockets/ChatController');
const notificationController=require('./server/controllers/sockets/NotificationController');

module.exports.createConnection = (httpServer) => {
  const io = socketio.listen(httpServer);
  notificationController.connect('/notifications', io);
  chatController.connect('/chat', io);
};

module.exports.getChatController = () => {
  return chatController;
};

module.exports.getNotificationController = () => {
  return notificationController;
};
