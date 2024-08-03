import { useCallback, useState } from 'react';
import {
  BackendState,
  BackendTypeDeclaration,
  FunctionStructure,
  INITIAL_BACKEND_STATE,
} from '../visualiser-debugger/Types/backendType';
import useSocketClientStore from './socketClient';
import { EventHandlers } from './socketClientType';
import { useGlobalStore } from '../visualiser-debugger/Store/globalStateStore';
import { useUserFsStateStore } from '../visualiser-debugger/Store/userFsStateStore';
import { useFrontendStateStore } from '../visualiser-debugger/Store/frontendStateStore';

let initialized = false;
export const useSocketCommunication = () => {
  const { updateNextFrame, updateTypeDeclaration, clearTypeDeclarations, clearUserAnnotation } =
    useGlobalStore();
  const { setActive } = useFrontendStateStore();

  const { socketClient } = useSocketClientStore();
  const [consoleChunks, setConsoleChunks] = useState<string[]>([]);
  const { updateCurrFocusedTab } = useGlobalStore();

  if (!initialized) {
    const handlers: EventHandlers = {
      mainDebug: (data: 'Finished mainDebug event on server') => {
        console.error(data);
        setActive(true);
      },
      sendFunctionDeclaration: (data: FunctionStructure) => {
        // TODO: Implement
        console.error('Received functional structure', data);
      },
      sendTypeDeclaration: (type: BackendTypeDeclaration) => {
        updateTypeDeclaration(type);
      },
      sendBackendStateToUser: (state: BackendState) => {
        updateNextFrame(state);
      },
      sendStdoutToUser: (output: string) => {
        setConsoleChunks((prev) => [...prev, output]);
      },
      programWaitingForInput: (_data: any) => {
        // TODO: Implement, to Hindie, might give a popup message to user?
      },
      compileError: (errors: string[]) => {
        setConsoleChunks((prev) => [...prev, ...errors]);
        updateCurrFocusedTab('2');
      },
      send_stdin: (data: string) => console.log('Stdin Sent:', data),
    };

    socketClient.setupEventHandlers(handlers);
    initialized = true;
  }

  const resetDebugSession = useCallback(() => {
    updateNextFrame(INITIAL_BACKEND_STATE);
    setActive(false);
    clearTypeDeclarations();
    clearUserAnnotation();
    setConsoleChunks([]);
  }, []);

  const sendCode = useCallback(() => {
    resetDebugSession();
    const { fileSystem, currFocusFilePath } = useUserFsStateStore.getState();
    const file = fileSystem.getFileFromPath(currFocusFilePath);
    if (file) {
      console.log('Sending data:', file.data);
      socketClient.serverAction.initializeDebugSession(file.data);
    } else {
      throw new Error('File not found in FS');
    }
  }, [socketClient]);

  const getNextState = useCallback(() => {
    socketClient.serverAction.executeNext();
  }, [socketClient]);

  const bulkSendNextStates = useCallback(
    (count: number) => {
      for (let i = 0; i < count; i++) {
        getNextState();
      }
    },
    [getNextState]
  );

  return {
    consoleChunks,
    setConsoleChunks,
    sendCode,
    getNextState,
    bulkSendNextStates,
    resetDebugSession,
  };
};
