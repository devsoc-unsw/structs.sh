import { useCallback, useEffect } from 'react';
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
  const { setToastMessage } = useToastStateStore();
  const queue = useQueue();

  // Setup socket event handlers on mount
  useEffect(() => {
    console.log('usesocketcom is mounted');

    // can remove the intialise() from below or leave it
    if (!socketClient) {
      // initialise();
      return;
    }

    const handlers = buildSocketEventHandler({
      setActive,
      updateNextFrame,
      updateTypeDeclaration,
      appendConsoleChunks,
      updateCurrFocusedTab,
      setMessage: setToastMessage,
    });

    socketClient.setupEventHandlers(handlers);
  }, [socketClient]); // ask what this means i think before was only socketClient dependency

  // reset entire debuggin session
  const resetDebugSession = useCallback(() => {
    updateNextFrame(INITIAL_BACKEND_STATE);
    clearFrontendState();
    setActive(false);
    clearTypeDeclarations();
    clearUserAnnotation();
    resetConsoleChunks();
  }, [
    updateNextFrame,
    clearFrontendState,
    setActive,
    clearTypeDeclarations,
    clearUserAnnotation,
    resetConsoleChunks,
  ]); // ask why you do this? before was empty dependency

  // error hadnler for sending code
  const handleSendCodeError = () => {
    setToastMessage({
      content: 'No file being selected',
      colorTheme: 'warning',
      durationMs: DEFAULT_MESSAGE_DURATION,
    });
  };

  // send code to backend to start debugging session
  const sendCode = useCallback(() => {
    if (!socketClient) return;

    resetDebugSession();

    const { fileSystem, currFocusFilePath } = useUserFsStateStore.getState();
    const file = fileSystem.getFileFromPath(currFocusFilePath);

    if (!file || file.path === 'root') {
      handleSendCodeError();
      return;
    }

    socketClient.serverAction.initializeDebugSession(file.data);
  }, [socketClient, resetDebugSession]); // ask why you put resetDebugSession in here as dependency

  // add event listener with timeout
  const addEventListenerWithTimeout = (
    listener: (state: BackendState | null) => void,
    timeout: number
  ) => {
    if (!socketClient) return;

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

  // step debugger and wait for backend to respond
  const executeNextWithRetry = useCallback(() => {
    if (!socketClient) return Promise.resolve(false);

    return queue(() => {
      return new Promise<boolean>((resolve) => {
        const handleBackendState = (state: BackendState | null) => {
          // if (state) {
          //   resolve(true); // Resolve as success
          // } else {
          //   resolve(false); // Resolve as failure due to timeout
          // } before was this
          resolve(!!state); // what this means?
        };

        addEventListenerWithTimeout(handleBackendState, 5000);
        socketClient.serverAction.executeNext();
      });
    });
  }, [socketClient, queue]); // why do i add queue here?

  // to call multiple next states in bulk
  const bulkSendNextStates = useCallback(
    async (count: number) => {
      const results = await Promise.all(
        Array.from({ length: count }, () => executeNextWithRetry())
      );
      // return results.filter((result) => result).length;
      // return successfulCount;
      return results.filter(Boolean).length; // whats happening?
    },
    [executeNextWithRetry]
  );

  return {
    resetConsoleChunks, // Clear console logs
    appendConsoleChunks, // Append logs
    sendCode, // Start session with file
    getNextState: executeNextWithRetry, // Step once
    bulkSendNextStates, // Step multiple times
    resetDebugSession, // Full reset
  };
};
