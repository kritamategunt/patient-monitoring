import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

socket.on("reconnect_attempt", (attempt) => {
  console.log(`Reconnection attempt ${attempt}`);
});

socket.on("reconnect_failed", () => {
  console.error("Reconnection failed");
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});