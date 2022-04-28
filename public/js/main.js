const chatForm = document.getElementById('chat-form');
const chatMessageBoard = document.querySelector('.chat-message-board');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('room-users');

// get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

var messageOffset = 0;

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {
    outputMessage(message);
    
    chatMessageBoard.scrollTop = chatMessageBoard.scrollHeight;
});

socket.on('oldMessages', messages => {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const div = document.createElement('div');
        div.classList.add('message');
        
        div.innerHTML = `
            <p class="meta">${message.username} <span>${message.time}</span> <span class="date">${message.date}</span></p>
            <p>
                ${message.text}
            </p>`;
    
        chatMessageBoard.prepend(div);
    }
    messageOffset += 30; // change when changing number of messages to load
});

// load more messages when scrolled to top
chatMessageBoard.addEventListener('scroll', event => {
    if (chatMessageBoard.scrollTop < 1) {
        console.log('load new messages')
        socket.emit('getOldMessages', messageOffset);
    }
});

 
chatForm.addEventListener('submit', event => {
    event.preventDefault(); // prevents form from sending to a file

    const msg = event.target.elements.msg.value;

    socket.emit('chatMessage', msg); // emitting a message to the server

    // clear input
    event.target.elements.msg.value = "";
    event.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span> <span class="date">${message.date}</span></p>
                    <p>${message.text}</p>`;

    chatMessageBoard.append(div);
}

// add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// add users to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}