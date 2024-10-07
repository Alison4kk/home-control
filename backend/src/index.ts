import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

let dispositivos = {
  luzOn: false,
}

io.on('connection', (socket) => {
  console.log('Usuário conectado');

  socket.emit('estadoInicial', dispositivos);

  socket.on('luz', (estado: boolean) => {
    dispositivos.luzOn = estado;
    io.emit('estadoAltera', dispositivos);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});