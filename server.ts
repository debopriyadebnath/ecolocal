import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

interface User {
  id: string;
  name: string;
  type: 'buyer' | 'seller';
  language: string;  // Added language preference
}

const users = new Map<string, User>();
const chatRooms = new Map<string, Set<string>>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', ({ name, type, language }: { name: string; type: 'buyer' | 'seller'; language: string }) => {
    users.set(socket.id, { id: socket.id, name, type, language });
    io.emit('userList', Array.from(users.values()));
  });

  socket.on('joinRoom', (roomId: string) => {
    socket.join(roomId);
    if (!chatRooms.has(roomId)) {
      chatRooms.set(roomId, new Set());
    }
    chatRooms.get(roomId)?.add(socket.id);
    
    io.to(roomId).emit('roomUsers', {
      room: roomId,
      users: Array.from(chatRooms.get(roomId) || []).map(id => users.get(id))
    });
  });

  socket.on('sendMessage', ({ roomId, message }: { roomId: string; message: string }) => {
    const user = users.get(socket.id);
    if (user) {
      io.to(roomId).emit('message', {
        user,
        message,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    chatRooms.forEach((users, roomId) => {
      users.delete(socket.id);
      if (users.size === 0) {
        chatRooms.delete(roomId);
      }
    });
    io.emit('userList', Array.from(users.values()));
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});