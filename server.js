const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'chat bot';

// Run when a client connects
io.on('connection', socket => {
    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to the chat USER')); 

    // Broadcast when a user connects
    socket.broadcast.emit('message', formatMessage(botName, 'USER has joined the chat'));

    // Broadcast when a user connects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'USER has left the chat'));
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    });

});

PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));