"use client";

import usePlayAudio from "@/app/hooks/usePlayAudio";
import { useEffect } from "react";

export default function Member({
  member,
  isSpeaking,
  audioChunk,
}: {
  member: string;
  isSpeaking: boolean;
  audioChunk: string;
}) {
  const { playAudio, resetStart } = usePlayAudio(new AudioContext());

  useEffect(() => {
    playAudio(audioChunk);
  }, [audioChunk]);

  useEffect(() => {
    if (!isSpeaking) resetStart();
  }, [isSpeaking]);

  return (
    <div
      key={member}
      className="place-items-center grid bg-gray-500 rounded-lg w-full h-full"
    >
      <div
        className={`place-items-center grid ${
          isSpeaking ? "bg-green-300" : "bg-gray-400"
        }  ${
          isSpeaking ? "text-green-800" : ""
        } shadow-lg hover:shadow-2xl rounded-full w-[6rem] h-[6rem] cursor-pointer`}
      >
        <p>{member}</p>
      </div>
    </div>
  );
}
