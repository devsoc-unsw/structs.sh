import { io } from "socket.io-client";

const URL = "http://localhost:8000";

export const socket = io(URL);
