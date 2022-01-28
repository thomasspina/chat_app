const chatForm = document.getElementById('chat-form');

const socket = io();

// Message from server
socket.on('message', message => {
    outputMessage(message);
});

// Message submit 
chatForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents form from sending to a file

    const msg = event.target.elements.msg.value;

    // Emitting a message to the server
    socket.emit('chatMessage', msg);
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    
    div.innerHTML = `
    <p>username <span>timestamp</span></p>
    <p class="text">
        ${message}
    </p>`;

    document.querySelector('.chat-message-board').appendChild(div);
}