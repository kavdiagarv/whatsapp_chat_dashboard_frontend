// src/socket.js
import { io } from "http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5173/";

// CHANGE this URL to your backend WebSocket server
const SOCKET_URL = "http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5173/"; 

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});