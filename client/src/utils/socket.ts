import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_DEBUGGER_URL || "http://localhost:8000";

export const socket = io(URL);
