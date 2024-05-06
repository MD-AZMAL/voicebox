"use client";

import Member from "@/app/components/member";
import { useRoom } from "@/app/lib/context/room";
import { useWebSocket } from "@/app/lib/context/socket";
import { Message } from "@/app/lib/types";
import { RefObject, createRef, useEffect, useState } from "react";

export default function Members() {
  const { roomName } = useRoom();
  const [members, setMembers] = useState<string[]>([]);
  const [speakingMember, setSpeakingMember] = useState<{
    [key: string]: boolean;
  }>({});

  const [audioRef, setAudioRef] = useState<{
    [key: string]: RefObject<HTMLAudioElement>;
  }>({});

  const [memberAudio, setMemberAudio] = useState<{
    [key: string]: string;
  }>({});

  const { conn } = useWebSocket();

  useEffect(() => {
    if (conn) {
      conn.onmessage = async (ev) => {
        const data = JSON.parse(ev.data) as Message;

        if (data.messageType === "REGISTERED") {
          setMembers((prev) => [...prev, data.username]);
        }

        if (data.messageType === "UNREGISTERED") {
          setMembers((prev) => [...prev.filter((m) => m != data.username)]);
        }

        if (data.messageType === "MICSTARTED") {
          setSpeakingMember((prev) => ({ ...prev, [data.username]: true }));
        }

        if (data.messageType === "MICMUTED") {
          setSpeakingMember((prev) => ({ ...prev, [data.username]: false }));
        }

        if (data.messageType === "MEMBERS") {
          const user = sessionStorage.getItem("username") || "";

          const members = JSON.parse(data.content) as string[];

          setMembers((prev) => [...members.filter((m) => m != user), ...prev]);
        }

        if (data.messageType === "STREAMAUDIO") {
          const member = data.username;

          setMemberAudio((prev) => ({
            ...prev,
            [member]: data.content as string,
          }));
        }
      };
    }
  }, [conn]);

  useEffect(() => {
    members.forEach((member) => {
      if (!audioRef[member]) {
        setAudioRef((prev) => ({
          ...prev,
          [member]: createRef<HTMLAudioElement>(),
        }));
      }
    });
  }, [members]);

  useEffect(() => {
    if (!roomName) {
      setMembers([]);
    }
  }, [roomName]);

  return (
    <div className="flex-1 gap-6 grid grid-flow-col w-full">
      {members.length
        ? members.map((member) => (
            <Member
              key={`members-list-${member}`}
              member={member}
              isSpeaking={speakingMember[member]}
              audioChunk={memberAudio[member]}
            />
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
