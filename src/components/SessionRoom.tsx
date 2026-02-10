import { useEffect, useMemo, useRef, useState } from "react";
import type { TranscriptLine } from "../lib/types";
import { getSystemPrompt } from "../lib/genai";

interface SessionRoomProps {
  apiKey: string | null;
  onComplete: (transcript: TranscriptLine[]) => void;
}

const visualizerBars = Array.from({ length: 12 }, (_, index) => index);

const SessionRoom = ({ apiKey, onComplete }: SessionRoomProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [liveText, setLiveText] = useState("");
  const [levels, setLevels] = useState<number[]>(visualizerBars.map(() => 12));
  const [liveStatus, setLiveStatus] = useState("Odpojeno");
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const promptPreview = useMemo(() => getSystemPrompt(), []);

  useEffect(() => {
    if (!isListening) {
      setLiveText("");
    }
  }, [isListening]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleStart = () => {
    if (!apiKey) {
      setLiveStatus("Chybí API klíč");
      return;
    }
    setIsListening(true);
    setIsSpeaking(false);
    setTranscript([]);
    setLiveText("Naslouchám oběma partnerům a sleduji tón konverzace...");
    setLiveStatus("Připojuji Live API...");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        const context = new AudioContext();
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        const source = context.createMediaStreamSource(stream);
        source.connect(analyser);
        audioContextRef.current = context;
        analyserRef.current = analyser;
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteFrequencyData(data);
          const chunkSize = Math.floor(data.length / visualizerBars.length);
          const next = visualizerBars.map((_, index) => {
            const start = index * chunkSize;
            const slice = data.slice(start, start + chunkSize);
            const avg = slice.reduce((sum, value) => sum + value, 0) / slice.length;
            return 12 + Math.round((avg / 255) * 60);
          });
          setLevels(next);
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
        setLiveStatus("Live API aktivní");
      })
      .catch(() => {
        setLiveStatus("Mikrofon není dostupný");
        setIsListening(false);
      });
  };

  const handleSimulatePartner = () => {
    setTranscript((prev) => [
      ...prev,
      { speaker: "partner", text: "Cítím se neviděný, když spolu nemluvíme večer." }
    ]);
  };

  const handleSimulateAmelia = () => {
    setIsSpeaking(true);
    setTranscript((prev) => [
      ...prev,
      {
        speaker: "amelia",
        text: "Slyším, že potřebujete více pozornosti. Zkuste popsat jeden konkrétní moment, kdy jste se cítili blízko."
      }
    ]);
    setTimeout(() => setIsSpeaking(false), 1200);
  };

  const handleStop = () => {
    setIsListening(false);
    setLiveStatus("Odpojeno");
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    audioContextRef.current?.close();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    onComplete(transcript);
  };

  const statusLabel = isSpeaking ? "Amelia mluví" : "Naslouchám";

  return (
    <section className="grid gap-6">
      <header className="rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Terapeutická místnost</h2>
            <p className="mt-2 text-sm text-slate-500">
              Obousměrný audio stream přes Live API (gemini-2.5-flash-native-audio-preview-12-2025).
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleStart}
              className="rounded-xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600"
            >
              Spustit live poslech
            </button>
            <button
              onClick={handleStop}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Ukončit sezení
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Status</h3>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              {statusLabel}
            </span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{liveStatus}</p>
          <div className="mt-6 flex h-32 items-end gap-2">
            {visualizerBars.map((bar) => (
              <div
                key={bar}
                className="w-4 rounded-full bg-indigo-600/80 transition-all"
                style={{
                  height: `${isSpeaking || isListening ? levels[bar] : 16}px`,
                  opacity: isSpeaking ? 1 : 0.4
                }}
              />
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            {liveText || "Real-time přepis se zobrazí zde během hovoru."}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSimulatePartner}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Přidat vstup partnera
            </button>
            <button
              onClick={handleSimulateAmelia}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Odpověď Amelie
            </button>
          </div>
        </div>

        <aside className="rounded-3xl bg-white p-8 shadow-soft">
          <h3 className="text-xl font-semibold">Instrukce pro Amelia AI</h3>
          <p className="mt-3 text-sm text-slate-500">
            Systémový prompt udržuje nestrannost a bezpečnost.
          </p>
          <pre className="mt-4 max-h-64 overflow-auto rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
            {promptPreview}
          </pre>
        </aside>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <h3 className="text-xl font-semibold">Transcript</h3>
        <div className="mt-6 grid gap-3">
          {transcript.length === 0 ? (
            <p className="text-sm text-slate-500">Zatím žádný přepis. Přidejte několik vět pro ukázku.</p>
          ) : (
            transcript.map((line, index) => (
              <div
                key={`${line.speaker}-${index}`}
                className={`max-w-xl rounded-2xl px-4 py-3 text-sm ${
                  line.speaker === "amelia"
                    ? "ml-auto bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {line.text}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SessionRoom;
