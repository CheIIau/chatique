"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
const express = require("express");
const app = express();
const path = require("path");
const socket_io_1 = require("socket.io");
const router_1 = require("./router");
const mongoose_1 = require("mongoose");
const constants_1 = require("./constants");
const port = process.env.PORT || 3000;
app.set('port', port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
app.use('/messages', router_1.router);
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});
async function start() {
    try {
        await mongoose_1.connect(constants_1.mongoUri);
    }
    catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}
start();
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    if (io.engine.clientsCount !== (null || undefined)) {
        socket.emit('connections', io.engine.clientsCount);
    }
    socket.on('disconnect', () => {
        socket.broadcast.emit('connections', io.engine.clientsCount);
        console.log('A user disconnected');
    });
    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', data);
    });
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });
    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });
    socket.on('joined', (username) => {
        socket.broadcast.emit('joined', username);
        socket.broadcast.emit('connections', io.engine.clientsCount);
    });
    socket.on('leave', (username) => {
        socket.broadcast.emit('leave', username);
    });
});
//# sourceMappingURL=app.js.map