// TODO: FIX THE ANY TYPE WITH REF TO BACKEND!!!!
import { useCallback, useEffect, useState } from 'react';
import {
  BackendState,
  BackendTypeDeclaration,
  INITIAL_BACKEND_STATE,
} from '../visualiser-debugger/Types/backendType';
import useSocketClientStore from './socketClient';
import { EventHandlers } from './socketClientType';

interface UseSocketCommunicationProps {
  updateNextFrame: (backendState: BackendState) => void;
  updateTypeDeclaration: (type: BackendTypeDeclaration) => void;
  clearTypeDeclarations: () => void;
  clearUserAnnotation: () => void;
  setTab: (tab: string) => void;
}

export const useSocketCommunication = ({
  updateNextFrame,
  updateTypeDeclaration,
  clearTypeDeclarations,
  clearUserAnnotation,
  setTab,
}: UseSocketCommunicationProps) => {
  const { socketClient } = useSocketClientStore();
  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [consoleChunks, setConsoleChunks] = useState<string[]>([]);

  useEffect(() => {
    const handlers: EventHandlers = {
      mainDebug: (_data: any) => {
        setActiveSession(true);
      },
      sendFunctionDeclaration: (_data: any) => {
        // TODO: Implement
      },
      sendTypeDeclaration: (type: any) => {
        updateTypeDeclaration(type);
      },
      sendBackendStateToUser: (state: any) => {
        updateNextFrame(state);
      },
      sendStdoutToUser: (output: any) => {
        setConsoleChunks((prev) => [...prev, output]);
      },
      programWaitingForInput: (_data: any) => {
        // TODO: Implement
      },
      compileError: (errors: any) => {
        setConsoleChunks((prev) => [...prev, ...errors]);
        setTab('2');
      },
      send_stdin: (data: any) => console.log('Stdin Sent:', data),
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
