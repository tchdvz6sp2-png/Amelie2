export const decodeBase64ToPCM16 = (base64: string): Int16Array => {
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i += 1) {
    view[i] = binary.charCodeAt(i);
  }
  return new Int16Array(buffer);
};

export const encodePCM16ToBase64 = (pcm: Int16Array): string => {
  const bytes = new Uint8Array(pcm.buffer);
  let binary = "";
  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });
  return btoa(binary);
};

export const scheduleAudioChunk = (
  context: AudioContext,
  buffer: AudioBuffer,
  nextStartTime: number
): number => {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  const startTime = Math.max(nextStartTime, context.currentTime + 0.02);
  source.start(startTime);
  return startTime + buffer.duration;
};

export const decodeAndPlayChunk = async (
  context: AudioContext,
  arrayBuffer: ArrayBuffer,
  nextStartTime: number
): Promise<number> => {
  const decoded = await context.decodeAudioData(arrayBuffer.slice(0));
  return scheduleAudioChunk(context, decoded, nextStartTime);
};
