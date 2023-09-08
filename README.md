# Mini proyecto cursors
Ejemplo de cursores a través de socket.io.

## Cliente
El cliente utiliza Vite y React, con librerías como `lodash` y `socket.io-client` para evitar demasiadas iteraciones (debounce) y conectarse al socket respectivamente.

## Servidor
El servidor utiliza socket.io para definir los cursores y la información que se almacenará (posición 'x' e 'y')
