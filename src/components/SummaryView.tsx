import type { SessionSummary } from "../lib/types";

interface SummaryViewProps {
  summary: SessionSummary;
  onBack: () => void;
}

const SummaryView = ({ summary, onBack }: SummaryViewProps) => {
  return (
    <section className="grid gap-6">
      <header className="rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Shrnutí sezení</h2>
            <p className="mt-2 text-sm text-slate-500">
              {new Date(summary.date).toLocaleString("cs-CZ")}
            </p>
          </div>
          <button
            onClick={onBack}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Zpět na nástěnku
          </button>
        </div>
      </header>

      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <h3 className="text-2xl font-semibold">{summary.topic}</h3>
        <p className="mt-4 text-base text-slate-700">{summary.summary}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-6">
            <h4 className="text-lg font-semibold">Klíčové poznatky</h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
              {summary.insights.map((insight, index) => (
                <li key={`${summary.id}-insight-${index}`}>{insight}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-rose-50 p-6">
            <h4 className="text-lg font-semibold">Domácí úkol</h4>
            <p className="mt-3 text-sm text-slate-700">{summary.homework}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummaryView;
