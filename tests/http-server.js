import { createServer } from 'http';

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, Worldxxxxxxxxxxxxx vvvvvvvvvvvvv !\n');
});

const port = 8000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
