"use client";

import React, { useState, createContext, useContext } from "react";

type Connection = WebSocket | null;

export interface WebSocketProp {
  conn: WebSocket | null;
  setConn: (conn: WebSocket | null) => void;
}

export const WebsocketContext = createContext<{
  conn: Connection;
  setConn: (c: Connection) => void;
}>({
  conn: null,
  setConn: () => {},
});

export const useWebSocket = () => {
  return useContext(WebsocketContext);
};

const WebSocketProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [conn, setConn] = useState<Connection>(null);

  return (
    <WebsocketContext.Provider
      value={{
        conn: conn,
        setConn: setConn,
      }}
    >
      {children}
    </WebsocketContext.Provider>
  );
};

export default WebSocketProvider;
