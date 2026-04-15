import {
  BackendState,
  BackendTypeDeclaration,
  FunctionStructure,
  isProgramEnd,
  ProgramEnd,
} from '@/visualiser-debugger/Types/backendType';
import { DEFAULT_MESSAGE_DURATION } from '@/visualiser-debugger/Store/toastStateStore';
import { ServerToClientEvent } from './socketClientType';

type BuildSocketHandlerParams = {
  setMessage: (msg: { content: string; colorTheme: string; durationMs: number }) => void;
  setActive: (active: boolean) => void;
  updateNextFrame: (state: BackendState) => void;
  updateTypeDeclaration: (type: BackendTypeDeclaration) => void;
  appendConsoleChunks: (chunks: string[]) => void;
  updateCurrFocusedTab: (tab: string) => void;
};

export const buildSocketEventHandler = ({
  setMessage,
  setActive,
  updateNextFrame,
  updateTypeDeclaration,
  appendConsoleChunks,
  updateCurrFocusedTab,
}: BuildSocketHandlerParams): ServerToClientEvent => ({
  mainDebug: () => {
    setMessage({
      content: 'Debug session started.',
      colorTheme: 'info',
      durationMs: DEFAULT_MESSAGE_DURATION,
    });
    setActive(true);
  },

  sendFunctionDeclaration: (_data: FunctionStructure) => {},

  sendTypeDeclaration: (type: BackendTypeDeclaration) => {
    if (type.typeName !== 'size_t') {
      updateTypeDeclaration(type);
    }
  },

  sendBackendStateToUser: (state: BackendState | ProgramEnd) => {
    if (isProgramEnd(state)) {
      setMessage({
        content: 'Debug session ended.',
        colorTheme: 'info',
        durationMs: DEFAULT_MESSAGE_DURATION,
      });
      setActive(false);
      return;
    }

    updateNextFrame(state);
  },

  sendStdoutToUser: (output: string) => {
    appendConsoleChunks([...output]);
  },

  programWaitingForInput: (_data: any) => {},

  acknowledgedEOF: () => {
    console.log('Debugger sent acknowledged EOF signal');
  },

  acknowledgedSIGINT: () => {
    console.log('Debugger sent acknowledged SIGINT signal');
  },

  compileError: (errors: string[]) => {
    appendConsoleChunks([...errors]);
    updateCurrFocusedTab('2');
  },

  send_stdin: (_data: string) => {},
});
