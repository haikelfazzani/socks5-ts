import net from 'net'
import dns from 'dns'
import { domainVerify, hostname } from './utils'

const AUTH_METHODS = {
  NOAUTH: 0,
  USERPASS: 2
}

function handleAuth(data: Buffer) {
  const sock = this;

  const VERSION = data[0];

  if (VERSION !== 5) {
    sock.destroy()
    return false
  }

  const methodBuf = data.subarray(2)
  // <Buffer 00 01>

  const methods = []
  for (let i = 0; i < methodBuf.length; ++i) methods.push(methodBuf[i])

  if (methods.includes(AUTH_METHODS.NOAUTH)) {
    sock.write(Buffer.from([VERSION, AUTH_METHODS.NOAUTH]))
    sock.once('data', handleRequest.bind(sock))
  }
  else {
    sock.write(Buffer.from([VERSION, 0xff]))
    return false
  }
}

function handleRequest(data: Buffer) {
  const sock = this;

  const [VERSION, CMD, RSV, ATYP] = data as any;

  if (CMD !== 1) console.error('Not support other type connection %d', CMD)

  if (!(VERSION === 5 && CMD < 4 && RSV === 0)) return false;

  const port = data.subarray(data.length - 2).readInt16BE(0)
  const copyBuf = Buffer.alloc(data.length);

  data.copy(copyBuf);

  if (ATYP === 1) { // ipv4
    // DST.ADDR = data.slice(4, 8)
    const host = hostname(data.subarray(4, 8))
    handleConnect(host, port, copyBuf, sock)
  }

  if (ATYP === 3) { // domain
    // DST.ADDR = data[4]
    const len = data[4];

    const host = data.subarray(5, 5 + len).toString('utf8')
    if (!domainVerify(host)) {
      console.log('domain format error %s', host)
      return false
    }
    console.log('===> domain host %s', host)
    dns.lookup(host, (err, ip, version) => {
      if (err) {
        console.log(err)
        return
      }
      handleConnect(ip, port, copyBuf, sock)
    })
  }
}

function handleConnect(host: string, port: number, data: Buffer, sock: net.Socket) {
  if (port < 0 || host === '127.0.0.1') return
  console.log('host %s port %d', host, port)

  const remoteSocket = new net.Socket();

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