import net from 'net';
import { CONN_REFUSED_BUFFER, SOCKS_VERSION } from './constants';
import handleConnect from './handleConnect';
import handleBind from './handleBind';

function handleRequest(buffer: Buffer) {
  const clientSocket: net.Socket = this;
  const version = buffer[0];

  if (version !== SOCKS_VERSION) {
    console.error('Unsupported Version', version);
    clientSocket.end(CONN_REFUSED_BUFFER);
    return;
  }

  if (buffer.byteLength < 8) {
    clientSocket.end(CONN_REFUSED_BUFFER);
    return;
  }

  const cmd = buffer[1];
  const port = buffer.readUInt16BE(2);
  const ip = buffer.subarray(4, 8).join('.');

  if (port < 0 || !net.isIPv4(ip)) {
    console.error('Invalid Port or IP', port, ip);
    clientSocket.end(CONN_REFUSED_BUFFER);
    return;
  }

  switch (cmd) {
    case 1:
      handleConnect(clientSocket, port, ip);
      break;

    case 2:
      handleBind(clientSocket, port, ip);
      break;

    default:
      console.error('Invalid Command', cmd);
      clientSocket.end(CONN_REFUSED_BUFFER);
      break;
  }
}

export default net.createServer((socket: net.Socket) => {
  socket.on('error', err => {
    console.error('socket ==> %s', err.message);
    socket.end();
  });

  socket.on('close', () => {
    console.error('Client Socket is closed');
    socket.destroy()
  });

  socket.once('data', handleRequest.bind(socket));
})