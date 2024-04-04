import net from 'net'

const serverAddress = {
  host: '127.0.0.1',
  port: 1080
};

const buffer = Buffer.alloc(9)
buffer[0] = 0x04
buffer[1] = 0x02

buffer.writeUInt16BE(0, 2);

const ipParts = '0.0.0.0'.split('.');
const offset = 4;
for (let i = 0; i < 4; i++) {
  buffer[offset + i] = parseInt(ipParts[i], 10);
}

buffer[9] = 0x00;

const clientSocket = net.createConnection(serverAddress, () => {
  console.log('Connected to server');
  clientSocket.write(buffer);
});

clientSocket.on('data', (data) => {
  console.log('Received response:', data.toString('hex'));
});

clientSocket.on('error', (err) => {
  console.error('Socket error:', err.message);
});