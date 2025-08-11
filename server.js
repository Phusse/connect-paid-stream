import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {};

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('join room', roomID => {
    if (rooms[roomID]) {
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }
    const otherUsers = rooms[roomID].filter(id => id !== socket.id);
    socket.emit("other users", otherUsers);
    console.log('other users', otherUsers);
  });

  socket.on("offer", payload => {
    io.to(payload.target).emit("offer", { signal: payload.signal, caller: payload.caller });
  });

  socket.on("answer", payload => {
    io.to(payload.target).emit("answer", { signal: payload.signal, caller: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    let roomID;
    for (const id in rooms) {
        if (rooms[id].includes(socket.id)) {
            roomID = id;
            break;
        }
    }
    if (roomID) {
        rooms[roomID] = rooms[roomID].filter(id => id !== socket.id);
        io.to(roomID).emit('user-disconnected', socket.id);
    }
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`server is running on port ${port}`));
