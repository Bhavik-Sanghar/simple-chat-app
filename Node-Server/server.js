const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
        if (socket.username) {
            io.emit('user left', socket.username);
        }
    });

    socket.on('user joined', (username) => {
        console.log(`${username} joined the chat`);
        socket.username = username;
        io.emit('user joined', username);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', { sender: socket.username, message: msg });
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
