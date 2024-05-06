"use client";

import { useWebSocket } from "@/app/lib/context/socket";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export default function Microphone() {
  const { conn } = useWebSocket();

  const [isMute, setIsMute] = useState<Boolean>(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaStreamSource, setMediaStreamSource] =
    useState<MediaStreamAudioSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMute = () => {
    setIsMute((prev) => !prev);
  };

  const handleClick = () => {
    if (conn && conn.OPEN) {
      conn.send(
        JSON.stringify({
          messageType: "STREAMAUDIO",
          content: "asd",
          roomName: "test",
          username: localStorage.getItem("username"),
        })
      );
    }
  };

  const handleMicStart = async () => {
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, frameRate: 120 },
    });

    // const mediaRecorder = new MediaRecorder(micStream);

    // mediaRecorder.start(10);

    // // Start recording when data is available
    // mediaRecorder.ondataavailable = function (event) {
    //   if (event.data.size > 0) {
    //     // Send data to the server via WebSocket
    //     console.log("blog event : ", event.data);

    //     const audioBlob = new Blob([event.data], {
    //       type: "audio/webm;codecs=opus;",
    //     });

    //     const audioUrl = URL.createObjectURL(audioBlob);

    //     console.log(audioBlob);

    //     if (audioRef.current) {
    //       audioRef.current.src = audioUrl;
    //       audioRef.current.autoplay = true;
    //     }
    //   }
    // };

    setMediaStream(micStream);

    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode =
      audioContext.createMediaStreamSource(micStream);

    setMediaStreamSource(mediaStreamAudioSourceNode);

    const delayNode = new DelayNode(audioContext, { delayTime: 1 });

    mediaStreamAudioSourceNode.connect(delayNode);
    mediaStreamAudioSourceNode.connect(audioContext.destination);

    // if (audioRef.current) {
    //   audioRef.current.srcObject = micStream;
    //   audioRef.current.autoplay = true;
    // }
  };

  const handleMicStop = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }

    if (mediaStreamSource) {
      mediaStreamSource.disconnect();
      setMediaStreamSource(null);
    }
  };

  useEffect(() => {
    if (audioRef) {
      if (!isMute) {
        handleMicStart();
      } else {
        handleMicStop();
      }
    }
  }, [isMute]);
  return (
    <>
      <audio ref={audioRef} className="hidden"></audio>
      <Button
        className="place-items-center grid shadow-lg hover:shadow-2xl rounded-full w-[6rem] h-[6rem] cursor-pointer"
        onClick={toggleMute}
      >
        {!isMute ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icon-tabler-microphone icons-tabler-outline"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <path d="M8 21l8 0" />
            <path d="M12 17l0 4" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icon-tabler-microphone-off icons-tabler-outline"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 3l18 18" />
            <path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -.13 .874m-2 2a3 3 0 0 1 -3.87 -2.872v-1" />
            <path d="M5 10a7 7 0 0 0 10.846 5.85m2 -2a6.967 6.967 0 0 0 1.152 -3.85" />
            <path d="M8 21l8 0" />
            <path d="M12 17l0 4" />
          </svg>
        )}
      </Button>
      <Button onClick={handleClick}>
        send Random Message{" "}
        {(localStorage && localStorage.getItem("username")) || ""}
      </Button>
    </>
  );
}
