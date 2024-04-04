// import { createServer } from '@pondwader/socks5-server';

// const server = createServer();
// server.listen(1080, '127.0.0.1', () => {
//     console.log('Server listening on port 5000');
// })// 



import { socks4, socks5 } from '../dist/index.mjs';

const PORT = 1080;

socks5.listen(PORT, '127.0.0.1', () => {
  console.log('SOCKS5 server listening on port 1080');
});

// curl -x socks5://localhost:1080 http://127.0.0.1:8000