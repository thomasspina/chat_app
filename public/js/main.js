const chatForm = document.getElementById('chat-form');
const chatMessageBoard = document.querySelector('.chat-message-board')

const socket = io();

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
        <p class="text">
            ${message.text}
        </p>
    </div>
    `;

    document.querySelector('.chat-message-board').appendChild(div);
}