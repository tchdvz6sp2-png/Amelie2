import { useState } from "react";

interface ApiKeyPanelProps {
  apiKey: string | null;
  onSave: (value: string) => void;
  onClear: () => void;
}

const ApiKeyPanel = ({ apiKey, onSave, onClear }: ApiKeyPanelProps) => {
  const [value, setValue] = useState(apiKey ?? "");

  return (
    <section className="rounded-3xl bg-white p-8 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Připojení k Gemini</h2>
          <p className="mt-2 text-sm text-slate-500">
            Zadejte API klíč pro aktivaci hlasové terapie a analýzy sezení. Klíč ukládáme pouze do localStorage.
          </p>
        </div>
        {apiKey ? (
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
            Klíč uložen
          </span>
        ) : (
          <span className="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700">
            Bez klíče
          </span>
        )}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_auto]">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Vložte Gemini API klíč"
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
        />
        <button
          onClick={() => onSave(value.trim())}
          className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
          disabled={!value.trim()}
        >
          Uložit
        </button>
        <button
          onClick={() => {
            setValue("");
            onClear();
          }}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
        >
          Vymazat
        </button>
      </div>
    </section>
  );
};

export default ApiKeyPanel;
