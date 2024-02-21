import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*"
  }
});

// Menyimpan history pesan dalam array
const messageHistory = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle login
  socket.on('login', (username) => {
    console.log(`User ${username} logged in`);
    socket.emit('login', `Welcome, ${username}!`);

    // Mengirim history pesan kepada pengguna yang baru login
    socket.emit('chat history', messageHistory);
  });
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('chat', (msg) => {
    console.log('message: ' + JSON.stringify(msg));
    // Menambahkan pesan ke history
    messageHistory.push(msg);

    // Mengirim pesan ke semua klien yang terhubung
    io.emit('chat', msg);
  });
});

const PORT = 3001;
server.listen(PORT, '192.168.3.80', () => { // Menentukan alamat IP server
  console.log(`Server running at http://192.168.3.80:${PORT}`);
});
