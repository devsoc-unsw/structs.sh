export type SocketEventType =
  | 'connect_error'
  | 'sendData'
  | 'receiveData'
  | 'error'
  | 'mainDebug'
  | 'executeNext'
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

// TODO: FURTHER ENHANCE TYPE

export interface SocketPackageMainDebug extends SocketPackageBase {
  type: 'mainDebug';
  debugInfo: string;
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
  | SocketPackageMainDebug
  | SocketPackageSendFunctionDeclaration
  | SocketPackageSendTypeDeclaration
  | SocketPackageSendBackendStateToUser
  | SocketPackageSendStdoutToUser
  | SocketPackageProgramWaitingForInput
  | SocketPackageCompileError
  | SocketPackageSendStdin
  | SocketPackageConnectError;

export type ServerToClientEvents = {
  mainDebug: SocketPackageMainDebug;
  sendFunctionDeclaration: SocketPackageSendFunctionDeclaration;
  sendTypeDeclaration: SocketPackageSendTypeDeclaration;
  sendBackendStateToUser: SocketPackageSendBackendStateToUser;
  sendStdoutToUser: SocketPackageSendStdoutToUser;
  programWaitingForInput: SocketPackageProgramWaitingForInput;
  compileError: SocketPackageCompileError;
  send_stdin: SocketPackageSendStdin;
};

export type EventHandlers = {
  [E in keyof ServerToClientEvents]: (data: ServerToClientEvents[E]) => void;
};
