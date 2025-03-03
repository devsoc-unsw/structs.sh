// socketClient.js
import { Socket, io } from 'socket.io-client';
import { create } from 'zustand';
import { ServerToClientEvent } from './socketClientType';
import { ClientToServerEvents } from './socketServerType';

const URL = import.meta.env.VITE_DEBUGGER_URL || 'http://localhost:8000';

class SocketClient {
  socket: Socket<ServerToClientEvent, ClientToServerEvents>;

  get socketTempRemoveLater(): Socket {
    return this.socket;
  }

  private setupDefaultEvents() {
    this.socket.on('connect', () => {
      console.log('Connected!');
    });
    this.socket.on('disconnect', () => {
      console.log('Disconnected!');
    });

    // TODO: This section leaves for debugging purpose
    /* 
      this.socket.on('sendDummyLinkedListData', (data: any) => {
        console.log('Received dummy linked list data:', data);
      }); 
    */
    // Debugging: Log all events and their data
    this.socket.onAny((eventName, ...args) => {
      console.log(`Event received: ${eventName}`, args);
    });
  }

  constructor() {
    this.socket = io(URL, { path: "/debugger" });
    this.setupDefaultEvents();
    this.socket.connect();
  }

  setupEventHandlers(handlers: ServerToClientEvent) {
    (Object.keys(handlers) as Array<keyof ServerToClientEvent>).forEach((event) => {
      const handler = handlers[event];
      if (handler) {
        this.socket.on(event, handler);
      }
    });
  }

  clearEventHandlers(handlers: ServerToClientEvent) {
    (Object.keys(handlers) as Array<keyof ServerToClientEvent>).forEach((event) => {
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
      this.socket.emit('mainDebug', data);
    },
    executeNext: () => {
      this.socket.emit('executeNext');
    },
    sendStdin: (data: any) => {
      this.socket.emit('send_stdin', data);
    },
    sendEOF: () => {
      this.socket.emit('EOF');
    },
    sendSIGINT: () => {
      this.socket.emit('SIGINT');
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
