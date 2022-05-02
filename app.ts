import express = require('express');
const app = express();
import path = require('path');
import { Server, Socket } from 'socket.io';
import { router } from './router';
import { connect } from 'mongoose';
import 'dotenv/config';

const port = process.env.PORT || 3000;
app.set('port', port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.use('/messages', router);
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

async function start() {
  try {
    await connect(process.env.MONGO_URI!);
  } catch (e: any) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();

const io = new Server(server);
io.on('connection', (socket: Socket) => {
  if (io.engine.clientsCount !== (null || undefined)) {
    socket.emit('connections', io.engine.clientsCount);
  }

  socket.on('disconnect', () => {
    socket.broadcast.emit('connections', io.engine.clientsCount);
    console.log('A user disconnected');
  });

  socket.on('chat-message', (data: { body: string; isYou: boolean; username: string }) => {
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
