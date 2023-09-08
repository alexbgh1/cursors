const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;
const CLIENT = process.env.CLIENT || "http://localhost:5173";

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: CLIENT, // Cambia la URL por la de tu aplicación React
    methods: ["GET", "POST"],
  },
});

// Mantendremos un objeto para almacenar las posiciones de los cursores de los usuarios
const cursors = {};

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Manejar la recepción de la posición inicial del cursor
  socket.on("newCursor", (cursor) => {
    console.log("Nuevo cursor recibido:", cursor);
    cursors[socket.id] = cursor; // Guardar la posición del cursor del usuario
    io.emit("updateCursors", cursors); // Emitir las posiciones de los cursores a todos los usuarios
  });

  // Manejar el movimiento del cursor
  socket.on("moveCursor", (cursor) => {
    // console.log("Movimiento del cursor recibido:", cursor);
    cursors[socket.id] = cursor; // Actualizar la posición del cursor del usuario
    io.emit("updateCursors", cursors); // Emitir las posiciones de los cursores a todos los usuarios
  });

  // Manejar la desconexión del socket
  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
    delete cursors[socket.id]; // Eliminar la posición del cursor del usuario
    io.emit("updateCursors", cursors); // Emitir las posiciones de los cursores a todos los usuarios
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
