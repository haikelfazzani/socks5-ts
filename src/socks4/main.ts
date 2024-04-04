import net from 'net';
import handleRequest from './handlers/handleRequest';

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