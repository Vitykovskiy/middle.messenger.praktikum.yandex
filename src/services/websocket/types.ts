export interface SocketCallbacks {
  onopen?: (event: Event) => void;
  onerror?: (event: Event) => void;
  onmessage?: (event: MessageEvent) => void;
  onclose?: (event: Event) => void;
}
