// socketClient.js
import { Socket, io } from 'socket.io-client';
import { DefaultEventsMap, EventNames, EventsMap } from '@socket.io/component-emitter';
import { create } from 'zustand';

const URL = import.meta.env.VITE_DEBUGGER_URL || 'http://localhost:8000';

export type SocketEventType =
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
  | SocketPackageSendStdin;

class SocketClient {
  private socket: Socket<DefaultEventsMap>;

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

  on<T extends SocketEventType>(event: T) {
    this.socket.on(event, () => {
      console.log('Connected socket');
    });
  }

  off<T extends SocketEventType>(event: T) {
    this.socket.off(event, () => {
      callback(data);
    });
  }

  emit<T extends SocketEventType>(event: T, data?: SocketPackageConcrete) {
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
