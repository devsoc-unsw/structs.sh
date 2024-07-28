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
      sendFunctionDeclaration: (data: any) => {
        console.log('Function Declaration:', data);
      },
      sendTypeDeclaration: (type: any) => {
        console.log('Type Declaration:', type);
        updateTypeDeclaration(type);
      },
      sendBackendStateToUser: (state: any) => {
        console.log('Backend State:', state);
        updateNextFrame(state);
      },
      sendStdoutToUser: (output: any) => {
        console.log('Stdout:', output);
        setConsoleChunks((prev) => [...prev, output]);
      },
      programWaitingForInput: (data: any) => console.log('Program Waiting for Input:', data),
      compileError: (errors: any) => {
        console.log('Compile Error:', errors);
        setConsoleChunks((prev) => [...prev, ...errors]);
        setTab('2');
      },
      send_stdin: (data: any) => console.log('Stdin Sent:', data),
    };

    socketClient.setupEventHandlers(handlers);

    return () => {
      socketClient.clearEventHandlers(handlers);
      socketClient.disconnect();
    };
  }, [socketClient, updateNextFrame, updateTypeDeclaration]);

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
