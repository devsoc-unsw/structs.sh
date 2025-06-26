import { useCallback, useEffect, useState } from 'react';
import { BackendState, INITIAL_BACKEND_STATE } from '../visualiser-debugger/Types/backendType';
import useSocketClientStore from './socketClient';
import { useGlobalStore } from '../visualiser-debugger/Store/globalStateStore';
import { useUserFsStateStore } from '../visualiser-debugger/Store/userFsStateStore';
import { useFrontendStateStore } from '../visualiser-debugger/Store/frontendStateStore';
import {
  DEFAULT_MESSAGE_DURATION,
  useToastStateStore,
} from '../visualiser-debugger/Store/toastStateStore';
import { useQueue } from './useQueue';
import { buildSocketEventHandler } from './buildSocketEventHandler';

export const useSocketCommunication = () => {
  const {
    updateCurrFocusedTab,
    updateNextFrame,
    updateTypeDeclaration,
    clearTypeDeclarations,
    clearUserAnnotation,
    resetConsoleChunks,
    appendConsoleChunks,
  } = useGlobalStore();
  const { setActive, clearFrontendState } = useFrontendStateStore();
  const { socketClient } = useSocketClientStore();
  const [activeSession] = useState<boolean>(false);
  const { setToastMessage: setMessage } = useToastStateStore();
  const queue = useQueue();

  useEffect(() => {
    const eventHandler = buildSocketEventHandler({
      setActive,
      updateNextFrame,
      updateTypeDeclaration,
      appendConsoleChunks,
      updateCurrFocusedTab,
      setMessage,
    });

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
    // what is activeSession used for?
    activeSession,
    sendCode,
    getNextState: executeNextWithRetry,
    bulkSendNextStates,
    resetDebugSession,
  };
};
