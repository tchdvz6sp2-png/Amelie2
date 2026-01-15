import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SessionSummary, UserProfile } from "../lib/types";

const mockChart = [
  { name: "Po", value: 62 },
  { name: "Út", value: 68 },
  { name: "St", value: 60 },
  { name: "Čt", value: 72 },
  { name: "Pá", value: 70 }
];

const sentimentIcon: Record<SessionSummary["sentiment"], string> = {
  positive: "💙",
  neutral: "🤍",
  critical: "💗"
};

interface DashboardProps {
  profile: UserProfile;
  history: SessionSummary[];
  homework?: string;
  onStartSession: () => void;
}

const Dashboard = ({ profile, history, homework, onStartSession }: DashboardProps) => {
  const recentSessions = history.slice(0, 4);
  const latestHomework = homework ?? "Zkuste si dnes vyhradit 10 minut na jemné ocenění partnera.";

  return (
    <section className="grid gap-8">
      <header className="rounded-3xl bg-white p-10 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold">Dobrý den, {profile.partnerA} & {profile.partnerB}</h1>
            <p className="mt-2 text-lg text-slate-600">
              Amelia sleduje váš emocionální soulad a pomáhá zklidnit napětí.
            </p>
          </div>
          <button
            onClick={onStartSession}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white"
          >
            Spustit nové sezení
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold">Emocionální soulad</h2>
          <p className="mt-2 text-sm text-slate-500">Mock data připravená na reálnou metriku.</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChart}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis domain={[50, 80]} stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-rose-50 p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">Domácí úkol</h2>
          <p className="mt-4 text-base text-slate-700">{latestHomework}</p>
          <p className="mt-6 text-sm text-slate-500">
            Vychází z posledního sezení a posiluje pozitivní rutiny.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Historie sezení</h2>
          <span className="text-sm text-slate-500">{history.length} záznamů</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {recentSessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              Zatím žádná sezení. Spusťte první sezení pro vytvoření historie.
            </div>
          ) : (
            recentSessions.map((session) => (
              <article key={session.id} className="rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {new Date(session.date).toLocaleDateString("cs-CZ")}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{session.topic}</h3>
                  </div>
                  <span className="text-2xl">{sentimentIcon[session.sentiment]}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{session.summary}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
