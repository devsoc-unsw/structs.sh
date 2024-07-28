// TODO: FIX THE ANY TYPE WITH REF TO BACKEND!!!!
import { useCallback, useEffect, useState } from 'react';
import { BackendState, BackendTypeDeclaration } from '../visualiser-debugger/Types/backendType';
import useSocketClientStore from './socketClient';
import { EventHandlers } from './socketClientType';

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
  const { socket } = useSocketClientStore();
  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [consoleChunks, setConsoleChunks] = useState<string[]>([]);

  useEffect(() => {
    const handlers: EventHandlers = {
      connect: () => console.log('Socket connected'),
      disconnect: () => console.log('Socket disconnected'),
      connect_error: (error: any) => console.log('Connection Error:', error),
      sendData: (data: any) => console.log('Data sent:', data),
      receiveData: (data: any) => console.log('Data received:', data),
      error: (error: any) => console.log('Error:', error.message),
      mainDebug: (data: any) => {
        console.log('Main Debug:', data);
        updateNextFrame(data);
        setActiveSession(true);
      },
      executeNext: () => console.log('Execute next command issued'),
      sendDummyLinkedListData: (data: any) => console.log('Dummy LinkedList Data:', data),
      sendDummyBinaryTreeData: (data: any) => console.log('Dummy Binary Tree Data:', data),
      sendFunctionDeclaration: (data: any) => {
        console.log('Function Declaration:', data);
        // Optional: Handle function declarations if needed
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
      },
      send_stdin: (data: any) => console.log('Stdin Sent:', data),
    };

    socket.setupEventHandlers(handlers);

    return () => {
      socket.clearEventHandlers(handlers);
      socket.disconnect();
    };
  }, [socket, updateNextFrame, updateTypeDeclaration]);

  const resetDebugSession = useCallback(() => {
    updateNextFrame({} as BackendState);
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
        socket.emit('mainDebug', file.data);
      } else {
        throw new Error('File not found in FS');
      }
    },
    [resetDebugSession, socket]
  );

  const getNextState = useCallback(() => {
    socket.emit('executeNext');
  }, [socket]);

  return {
    activeSession,
    consoleChunks,
    setConsoleChunks,
    sendCode,
    getNextState,
    resetDebugSession,
  };
};
