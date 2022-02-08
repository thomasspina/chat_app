const chatForm = document.getElementById('chat-form');
const chatMessageBoard = document.querySelector('.chat-message-board')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('room-users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {
    outputMessage(message);

    // Scroll down
    chatMessageBoard.scrollTop = chatMessageBoard.scrollHeight;
});

// Message submit 
chatForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents form from sending to a file

    const msg = event.target.elements.msg.value;

    // Emitting a message to the server
    socket.emit('chatMessage', msg);

    // Clear input
    event.target.elements.msg.value = "";
    event.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    
    div.innerHTML = `
    <div class="message">
        <p class="meta">${message.username} <span>${message.time}</span> <span class="date">${message.date}</span></p>
        <p>
            ${message.text}
        </p>
    </div>
    `;

    document.querySelector('.chat-message-board').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}