import handleRequest from "./handleRequest";

const AUTH_METHODS = {
  NOAUTH: 0,
  USERPASS: 2
}

export default function handleAuth(data: Buffer) {
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

  // console.log(methods, methods.some(v => AUTH_METHODS));
  

  if (methods.includes(AUTH_METHODS.NOAUTH)) {
    sock.write(Buffer.from([VERSION, AUTH_METHODS.NOAUTH]))
    sock.once('data', handleRequest.bind(sock))
  }
  else {
    sock.write(Buffer.from([VERSION, 0xff]))
    return false
  }
}