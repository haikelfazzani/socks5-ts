import net from 'net'
import dns from 'dns'
import { domainVerify, hostname } from './utils'

const AUTHMETHODS = {
  NOAUTH: 0,
  USERPASS: 2
}

let authorHandler = function (data) {
  let sock = this
  // console.log('authorHandler ', data)
  // <Buffer 05 02 00 01>

  const VERSION = parseInt(data[0], 10);
  if (VERSION !== 5) {
    sock.destroy()
    return false
  }

  const methodBuf = data.slice(2)
  // <Buffer 00 01>

  let methods = []
  for (let i = 0; i < methodBuf.length; ++i) methods.push(methodBuf[i])

  if (methods.includes(AUTHMETHODS.NOAUTH)) {
    const buf = Buffer.from([VERSION, AUTHMETHODS.NOAUTH])
    sock.write(buf)
    sock.once('data', requestHandler.bind(sock))
  }
  else {
    const buf = Buffer.from([VERSION, 0xff]) // 0xff: No supported method 
    sock.write(buf)
    return false
  }
}

let requestHandler = function (data) {
  let sock = this
  const [VERSION, CMD, RSV, ATYP] = data // destructing assignment

  if (CMD !== 1) console.error('Not support other type connection %d', CMD)

  if (!(VERSION === 5 && CMD < 4 && RSV === 0)) return false;

  let host, port = data.slice(data.length - 2).readInt16BE(0)
  let copyBuf = Buffer.alloc(data.length);

  data.copy(copyBuf);

  if (ATYP === 1) { // ipv4
    // DST.ADDR = data.slice(4, 8)
    host = hostname(data.slice(4, 8))
    connect(host, port, copyBuf, sock)
  }

  if (ATYP === 3) { // domain
    // DST.ADDR = data[4]
    let len = parseInt(data[4], 10)
    host = data.slice(5, 5 + len).toString('utf8')
    if (!domainVerify(host)) {
      console.log('domain format error %s', host)
      return false
    }
    // console.log('host %s', host)
    dns.lookup(host, (err, ip, version) => {
      if (err) {
        console.log(err)
        return
      }
      connect(ip, port, copyBuf, sock)
    })
  }
}

let connect = function (host, port, data, sock) {
  if (port < 0 || host === '127.0.0.1') return
  console.log('host %s port %d', host, port)
  let socket = new net.Socket()
  socket.connect(port, host, () => {
    data[1] = 0x00
    if (sock.writable) {
      sock.write(data)
      sock.pipe(socket)
      socket.pipe(sock)
    }
  })

  socket.on('close', () => {
    socket.destroyed || socket.destroy()
  })

  socket.on('error', err => {
    if (err) {
      console.error('connect to %s:%d error', host, port)
      data[1] = 0x03
      if (sock.writable)
        sock.end(data)
      console.error(err)
      socket.end();
    }
  })
}

export default net.createServer(sock => {
  sock.on('error', (err) => {
    console.error('error code: %s', err.name)
    console.error(err)
  })

  sock.on('close', () => {
    sock.destroyed || sock.destroy()
  })

  sock.once('data', authorHandler.bind(sock))
})