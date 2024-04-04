import { Socket } from "net";
import { resolve4 } from "dns";
import handleConnect from "./handleConnect";
import { ADDRESS_TYPE, SOCKS_VERSION } from "../constants";
import { validateDomain, getHost } from "../utils";

export default function handleRequest(data: Buffer) {
  const sock: Socket = this;

  const [VERSION, CMD, RSV, ATYP] = data as any;

  if (CMD !== 1) console.error('Not support other type connection %d', CMD)

  if (!(VERSION === SOCKS_VERSION && CMD < 4 && RSV === 0)) return false;

  const port = data.subarray(data.length - 2).readInt16BE(0)
  const copyBuf = Buffer.alloc(data.length);

  data.copy(copyBuf);

  switch (ADDRESS_TYPE[ATYP]) {
    case ADDRESS_TYPE[1]:
      const hostName = getHost(data.subarray(4, 8))      
      handleConnect(sock, hostName, port, copyBuf)
      break;

    case ADDRESS_TYPE[3]:
      const len = data[4];

      const host = data.subarray(5, 5 + len).toString('utf8')
      if (!validateDomain(host)) {
        console.log('domain format error %s', host)
        return false
      }
      console.log('===> domain host %s', host)
      resolve4(host, (err: NodeJS.ErrnoException, addresses: string[]) => {
        if (err) {
          console.log('DNS resolve ', err)
          return
        }
        handleConnect(sock, addresses[0], port, copyBuf)
      })
      break;

    default:
      sock.destroy();
      break;
  }
}