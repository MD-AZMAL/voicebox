export function playAudio(base64Data: string) {
  if (!base64Data) return;

  console.log(base64Data);

  const audioContext = new AudioContext();

  let nextTime = 0;

  const binaryData = atob(base64Data.split(",")[1]);

  const uint8Array = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  audioContext
    .decodeAudioData(uint8Array.buffer)
    .then((audioBuffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const currentTime = audioContext.currentTime;
      if (nextTime < currentTime) {
        nextTime = currentTime;
      }
      source.start(nextTime);
      nextTime += source.buffer.duration;

      source.connect(audioContext.destination);
    })
    .catch((error) => {
      console.error("Error decoding audio data:", error);
    });
}
