"use client";

import { socket } from "@/lib/socket";
import { createContext, useContext } from "react";


const SocketContext = createContext(socket);

export const useSocket = () => useContext(SocketContext);
// SocketProvider component to wrap the app and provide the socket context
// to warps the app and provide the socket context to all components
export const SocketProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};