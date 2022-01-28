const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {
    socket.emit('message', 'welcome current user'); // Emits to the single user connecting

    // Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat'); // Emits to all but the user that connected

    // Broadcast when a user connects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', msg);
    });

});

PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));