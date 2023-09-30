import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_DEBUGGER_URL;

export const socket = io(URL);
