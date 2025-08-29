import type { SocketCallbacks } from './types';

const socketBaseUrl = 'wss://ya-praktikum.tech/ws';

export function createSocket(path: string, callbacks?: SocketCallbacks): WebSocket {
  const ws = new WebSocket(socketBaseUrl + path);
  const pingInterval = 15000;
  let timer: number | undefined;

  ws.onopen = (event) => {
    callbacks?.onopen?.(event);
    ws.send(JSON.stringify({ type: 'ping' }));
    timer = window.setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, pingInterval);
  };

  ws.onmessage = (event) => {
    callbacks?.onmessage?.(event);
  };

  ws.onerror = (event) => {
    callbacks?.onerror?.(event);
  };

  ws.onclose = (event) => {
    if (timer) clearInterval(timer);
    callbacks?.onclose?.(event);
  };

  return ws;
}
