import { Socket } from "net";

export default function handleConnect(sock: Socket, host: string, port: number, data: Buffer) {
  if (port < 0 || host === '127.0.0.1') return
  console.log('host %s port %d', host, port)

  const remoteSocket = new Socket();

  remoteSocket.connect(port, host, () => {
    data[1] = 0x00
    if (sock.writable) {
      sock.write(data)
      sock.pipe(remoteSocket)
      remoteSocket.pipe(sock)
    }
  })

  remoteSocket.on('close', () => {
    remoteSocket.destroy()
  })

  remoteSocket.on('error', err => {
    if (err) {
      console.error('[Error] connect to %s:%d error', host, port)
      data[1] = 0x03
      if (sock.writable) sock.end(data)
      console.error(err)
      remoteSocket.end();
    }
  })
}