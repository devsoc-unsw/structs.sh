// socketClient.js
import { Socket, io } from 'socket.io-client';
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

interface ServerToClientEvents {
  connect: SocketPackageConnect;
  disconnect: SocketPackageDisconnect;
  sendData: SocketPackageSendData;
  receiveData: SocketPackageReceiveData;
  error: SocketPackageError;
  mainDebug: SocketPackageMainDebug;
  executeNext: SocketPackageExecuteNext;
  sendDummyLinkedListData: SocketPackageSendDummyLinkedListData;
  sendDummyBinaryTreeData: SocketPackageSendDummyBinaryTreeData;
  sendFunctionDeclaration: SocketPackageSendFunctionDeclaration;
  sendTypeDeclaration: SocketPackageSendTypeDeclaration;
  sendBackendStateToUser: SocketPackageSendBackendStateToUser;
  sendStdoutToUser: SocketPackageSendStdoutToUser;
  programWaitingForInput: SocketPackageProgramWaitingForInput;
  compileError: SocketPackageCompileError;
  send_stdin: SocketPackageSendStdin;
}

interface ClientToServerEvents {
  mainDebug: (code: string) => void;
}

class SocketClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    this.socket = io(URL);
  }

  onSendDummyData = (data: any) => {
    console.log(`Received dummy data:\n`, data);
    if (data !== 'LINE NOT FOUND') {
      updateState(data);
    } else {
      console.log('!!! No more dummy data');
    }
  };

  attach() {
    this.socket.on('sendDummyLinkedListData', onSendDummyData);
    this.socket.on('sendDummyBinaryTreeData', onSendDummyData);
    this.socket.on('mainDebug', onMainDebug);
    this.socket.on('sendFunctionDeclaration', onSendFunctionDeclaration);
    this.socket.on('sendTypeDeclaration', onSendTypeDeclaration);
    this.socket.on('executeNext', onExecuteNext);
    this.socket.on('sendBackendStateToUser', onSendBackendStateToUser);
    this.socket.on('sendStdoutToUser', onSendStdoutToUser);
    this.socket.on('programWaitingForInput', onProgramWaitingForInput);
    this.socket.on('compileError', onCompileError);
    this.socket.on('sendStdoutToUser', onStdout);
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

  on(event: SocketEventType, callback: (data: any) => void) {
    this.socket.on(event, callback);
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
