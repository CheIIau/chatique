/// <reference types="node" />
import express = require('express');
const app = express();
import path = require('path');

const port = process.env.port || '3000';
app.set('port', port);

const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

import { Server, Socket } from "socket.io";

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req: unknown, res: any) => {
    res.sendFile(__dirname + '/dist/index.html');
  });
}

app.use(express.static(path.join(__dirname, 'dist')));

const io = new Server(server);
io.on('connection', (socket: Socket) => {
  if (io.engine.clientsCount !== (null || undefined)) {
    socket.emit('connections', io.engine.clientsCount);
  }

  socket.on('disconnect', () => {
    socket.broadcast.emit('connections', io.engine.clientsCount);
    console.log('A user disconnected');
  });

  socket.on('chat-message', (data: { body: string, isYou:boolean, username: string }) => {
    socket.broadcast.emit('chat-message', data);
  });

  socket.on('typing', (username: string) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('stopTyping');
  });

  socket.on('joined', (username: string) => {
    socket.broadcast.emit('joined', username);
    socket.broadcast.emit('connections', io.engine.clientsCount);
  });

  socket.on('leave', (username: string) => {
    socket.broadcast.emit('leave', username);
  });
});
