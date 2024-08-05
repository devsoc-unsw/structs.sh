import { useCallback, useState, useEffect } from 'react';
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
  const { clearFrontendState } = useFrontendStateStore();

  const { socketClient } = useSocketClientStore();
  const [consoleChunks, setConsoleChunks] = useState<string[]>([]);
  const { updateCurrFocusedTab } = useGlobalStore();

  const [taskQueue, setTaskQueue] = useState<(() => Promise<void>)[]>([]);
  const [activeTasks, setActiveTasks] = useState<number>(0);
  const maxConcurrentTasks = 10;

  if (!initialized) {
    const handlers: EventHandlers = {
      mainDebug: (data: 'Finished mainDebug event on server') => {
        console.error(data);
        setActive(true);
      },
      sendFunctionDeclaration: (data: FunctionStructure) => {
        console.error('Received functional structure', data);
      },
      sendTypeDeclaration: (type: BackendTypeDeclaration) => {
        updateTypeDeclaration(type);
      },
      sendBackendStateToUser: (state: BackendState) => {
        updateNextFrame(state);
        setActiveTasks((prev) => prev - 1);
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
      send_stdin: (data: string) => console.log('Stdin Sent:', data),
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
      console.log('Sending data:', file.data);
      socketClient.serverAction.initializeDebugSession(file.data);
    } else {
      throw new Error('File not found in FS');
    }
  }, [socketClient]);

  const executeNextWithRetry = useCallback(() => {
    return new Promise<void>((resolve) => {
      const attemptExecution = () => {
        socketClient.serverAction.executeNext();

        let attempts = 0;
        const maxAttempts = 5;

        const waitForStateUpdate = () => {
          setTimeout(() => {
            if (attempts < maxAttempts) {
              attempts++;
              waitForStateUpdate();
            } else {
              console.error(
                new Error('State update failed to complete after multiple attempts. Retrying...')
              );
              resolve();
            }
          }, 500);
        };

        waitForStateUpdate();
      };

      attemptExecution();
    });
  }, [socketClient]);

  const processQueue = useCallback(() => {
    if (taskQueue.length > 0 && activeTasks < maxConcurrentTasks) {
      const task = taskQueue.shift();
      if (task) {
        setActiveTasks((prev) => prev + 1);
        task().then(() => {
          setActiveTasks((prev) => prev - 1);
          processQueue(); // Process the next task in the queue
        });
      }
    }
  }, [taskQueue, activeTasks]);

  useEffect(() => {
    processQueue();
  }, [taskQueue, activeTasks]);

  const bulkSendNextStates = useCallback(
    (count: number) => {
      const tasks = Array.from({ length: count }, () => executeNextWithRetry);
      setTaskQueue((prev) => [...prev, ...tasks]);
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
