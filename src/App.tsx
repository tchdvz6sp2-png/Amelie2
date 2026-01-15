import { useEffect, useMemo, useState } from "react";
import Dashboard from "./components/Dashboard";
import OnboardingForm from "./components/OnboardingForm";
import SessionRoom from "./components/SessionRoom";
import SummaryView from "./components/SummaryView";
import { analyzeTranscript } from "./lib/genai";
import { loadHistory, loadProfile, saveHistory, saveProfile } from "./lib/storage";
import type { SessionSummary, TranscriptLine, UserProfile } from "./lib/types";

const buildTranscriptText = (lines: TranscriptLine[]) =>
  lines.map((line) => `${line.speaker === "amelia" ? "Amelia" : "Partner"}: ${line.text}`).join("\n");

const mockSummary: SessionSummary = {
  id: "mock-session",
  date: new Date().toISOString(),
  topic: "Návrat k večerní blízkosti",
  summary: "Pár se shodl, že potřebují více času bez obrazovek a konkrétní rituál před spaním.",
  insights: [
    "Kritika se objevuje při únavě a lze ji nahradit konkrétní žádostí.",
    "Krátké ocenění na konci dne pomáhá snižovat napětí."
  ],
  homework: "Každý večer si řekněte jednu věc, kterou na partnerovi oceňujete.",
  sentiment: "positive"
};

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as { MSStream?: unknown }).MSStream;

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone);

const isIframe = () => window.self !== window.top;

const App = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<SessionSummary[]>([]);
  const [view, setView] = useState<"onboarding" | "dashboard" | "session" | "summary">("onboarding");
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  useEffect(() => {
    const savedProfile = loadProfile();
    const savedHistory = loadHistory();
    if (savedProfile) {
      setProfile(savedProfile);
      setView("dashboard");
    }
    setHistory(savedHistory);
  }, []);

  const latestHomework = useMemo(() => history[0]?.homework, [history]);

  const handleOnboardingComplete = (data: UserProfile) => {
    saveProfile(data);
    setProfile(data);
    setView("dashboard");
  };

  const handleSessionComplete = async (lines: TranscriptLine[]) => {
    const text = buildTranscriptText(lines);
    const analysis = await analyzeTranscript(text);
    const newSummary = analysis ?? {
      ...mockSummary,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };
    const updatedHistory = [newSummary, ...history];
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
    setSummary(newSummary);
    setView("summary");
  };

  const headerGreeting = profile
    ? `Amelia AI • ${profile.partnerA} & ${profile.partnerB}`
    : "Amelia AI";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <nav className="flex items-center justify-between text-sm text-slate-500">
          <span className="font-semibold uppercase tracking-[0.2em] text-slate-400">{headerGreeting}</span>
          <span>Private by design · localStorage only</span>
        </nav>

        {isIframe() && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Aplikace běží v iframe. Pro plnou podporu audio streamu doporučujeme otevřít ji v nové záložce.
          </div>
        )}

        {isIOS() && !isStandalone() && (
          <div className="rounded-2xl border border-indigo-100 bg-white p-4 text-sm text-slate-600">
            Pro nejlepší zážitek na iPhonu klepněte na <strong>Sdílet</strong> → <strong>Přidat na plochu</strong>.
          </div>
        )}

        {view === "onboarding" && <OnboardingForm onComplete={handleOnboardingComplete} />}
        {view === "dashboard" && profile && (
          <Dashboard
            profile={profile}
            history={history}
            homework={latestHomework}
            onStartSession={() => setView("session")}
          />
        )}
        {view === "session" && <SessionRoom onComplete={handleSessionComplete} />}
        {view === "summary" && summary && <SummaryView summary={summary} onBack={() => setView("dashboard")} />}
      </div>
    </div>
  );
};

export default App;
