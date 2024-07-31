import {
  BackendState,
  BackendTypeDeclaration,
  FunctionStructure,
} from '../visualiser-debugger/Types/backendType';

// key in below object is used for socket.on as key
export type ServerToClientEvents = {
  mainDebug: 'Finished mainDebug event on server';
  sendFunctionDeclaration: FunctionStructure;
  sendTypeDeclaration: BackendTypeDeclaration;
  sendBackendStateToUser: BackendState;
  sendStdoutToUser: string;
  programWaitingForInput: any;
  compileError: string[];
  send_stdin: string;
};

export type EventHandlers = {
  [E in keyof ServerToClientEvents]: (data: ServerToClientEvents[E]) => void;
};
