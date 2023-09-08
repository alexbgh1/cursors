import { useState, useEffect } from "react";
import { debounce } from "lodash";
import io from "socket.io-client";

import CurPng from "./assets/images/cur.png";

const socket = io.connect(import.meta.env.VITE_SERVER); // Cambia la URL por la del servidor

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [cursors, setCursors] = useState({});
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const debouncedHandleMouseMove = debounce((x, y) => {
    setPosition({ x, y });
  }, 10);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado al servidor Socket.io");
      socket.emit("newCursor", position); // Enviar la posición inicial del cursor al servidor
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Desconectado del servidor Socket.io");
      setIsConnected(false);
    });

    socket.on("updateCursors", (updatedCursors) => {
      setCursors(updatedCursors); // Actualizar las posiciones de los cursores
    });

    // Limpieza: desconectar los listeners al desmontar el componente
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("updateCursors");
    };
  });

  let lastUpdateTime = Date.now();

  const handleMouseMove = (e) => {
    const now = Date.now();
    if (now - lastUpdateTime > 10) {
      // Enviar actualización cada 100 ms
      lastUpdateTime = now;
      const x = e.clientX;
      const y = e.clientY;
      debouncedHandleMouseMove(x, y);
    }
  };
  useEffect(() => {
    socket.emit("moveCursor", position); // Enviar la posición del cursor al servidor
    console.log("Enviando posición del cursor al servidor");
  }, [position]);

  return (
    <div
      className="App"
      style={{ height: "100vh" }}
      onMouseMove={handleMouseMove}
    >
      <h1>Seguimiento de Cursores</h1>
      {isConnected ? (
        <p>Conectado al servidor Socket.io</p>
      ) : (
        <p>Desconectado del servidor Socket.io</p>
      )}
      {Object.keys(cursors).map((userId) => {
        if (userId === socket.id) return null; // No mostrar el cursor propio
        // return <Dot key={userId} x={cursors[userId].x} y={cursors[userId].y} />;
        return (
          <img
            key={userId}
            src={CurPng}
            alt="cursor"
            style={{
              left: cursors[userId].x,
              top: cursors[userId].y,
              position: "absolute",
              width: "40px",
              height: "40px",
            }}
          />
        );
      })}
    </div>
  );
}

export default App;
