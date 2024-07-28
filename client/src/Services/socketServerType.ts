export interface ClientToServerEvents {
  mainDebug: (debugInfo: string) => void;
  executeNext: () => void;
  send_stdin: (data: any) => void;
}
