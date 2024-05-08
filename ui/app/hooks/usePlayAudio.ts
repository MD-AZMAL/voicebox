import { base64ToUint8Array } from "@/app/utils/stringUtil";
import { useEffect, useState } from "react";

export default function usePlayAudio() {
  const [chunk, setChunk] = useState("data:audio/webm;codecs=opus;base64,");

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    const src = ctx.createBufferSource();

    setAudioContext(ctx);
    setSource(src);
  }, []);

  const playAudio = (base64: string) => {
    if (!base64) return;

    let binaryData;

    try {
      binaryData = atob(base64.split(",")[1]);
    } catch (error) {
      const base64WithoutHeader = base64.split(",")[1];
      setChunk(
        (prev) => prev + (base64WithoutHeader ? base64WithoutHeader : "")
      );
      return;
    }

    const uint8Array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    // if (!audioContext || !source) return;
    if (!audioContext) return;

    audioContext
      .decodeAudioData(uint8Array.buffer)
      .then((audioBuffer) => {
        let nextTime = 0;
        console.log("audiContext ", chunk);

        setChunk("data:audio/webm;codecs=opus;base64,");

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        console.log("NExt time ", nextTime);

        const currentTime = audioContext.currentTime;
        if (nextTime < currentTime) {
          nextTime = currentTime;
          console.log("NExt time < currentTime", nextTime);
        }

        source.start(nextTime);
        nextTime += source.buffer.duration;
        console.log("updated next time ", nextTime);

        source.connect(audioContext.destination);
      })
      .catch((error) => {
        console.log("not playable appending to chunk");

        const base64WithoutHeader = base64.split(",")[1];
        setChunk(
          (prev) => prev + (base64WithoutHeader ? base64WithoutHeader : "")
        );
      });
  };

  return { playAudio };
}
