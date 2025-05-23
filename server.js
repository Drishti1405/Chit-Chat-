const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const users = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new user', (username) => {
    users.set(socket.id, username);
    socket.broadcast.emit('user joined', `${username} joined the chat`);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      socket.broadcast.emit('user left', `${username} left the chat`);
      users.delete(socket.id);
    }
    console.log('A user disconnected');
  });
});

http.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
