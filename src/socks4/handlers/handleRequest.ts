import { Socket, isIPv4 } from "net";
import { CONN_REFUSED_BUFFER, SOCKS_VERSION } from "../constants";
import handleConnect from "./handleConnect";
import handleBind from "./handleBind";

export default function handleRequest(buffer: Buffer) {
  const sock: Socket = this;
  const version = buffer[0];

  if (version !== SOCKS_VERSION) {
    console.error('Unsupported Version', version);
    sock.end(CONN_REFUSED_BUFFER);
    return;
  }

  if (buffer.byteLength < 8) {
    sock.end(CONN_REFUSED_BUFFER);
    return;
  }

  const cmd = buffer[1];
  const port = buffer.readUInt16BE(2);
  const ip = buffer.subarray(4, 8).join('.');

  if (port < 0 || !isIPv4(ip)) {
    console.error('Invalid Port or IP', port, ip);
    sock.end(CONN_REFUSED_BUFFER);
    return;
  }

  switch (cmd) {
    case 1:
      handleConnect(sock, port, ip);
      break;

    case 2:
      handleBind(sock, port, ip);
      break;

    default:
      console.error('Invalid Command', cmd);
      sock.end(CONN_REFUSED_BUFFER);
      break;
  }
}