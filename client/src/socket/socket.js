import { io } from "socket.io-client";

const socket = io("https://soulmate-chat-server.onrender.com");

export default socket;