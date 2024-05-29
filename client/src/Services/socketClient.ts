// socketClient.js
import { Socket, io } from 'socket.io-client';
import { create } from 'zustand';

const URL = import.meta.env.VITE_DEBUGGER_URL || 'http://localhost:8000';

export type SocketEventName =
  | 'connect'
  | 'disconnect'
  | 'sendData'
  | 'receiveData'
  | 'error'
  | 'mainDebug'
  | 'executeNext'
  | 'sendDummyLinkedListData'
  | 'sendDummyBinaryTreeData'
  | 'sendFunctionDeclaration'
  | 'sendTypeDeclaration'
  | 'sendBackendStateToUser'
  | 'sendStdoutToUser'
  | 'programWaitingForInput'
  | 'compileError'
  | 'send_stdin';

export type SocketEventData = any;

export interface SocketEvent {
  event: SocketEventName;
  data?: SocketEventData;
}

class SocketClient {
  private socket: Socket;

  constructor() {
    this.socket = io(URL);
  }

  connect() {
    this.socket.on('connect', () => {
      console.log('Connected!');
    });
  }

  disconnect() {
    this.socket.on('disconnect', () => {
      console.log('Disconnected!');
    });
  }

  on(event: SocketEventName, callback: (data: SocketEventData) => void) {
    this.socket.on(event, callback);
  }

  off(event: SocketEventName, callback?: (data: SocketEventData) => void) {
    this.socket.off(event, callback);
  }

  emit(event: SocketEventName, data?: SocketEventData) {
    if (data !== undefined) {
      this.socket.emit(event, data);
    } else {
      this.socket.emit(event);
    }
  }
}

interface SocketStore {
  socket: SocketClient;
}

const useSocketClientStore = create<SocketStore>(() => ({
  socket: new SocketClient(),
}));

export default useSocketClientStore;
