// src/socket.js
import { io } from "http://ecofyndsupport.platinum-infotech.com:5173/";

// CHANGE this URL to your backend WebSocket server
const SOCKET_URL = "http://ecofyndsupport.platinum-infotech.com:5173/"; 

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});