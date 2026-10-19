const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos desde la carpeta 'public' (opcional para tu interfaz HTML)
app.use(express.static('public'));

// Ruta de prueba básica
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Configuración de Socket.io para la mensajería en tiempo real
io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Escuchar cuando un usuario envía un mensaje
    socket.on('chat_message', (data) => {
        console.log(`Mensaje de ${data.user}: ${data.message}`);
        
        // Reenviar el mensaje a todos los clientes conectados (incluyendo al que lo envió)
        io.emit('chat_message', {
            user: data.user,
            message: data.message,
            time: new Date().toLocaleTimeString()
        });
    });

    // Manejar la desconexión del usuario
    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

// Puerto en el que correrá el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor de mensajería corriendo en http://localhost:${PORT}`);
});