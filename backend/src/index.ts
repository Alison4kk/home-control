import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { log } from 'console';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let dispositivos = {
  salaLuzOn: false,
  salaTvOn: false,
  salaTvCanal: 0,
  salaAcOn: false,
  salaAcTemp: 24,
  cozinhaLuzOn: false,
  cozinhaGeladeiraTemp: 0,
  cozinhaFogaoOn: false,
  cozinhaFogaoPotencia: 0,
  quartoLuzOn: false,
  quartoVentiladorOn: false,
  quartoVentiladorVelocidade: 0,
  quartoCortinaOn: false
}

const atualizaEstado = () => {
  io.emit('estadoAltera', dispositivos);
}



io.on('connection', (socket) => {

  const mensagemErro = ( mensagem: string) => {
    socket.emit('mensagemErro', mensagem);
  }

  socket.emit('estadoInicial', dispositivos);

  //Sala
  socket.on('sala-luz-estado', (estado: boolean) => {
    dispositivos.salaLuzOn = estado;
    atualizaEstado();
  });

  socket.on('sala-tv-estado', (estado: boolean) => {
    dispositivos.salaTvOn = estado;
    atualizaEstado();
  });

  socket.on('sala-tv-canal', (canal: number) => {
    if (canal < 0 || canal > 30) {
      atualizaEstado();
      mensagemErro('Canal inválido');
      return;
    }
    dispositivos.salaTvCanal = canal;
    atualizaEstado();
  });

  socket.on('sala-ac-estado', (estado: boolean) => {
    dispositivos.salaAcOn = estado;
    atualizaEstado();
  });

  socket.on('sala-ac-temperatura', (temperatura: number) => {
    if (temperatura < 18 || temperatura > 30) {
      atualizaEstado();
      mensagemErro('Temperatura inválida');
      return;
    }
    dispositivos.salaAcTemp = temperatura;
    atualizaEstado();
  });

  //Cozinha
  socket.on('cozinha-luz-estado', (estado: boolean) => {
    dispositivos.cozinhaLuzOn = estado;
    atualizaEstado();
  });

  socket.on('cozinha-geladeira-temperatura', (temperatura: number) => {
    if (temperatura < -5 || temperatura > 5) {
      atualizaEstado();
      mensagemErro('Geladeira acima de 5 ºC, reduzindo a temperatura.');
      return;
    }
    dispositivos.cozinhaGeladeiraTemp = temperatura;
    atualizaEstado();
  });

  socket.on('cozinha-fogao-estado', (estado: boolean) => {
    dispositivos.cozinhaFogaoOn = estado;
    atualizaEstado();
  });

  socket.on('cozinha-fogao-potencia', (potencia: number) => {
    if (potencia < 1 || potencia > 5) {
      atualizaEstado();
      mensagemErro('Potência inválida');
      return;
    }
    dispositivos.cozinhaFogaoPotencia = potencia;
    atualizaEstado();
  });

  //Quarto
  socket.on('quarto-luz-estado', (estado: boolean) => {
    dispositivos.quartoLuzOn = estado;
    atualizaEstado();
  });

  socket.on('quarto-ventilador-estado', (estado: boolean) => {
    dispositivos.quartoVentiladorOn = estado;
    atualizaEstado();
  });

  socket.on('quarto-ventilador-velocidade', (velocidade: number) => {
    if (velocidade < 0 || velocidade > 3) {
      atualizaEstado();
      mensagemErro('Velocidade inválida');
      return;
    }
    dispositivos.quartoVentiladorVelocidade = velocidade;
    atualizaEstado();
  });

  socket.on('quarto-cortina-estado', (estado: boolean) => {
    dispositivos.quartoCortinaOn = estado;
    atualizaEstado();
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});