import {
  BackendState,
  BackendTypeDeclaration,
  FunctionStructure,
} from '../visualiser-debugger/Types/backendType';

// key in below object is used for socket.on as key
type ServerToClientEventsType = {
  mainDebug: 'Finished mainDebug event on server';
  sendFunctionDeclaration: FunctionStructure;
  sendTypeDeclaration: BackendTypeDeclaration;
  sendBackendStateToUser: BackendState;
  sendStdoutToUser: string;
  programWaitingForInput: any;
  compileError: string[];
  send_stdin: string;
  acknowledgedEOF: string;
  acknowledgedSIGINT: string;
};

export type ServerToClientEvent = {
  [E in keyof ServerToClientEventsType]: (data: ServerToClientEventsType[E]) => void;
};
