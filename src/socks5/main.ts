import net from 'net';
import handleAuth from './handlers/handleAuth';

export default net.createServer(sock => {
  sock.on('error', (err) => {
    console.error('error code: %s', err.name)
    console.error(err)
  })

  sock.on('close', () => {
    sock.destroy()
  })

  sock.once('data', handleAuth.bind(sock))
})