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

interface Task {
  execute: Promise<boolean>;
  id: number;
}

let initialized = false;
export const useSocketCommunication = () => {
  const { updateNextFrame, updateTypeDeclaration, clearTypeDeclarations, clearUserAnnotation } =
    useGlobalStore();
  const { setActive } = useFrontendStateStore();
  const { clearFrontendState } = useFrontendStateStore();

  const { socketClient } = useSocketClientStore();
  const [consoleChunks, setConsoleChunks] = useState<string[]>([]);
  const { updateCurrFocusedTab } = useGlobalStore();

  const [taskQueue, setTaskQueue] = useState<Task[]>([]);
  const [taskId, setTaskId] = useState(0);

  if (!initialized) {
    const handlers: EventHandlers = {
      mainDebug: (_data: 'Finished mainDebug event on server') => {
        setActive(true);
      },
      sendFunctionDeclaration: (_data: FunctionStructure) => {},
      sendTypeDeclaration: (type: BackendTypeDeclaration) => {
        updateTypeDeclaration(type);
      },
      sendBackendStateToUser: (state: BackendState) => {
        updateNextFrame(state);

        // Complete a task
        const task = taskQueue.shift();
        if (task) task.execute.then(() => true);
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

    socketClient.setupEventHandlers(handlers);
    initialized = true;
  }

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
    setTaskId((prev) => prev + 1);

    const promise = new Promise<boolean>((resolve) => {
      const attemptExecution = () => {
        socketClient.serverAction.executeNext();

        let attempts = 0;
        const maxAttempts = 5;
        const intervalTime = 1000; // Check every second

        const waitForStateUpdate = () => {
          setTimeout(() => {
            if (attempts < maxAttempts) {
              attempts++;
              waitForStateUpdate();
            } else {
              resolve(false);
            }
          }, intervalTime);
        };

        waitForStateUpdate();
      };

      attemptExecution();
    });

    setTaskQueue((prev) => [...prev, { execute: promise, id: newId }]);
    return promise;
  }, [socketClient, taskId]);

  const bulkSendNextStates = useCallback(
    async (count: number) => {
      const newTasks = Array.from({ length: count }, () => executeNextWithRetry());
      await Promise.all(newTasks.map((task) => task.then()));
      const results = await Promise.all(newTasks);
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
