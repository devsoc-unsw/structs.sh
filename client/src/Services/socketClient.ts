// socketClient.js
import { Socket, io } from 'socket.io-client';
import { create } from 'zustand';
import { ServerToClientEvents, EventHandlers } from './socketClientType';
import { ClientToServerEvents } from './socketServerType';

const URL = import.meta.env.VITE_DEBUGGER_URL || 'http://localhost:8000';

class SocketClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  get socketTempRemoveLater(): Socket {
    return this.socket;
  }

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

  /**
   * To server section
   * we encapsulate function calls to restrict frontend actions to only permitted emit events.
   */
  // TODO: FIX
  serverAction = {
    initializeDebugSession: (data: any) => {
      console.log('Initializing debug session with data:', data);
      this.socket.emit('mainDebug', data);
    },
    executeNext: () => {
      console.log('Executing next step in the server-side logic.');
      this.socket.emit('executeNext');
    },
  };
}

interface SocketStore {
  socketClient: SocketClient;
}

const useSocketClientStore = create<SocketStore>(() => ({
  socketClient: new SocketClient(),
}));

export default useSocketClientStore;
