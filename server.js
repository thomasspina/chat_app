const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mysql = require('mysql');
const dotenv = require('dotenv');

const { formatMessage, saveMessage, getMessages } = require('./utils/message.js');
const { userJoin, getCurrentUser, userLeave, getRoomUsers, getDBUser } = require('./utils/user.js');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const connection = mysql.createConnection({
    host: `${process.env.MYSQL_HOST}`,
    port: 3306,
    user: 'root',
    password: `${process.env.MYSQL_ROOT_PASSWORD}`,
    database: 'chat'
});

app.use(express.static(path.join(__dirname, 'public')));

connection.connect(err => {
    if (err) throw err;
    console.log('MySQL connected.');
});



/* to authenticate users */
app.get('/user_exists', (req, res) => {
    //getDBUser(req.params, connection);
    console.log(req.params);
    res.send("yes");
});




/* chat message code */
const botName = 'rob bot';
const nLoadMessage = 30;

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        userJoin(socket.id, username, room, connection)
        .then(user => {
            socket.join(user.room);
            postOldMessages(user, 0, nLoadMessage, socket); // post last n messages

            socket.emit('message', formatMessage(botName, `Welcome to the chat ${user.username}`)); // welcome

            socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

            sendRoomInfo(user);
        })
        .catch(err => setImmediate(() => { throw err; }));
    });

    // listen for chatMessage
    socket.on('chatMessage', msg => {
        getCurrentUser(socket.id, connection)
        .then(user => { 
            const message = formatMessage(user.username, msg);

            io.to(user.room).emit('message', message);
            
            saveMessage(message, user.room, connection);
        })
        .catch(err => setImmediate(() => { throw err; }));
    });

    socket.on('getOldMessages', offset => {
       getCurrentUser(socket.id, connection)
       .then(user => {
           postOldMessages(user, offset, nLoadMessage, socket);
       })
       .catch(err => setImmediate(() => { throw err; }));
    });

    // broadcast when a user disconnects
    socket.on('disconnect', () => {
        userLeave(socket.id, connection)
        .then(user => {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
            
            sendRoomInfo(user);
        })
        .catch(err => setImmediate(() => { throw err; }));
    });

});

function sendRoomInfo(user) {
    getRoomUsers(user.room, connection)
    .then(users => {
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: users
        });
    })
    .catch(err => setImmediate(() => { throw err; }));
}

function postOldMessages(user, offset, lim, socket) {
    getMessages(user.room, offset, lim, connection)
    .then(messages => {
        socket.emit('oldMessages', messages);
    })
    .catch(err => setImmediate(() => { throw err; }));
}

PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));