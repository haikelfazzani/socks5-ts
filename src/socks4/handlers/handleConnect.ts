import { Socket } from "net";
import { CONN_REFUSED_BUFFER } from "../constants";

export default function handleConnect(socket: Socket, port: number, ip: string) {
  const destSocket = new Socket();

  destSocket.connect(port, ip, () => {
    console.info(`> Connecting to ${ip}:${port}`);
    socket.write(Buffer.from([0, 0x5A, 0, 0, 0, 0, 0, 0]));
    socket.pipe(destSocket);
    destSocket.pipe(socket);
  });

  destSocket.on('close', () => {
    console.error('destSocket is closed');
    destSocket.destroy()
  })

  destSocket.on('error', err => {
    console.error('[ERROR] Destination Socket ==> ', err.message);
    socket.end(CONN_REFUSED_BUFFER);
  });
}