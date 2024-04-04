import { createServer, Socket, AddressInfo } from "net";

export default function handleBind(socket: Socket, port: number, ip: string) {

  const server = createServer((serverSocket) => {
    socket.write(Buffer.from([0x04, 0x5A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
    serverSocket.pipe(socket);
    socket.pipe(serverSocket);

    server.on('close', () => {
      console.log('Closing server socket');
      serverSocket.destroy();
    });
  });

  server.listen(port, ip, () => {
    const address = server.address();
    const port = (address as AddressInfo).port;
    console.log('Server listen on ', address);
    
    const response = Buffer.from([0x00, 0x5A, (port >> 8) & 0xFF, port & 0xFF, 0x00, 0x00, 0x00, 0x00]);
    socket.write(response);
  });

  server.on('error', (err) => {
    console.log('Qerver error ==> ', err.message);
    socket.end(Buffer.from([0x00, 0x5B]));
    server.close();
  });
}