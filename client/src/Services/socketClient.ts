// socketClient.js
import { Socket, io } from 'socket.io-client';
import { create } from 'zustand';
import { assertUnreachable } from '../visualiser-debugger/Component/Visualizer/Util/util';

const URL = import.meta.env.VITE_DEBUGGER_URL || 'http://localhost:8000';

export type SocketEventType =
  | 'connect'
  | 'disconnect'
  | 'connect_error'
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

export interface SocketPackageBase {
  type: SocketEventType;
}

export interface SocketPackageConnect extends SocketPackageBase {
  type: 'connect';
}

export interface SocketPackageDisconnect extends SocketPackageBase {
  type: 'disconnect';
}

// TODO: FURTHER ENHANCE TYPE
export interface SocketPackageSendData extends SocketPackageBase {
  type: 'sendData';
  data: any;
}

// TODO: FURTHER ENHANCE TYPE
export interface SocketPackageReceiveData extends SocketPackageBase {
  type: 'receiveData';
  data: any;
}

export interface SocketPackageError extends SocketPackageBase {
  type: 'error';
  message: string;
  code?: number;
}

export interface SocketPackageMainDebug extends SocketPackageBase {
  type: 'mainDebug';
  debugInfo: string;
}

export interface SocketPackageExecuteNext extends SocketPackageBase {
  type: 'executeNext';
  command: string;
}

export interface SocketPackageSendDummyLinkedListData extends SocketPackageBase {
  type: 'sendDummyLinkedListData';
  linkedList: any[];
}

export interface SocketPackageSendDummyBinaryTreeData extends SocketPackageBase {
  type: 'sendDummyBinaryTreeData';
  binaryTree: any;
}

export interface SocketPackageSendFunctionDeclaration extends SocketPackageBase {
  type: 'sendFunctionDeclaration';
  functionCode: string;
}

export interface SocketPackageSendTypeDeclaration extends SocketPackageBase {
  type: 'sendTypeDeclaration';
  typeDef: string;
}

export interface SocketPackageSendBackendStateToUser extends SocketPackageBase {
  type: 'sendBackendStateToUser';
  state: any;
}

export interface SocketPackageSendStdoutToUser extends SocketPackageBase {
  type: 'sendStdoutToUser';
  output: string;
}

export interface SocketPackageProgramWaitingForInput extends SocketPackageBase {
  type: 'programWaitingForInput';
  inputRequired: boolean;
}

export interface SocketPackageCompileError extends SocketPackageBase {
  type: 'compileError';
  errors: string[];
}

export interface SocketPackageSendStdin extends SocketPackageBase {
  type: 'send_stdin';
  inputData: string;
}

export interface SocketPackageConnectError extends SocketPackageBase {
  type: 'connect_error';
}

export type SocketPackageConcrete =
  | SocketPackageConnect
  | SocketPackageDisconnect
  | SocketPackageSendData
  | SocketPackageReceiveData
  | SocketPackageError
  | SocketPackageMainDebug
  | SocketPackageExecuteNext
  | SocketPackageSendDummyLinkedListData
  | SocketPackageSendDummyBinaryTreeData
  | SocketPackageSendFunctionDeclaration
  | SocketPackageSendTypeDeclaration
  | SocketPackageSendBackendStateToUser
  | SocketPackageSendStdoutToUser
  | SocketPackageProgramWaitingForInput
  | SocketPackageCompileError
  | SocketPackageSendStdin
  | SocketPackageConnectError;

type ServerToClientEvents = {
  [s in SocketEventType]: SocketPackageConcrete;
};

interface ClientToServerEvents {
  mainDebug: (code: string) => void;
}

class SocketClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  get socketTempRemoveLater(): Socket {
    return this.socket;
  }

  constructor() {
    this.socket = io(URL, { path: '/socket.io/' });
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
        break;
      case 'sendDummyLinkedListData':
      case 'sendDummyBinaryTreeData':
      case 'sendData':
      case 'receiveData':
      case 'error':
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

  off(event: SocketEventType, callback: (data: any) => void) {
    this.socket.off(event, callback);
  }

  emitMainDebug(code: string) {
    this.socket.emit('mainDebug', code);
  }
}

interface SocketStore {
  socket: SocketClient;
}

const useSocketClientStore = create<SocketStore>(() => ({
  socket: new SocketClient(),
}));

export default useSocketClientStore;
