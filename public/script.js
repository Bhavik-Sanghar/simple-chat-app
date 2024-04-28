document.addEventListener('DOMContentLoaded', function() {
    const socket = io();
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const namePopup = document.getElementById('name-popup');
    const submitNameBtn = document.getElementById('submit-name');
    const usernameInput = document.getElementById('username');
    let audio = new Audio("ting.mp3")

    let username;

    // Show the name popup
    namePopup.style.display = 'block';

    // Listen for name submission
    submitNameBtn.addEventListener('click', () => {
        username = usernameInput.value.trim();
        if (username !== '') {
            namePopup.style.display = 'none';
            socket.emit('user joined', username);
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value.trim() !== '') {
            socket.emit('chat message', input.value);
            input.value = '';
        }
    });

    socket.on('chat message', function(data) {
        const { sender, message } = data;
        const item = document.createElement('li');
        if (sender === username) {
            item.classList.add('sender');
            item.textContent = `You : ${message}`;
        } else {
            item.classList.add('receiver');
            item.textContent = `${sender}: ${message}`;
            audio.play();
        }
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight; // Scroll to bottom
        
    });

    socket.on('user joined', function(user) {
        const item = document.createElement('li');
        item.textContent = `${user} joined the chat`;
        item.classList.add('notification');
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight; // Scroll to bottom
    });

    socket.on('user left', function(user) {
        const item = document.createElement('li');
        item.textContent = `${user} left the chat`;
        item.classList.add('notification');
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight; // Scroll to bottom
    });
});
