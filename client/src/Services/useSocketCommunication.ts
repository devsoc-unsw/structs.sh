// TODO: FIX THE ANY TYPE WITH REF TO BACKEND!!!!
import { useCallback, useEffect, useState } from 'react';
import {
  BackendState,
  BackendTypeDeclaration,
  FunctionStructure,
  INITIAL_BACKEND_STATE,
} from '../visualiser-debugger/Types/backendType';
import useSocketClientStore from './socketClient';
import { EventHandlers } from './socketClientType';
import { useGlobalStore } from '../visualiser-debugger/Store/globalStateStore';

interface UseSocketCommunicationProps {
  updateNextFrame: (backendState: BackendState) => void;
  updateTypeDeclaration: (type: BackendTypeDeclaration) => void;
  clearTypeDeclarations: () => void;
  clearUserAnnotation: () => void;
}

export const useSocketCommunication = ({
  updateNextFrame,
  updateTypeDeclaration,
  clearTypeDeclarations,
  clearUserAnnotation,
}: UseSocketCommunicationProps) => {
  const { socketClient } = useSocketClientStore();
  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [consoleChunks, setConsoleChunks] = useState<string[]>([]);
  const { updateCurrFocusedTab } = useGlobalStore();

  useEffect(() => {
    const handlers: EventHandlers = {
      mainDebug: (data: 'Finished mainDebug event on server') => {
        console.error(data);
        setActiveSession(true);
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

    return () => {
      socketClient.clearEventHandlers(handlers);
    };
  }, [socketClient]);

  const resetDebugSession = useCallback(() => {
    updateNextFrame(INITIAL_BACKEND_STATE);
    setActiveSession(false);
    clearTypeDeclarations();
    clearUserAnnotation();
    setConsoleChunks([]);
  }, [updateNextFrame, clearTypeDeclarations, clearUserAnnotation]);

  const sendCode = useCallback(
    (fileSystem: any, currFocusFilePath: string) => {
      resetDebugSession();
      const file = fileSystem.getFileFromPath(currFocusFilePath);
      if (file) {
        console.log('Sending data:', file.data);
        socketClient.serverAction.initializeDebugSession(file.data);
      } else {
        throw new Error('File not found in FS');
      }
    },
    [resetDebugSession, socketClient]
  );

  const getNextState = useCallback(() => {
    socketClient.serverAction.executeNext();
  }, [socketClient]);

  return {
    activeSession,
    consoleChunks,
    setConsoleChunks,
    sendCode,
    getNextState,
    resetDebugSession,
  };
};
