"use client";

import { useRoom } from "@/app/lib/context/room";
import { useWebSocket } from "@/app/lib/context/socket";
import { Message } from "@/app/lib/types";
import { useEffect, useState } from "react";

export default function Members() {
  const { roomName } = useRoom();
  const [members, setMembers] = useState<string[]>([]);

  const { conn } = useWebSocket();

  const getInitialMembers = async (name: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/get-members?roomName=${name}`
      );

      const data = await res.json();

      console.log(data, "data");

      setMembers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Conn changed ", conn);

    if (conn) {
      conn.onmessage = (ev) => {
        console.log(ev, "ev");
        const data = JSON.parse(ev.data) as Message;
        console.log(data, "ev data");

        if (data.messageType === "REGISTERED") {
          setMembers((prev) => [data.username, ...prev]);
        }
      };
    }
  }, [conn]);

  useEffect(() => {
    if (roomName != "" && conn) {
      getInitialMembers(roomName);
    }
  }, [roomName]);

  return (
    <div className="flex-1 grid grid-flow-dense w-full">
      {members.map((member) => (
        <div key={member} className="bg-red-500">
          <p>{member}</p>
        </div>
      ))}
    </div>
  );
}
