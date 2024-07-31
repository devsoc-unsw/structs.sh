interface SocketServerType {
  mainDebug: (debugInfo: string) => void;
  executeNext: () => void;
}

export default SocketServerType;
