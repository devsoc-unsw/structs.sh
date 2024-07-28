// socketClient.js
import { Socket, io } from 'socket.io-client';
import { create } from 'zustand';
import { assertUnreachable } from '../visualiser-debugger/Component/Visualizer/Util/util';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketEventType,
  SocketPackageConcrete,
  EventHandlers,
} from './socketClientType';
import SocketServerType from './socketServerType';

const URL = import.meta.env.VITE_DEBUGGER_URL || 'http://localhost:8000';

class SocketClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  get socketTempRemoveLater(): Socket {
    return this.socket;
  }

  constructor() {
    this.socket = io(URL);
  }

  attach() {}

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

  on<T extends SocketEventType>(event: T, callback: (data: SocketPackageConcrete) => void) {
    switch (event) {
      case 'connect':
        this.connect();
        break;
      case 'disconnect':
        this.disconnect();
        break;
      case 'connect_error':
      case 'error':
        break;
      case 'sendDummyLinkedListData':
      case 'sendDummyBinaryTreeData':
      case 'sendData':
      case 'receiveData':
      case 'mainDebug':
      case 'executeNext':
      case 'sendFunctionDeclaration':
      case 'sendTypeDeclaration':
      case 'sendBackendStateToUser':
      case 'sendStdoutToUser':
      case 'programWaitingForInput':
      case 'compileError':
      case 'send_stdin':
        // @ts-ignore
        this.socket.on(event, callback);
        break;
      default:
        assertUnreachable(event);
    }
  }

  off<T extends SocketEventType>(event: T, callback: (data: any) => void) {
    switch (event) {
      case 'connect':
        this.connect();
        break;
      case 'disconnect':
        this.disconnect();
        break;
      case 'connect_error':
      case 'error':
      case 'sendDummyLinkedListData':
      case 'sendDummyBinaryTreeData':
      case 'sendData':
      case 'receiveData':
      case 'mainDebug':
      case 'executeNext':
      case 'sendFunctionDeclaration':
      case 'sendTypeDeclaration':
      case 'sendBackendStateToUser':
      case 'sendStdoutToUser':
      case 'programWaitingForInput':
      case 'compileError':
      case 'send_stdin':
        // @ts-ignore
        this.socket.off(event, callback);
        break;
      default:
        assertUnreachable(event);
    }
  }

  // This still encapsulate from outside
  emit<T extends keyof SocketServerType>(event: T, ...args: Parameters<SocketServerType[T]>): void {
    this.socket.emit(event as any, ...args);
  }

  setupEventHandlers(handlers: EventHandlers) {
    (Object.keys(handlers) as Array<keyof EventHandlers>).forEach((event) => {
      const handler = handlers[event];
      if (handler) {
        this.socket.on(event, handler as any);
      }
    });
  }

  clearEventHandlers(handlers: EventHandlers) {
    (Object.keys(handlers) as Array<keyof EventHandlers>).forEach((event) => {
      const handler = handlers[event];
      if (handler) {
        this.socket.off(event, handler as any);
      }
    });
  }
}

interface SocketStore {
  socket: SocketClient;
}

const useSocketClientStore = create<SocketStore>(() => ({
  socket: new SocketClient(),
}));

export default useSocketClientStore;
