import { useState } from "react";

export default function usePlayAudio(audioContext: AudioContext) {
  const [startAt, setStartAt] = useState(0);

  const playAudio = (float64ArrayAsString: string) => {
    if (!float64ArrayAsString) return;
    const data = JSON.parse(float64ArrayAsString) as Float32Array;

    const source = audioContext.createBufferSource();

    const buffer = audioContext.createBuffer(1, data.length, 48000);
    buffer.getChannelData(0).set(data);

    source.buffer = buffer;

    source.connect(audioContext.destination);

    const newStartAt = Math.max(audioContext.currentTime, startAt);
    source.start(newStartAt);

    setStartAt((prev) => prev + newStartAt);
  };

  const resetStart = () => {
    setStartAt(0);
  };

  return { playAudio, resetStart, startAt, audioContext };
}
