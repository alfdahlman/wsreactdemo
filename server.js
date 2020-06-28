import path from 'path';
import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'file-system';
import routes from './routes/index';
import {updateUserStatus} from './utils/utils';


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 4001;
const onlineUsers = {};

app.use(cors());
app.use(bodyParser.json());
app.use(routes);

if(process.env.NODE_ENV==='production'){
  app.use(express.static('client/build'));
  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

io.on('connection', socket => {

  socket.on('join', data => {
    const userId = data.id;
    onlineUsers[socket.id] = userId;
    socket.join(userId);
    io.emit('emitOn', { userId });

  });

  socket.on('chat', data => {
    console.log('chat');
    io.sockets.in(data.recipient).emit('new_msg', { msg: data.msg, user: data.user, recipient: data.recipient });
  });

  socket.on('leaveChat', userId => {
    socket.leave(userId);
    io.emit('emitOff', { userId });
    delete onlineUsers[socket.id];
  });

  socket.on('disconnect', () => {
    const id = onlineUsers[socket.id];

    if(id){
      io.emit('emitOff', { id });
      socket.leave(onlineUsers[socket.id]);
      delete onlineUsers[socket.id];
    }
  });

});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
