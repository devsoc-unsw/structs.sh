import { io } from 'socket.io-client';

const URL = 'http://localhost:8001';

export const socket = io(URL);
