const chatForm = document.getElementById('chat-form');

const socket = io();

socket.on('message', message => {
    console.log(message);
});

// Message submit 
chatForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents form from sending to a file

    const msg = event.target.elements.msg.value;

    console.log(msg);
});