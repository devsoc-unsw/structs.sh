import { useCallback, useMemo, useState } from 'react';
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

interface Task {
  execute: Promise<boolean>;
  resolve: (result: boolean) => void;
  id: number;
}

export const useSocketCommunication = () => {
  const { updateNextFrame, updateTypeDeclaration, clearTypeDeclarations, clearUserAnnotation } =
    useGlobalStore();
  const { setActive } = useFrontendStateStore();
  const { clearFrontendState } = useFrontendStateStore();

  const { socketClient } = useSocketClientStore();
  const [consoleChunks, setConsoleChunks] = useState<string[]>([]);
  const { updateCurrFocusedTab } = useGlobalStore();

  const [, setTaskQueue] = useState<Task[]>([]);
  const [taskId, setTaskId] = useState(0);

  const handlers: EventHandlers = useMemo(() => {
    return {
      mainDebug: (_data: 'Finished mainDebug event on server') => {
        setActive(true);
      },
      sendFunctionDeclaration: (_data: FunctionStructure) => {},
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
        // Implement as needed
      },
      compileError: (errors: string[]) => {
        setConsoleChunks((prev) => [...prev, ...errors]);
        updateCurrFocusedTab('2');
      },
      send_stdin: (_data: string) => {},
    };
  }, []);
  socketClient.setupEventHandlers(handlers);

  const resetDebugSession = useCallback(() => {
    updateNextFrame(INITIAL_BACKEND_STATE);
    clearFrontendState();
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
      socketClient.serverAction.initializeDebugSession(file.data);
    } else {
      throw new Error('File not found in FS');
    }
  }, [socketClient]);

  const executeNextWithRetry = useCallback(() => {
    const newId = taskId;
    let resolveFunction: (result: boolean) => void;

    const promise = new Promise<boolean>((resolve) => {
      resolveFunction = resolve;
      socketClient.serverAction.executeNext();
      setTimeout(() => resolveFunction(false), 3000);
    });

    const task = { execute: promise, resolve: resolveFunction, id: newId };

    setTaskQueue((prevQueue) => [...prevQueue, task]);
    setTaskId((prev) => prev + 1);

    return promise;
  }, [socketClient, taskId, setTaskQueue]);

  const bulkSendNextStates = useCallback(
    async (count: number) => {
      const results = await Promise.all(Array.from({ length: count }, executeNextWithRetry));
      const successfulCount = results.filter((result) => result).length;

      console.log('Successful executions:', successfulCount);
      return successfulCount;
    },
    [executeNextWithRetry]
  );

  return {
    consoleChunks,
    setConsoleChunks,
    sendCode,
    getNextState: executeNextWithRetry,
    bulkSendNextStates,
    resetDebugSession,
  };
};
