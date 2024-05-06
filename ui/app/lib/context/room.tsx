"use client";

import React, { useState, createContext, useContext } from "react";

export interface RoomProp {
  roomName: string;
  setRoomName: (v: string) => void;
}

export const RoomContext = createContext<RoomProp>({
  roomName: "",
  setRoomName: (v: string) => {},
});

export const useRoom = () => {
  return useContext(RoomContext);
};

const RoomProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [roomName, setRoomName] = useState<string>("");

  return (
    <RoomContext.Provider
      value={{
        roomName,
        setRoomName,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
