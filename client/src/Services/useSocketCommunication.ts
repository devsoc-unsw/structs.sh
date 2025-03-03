import { useCallback, useMemo, useState } from 'react';
import {
  BackendState,
  BackendTypeDeclaration,
  FunctionStructure,
  INITIAL_BACKEND_STATE,
  isProgramEnd,
  ProgramEnd,
} from '../visualiser-debugger/Types/backendType';
import useSocketClientStore from './socketClient';
import { ServerToClientEvent } from './socketClientType';
import { useGlobalStore } from '../visualiser-debugger/Store/globalStateStore';
import { useUserFsStateStore } from '../visualiser-debugger/Store/userFsStateStore';
import { useFrontendStateStore } from '../visualiser-debugger/Store/frontendStateStore';
import {
  DEFAULT_MESSAGE_DURATION,
  useToastStateStore,
} from '../visualiser-debugger/Store/toastStateStore';

export const useSocketCommunication = () => {
  const { updateNextFrame, updateTypeDeclaration, clearTypeDeclarations, clearUserAnnotation } =
    useGlobalStore();
  const { setActive } = useFrontendStateStore();
  const { clearFrontendState } = useFrontendStateStore();

  const { socketClient } = useSocketClientStore();
  const [activeSession] = useState<boolean>(false);
  const resetConsoleChunks = useGlobalStore((state) => state.resetConsoleChunks);
  const appendConsoleChunks = useGlobalStore((state) => state.appendConsoleChunks);
  const { updateCurrFocusedTab } = useGlobalStore();
  const { setToastMessage: setMessage } = useToastStateStore();

  useMemo(() => {
    const eventHandler: ServerToClientEvent = {
      mainDebug: (_data: 'Finished mainDebug event on server') => {
        setMessage({
          content: 'Debug session started.',
          colorTheme: 'info',
          durationMs: DEFAULT_MESSAGE_DURATION,
        });
        setActive(true);
      },
      sendFunctionDeclaration: (_data: FunctionStructure) => {},
      sendTypeDeclaration: (type: BackendTypeDeclaration) => {
        if (type.typeName === 'size_t') {
          return;
        }
        updateTypeDeclaration(type);
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
      programWaitingForInput: (_data: any) => {
        // Implement as needed
      },
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
    };

    socketClient.setupEventHandlers(eventHandler);
  }, []);

  const resetDebugSession = useCallback(() => {
    updateNextFrame(INITIAL_BACKEND_STATE);
    clearFrontendState();
    setActive(false);
    clearTypeDeclarations();
    clearUserAnnotation();
    resetConsoleChunks();
  }, []);

  const sendCode = useCallback(() => {
    resetDebugSession();
    const { fileSystem, currFocusFilePath } = useUserFsStateStore.getState();
    const file = fileSystem.getFileFromPath(currFocusFilePath);

    if (!file || file.path === 'root') {
      setMessage({
        content: 'No file being selected.',
        colorTheme: 'warning',
        durationMs: DEFAULT_MESSAGE_DURATION,
      });
      return;
    }
    socketClient.serverAction.initializeDebugSession(file.data);
  }, [socketClient]);

  const queue = useMemo(() => {
    let queuePromise: Promise<boolean | void> = Promise.resolve();
    return (fn: () => Promise<boolean>) => {
      queuePromise = queuePromise.then(fn);
      return queuePromise;
    };
  }, []);
  const executeNextWithRetry = useCallback(() => {
    const addEventListenerWithTimeout = (
      listener: (state: BackendState | null) => void,
      timeout: number
    ) => {
      let resolved = false;

      const wrappedListener = (state: BackendState) => {
        if (!resolved) {
          resolved = true;
          listener(state);
          socketClient.socket.off('sendBackendStateToUser', wrappedListener);
        }
      };

      socketClient.socket.on('sendBackendStateToUser', wrappedListener);

      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          listener(null);
          socketClient.socket.off('sendBackendStateToUser', wrappedListener);
        }
      }, timeout);
    };

    return queue(() => {
      return new Promise<boolean>((resolve) => {
        const handleBackendState = (state: BackendState | null) => {
          if (state) {
            resolve(true); // Resolve as success
          } else {
            resolve(false); // Resolve as failure due to timeout
          }
        };

        // Add the event listener with a timeout
        addEventListenerWithTimeout(handleBackendState, 5000);
        socketClient.serverAction.executeNext();
      });
    });
  }, [socketClient]);

  const bulkSendNextStates = useCallback(
    async (count: number) => {
      const results = await Promise.all(Array.from({ length: count }, executeNextWithRetry));
      const successfulCount = results.filter((result) => result).length;
      return successfulCount;
    },
    [executeNextWithRetry]
  );

  return {
    resetConsoleChunks,
    appendConsoleChunks,
    activeSession,
    sendCode,
    getNextState: executeNextWithRetry,
    bulkSendNextStates,
    resetDebugSession,
  };
};
