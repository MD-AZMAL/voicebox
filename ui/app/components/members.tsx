"use client";

import { useRoom } from "@/app/lib/context/room";
import { useWebSocket } from "@/app/lib/context/socket";
import { Message } from "@/app/lib/types";
import { useEffect, useState } from "react";

export default function Members() {
  const { roomName } = useRoom();
  const [members, setMembers] = useState<string[]>([]);
  const [speakingMember, setSpeakingMember] = useState<String>("");

  const { conn } = useWebSocket();

  useEffect(() => {
    console.log("Conn changed ", conn);

    if (conn) {
      conn.onmessage = (ev) => {
        console.log(ev, "ev");
        const data = JSON.parse(ev.data) as Message;

        if (data.messageType === "REGISTERED") {
          setMembers((prev) => [...prev, data.username]);
        }

        if (data.messageType === "UNREGISTERED") {
          setMembers((prev) => [...prev.filter((m) => m != data.username)]);
        }

        if (data.messageType === "STREAMAUDIO") {
          setSpeakingMember(data.username);
        }

        if (data.messageType === "MEMBERS") {
          const members = JSON.parse(data.content) as string[];

          const user = sessionStorage.getItem("username") || "";

          console.log(members);

          setMembers((prev) => [...members.filter((m) => m != user), ...prev]);
        }
      };
    }
  }, [conn]);

  useEffect(() => {
    if (!roomName) {
      setMembers([]);
    }
  }, [roomName]);

  return (
    <div className="flex-1 gap-6 grid grid-flow-col w-full">
      {members.length
        ? members.map((member) => (
            <div
              key={member}
              className="place-items-center grid bg-gray-500 rounded-lg w-full h-full"
            >
              <div
                className={`place-items-center grid ${
                  member === speakingMember ? "bg-green-300" : "bg-gray-400"
                }  ${
                  member === speakingMember ? "text-green-800" : ""
                } shadow-lg hover:shadow-2xl rounded-full w-[6rem] h-[6rem] cursor-pointer`}
              >
                <p>{member}</p>
              </div>
            </div>
          ))
        : roomName && (
            <div className="place-items-center grid">
              <p className="text-slate-300 text-sm">
                Waiting for people to join...
              </p>
            </div>
          )}
    </div>
  );
}
