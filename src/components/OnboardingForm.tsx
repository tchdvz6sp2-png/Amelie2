import type { FormEvent } from "react";
import type { UserProfile } from "../lib/types";

interface OnboardingFormProps {
  onComplete: (profile: UserProfile) => void;
}

const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const profile: UserProfile = {
      partnerA: String(data.get("partnerA") ?? ""),
      partnerB: String(data.get("partnerB") ?? ""),
      relationshipLength: String(data.get("relationshipLength") ?? ""),
      goals: String(data.get("goals") ?? "")
    };
    onComplete(profile);
  };

  return (
    <section className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-soft">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-slate-900">Vítejte v Amelia AI</h1>
        <p className="mt-3 text-lg text-slate-600">
          Jemný průvodce pro páry, kteří chtějí růst díky metodám Gottmanova institutu.
        </p>
      </div>
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Jméno partnera A
            <input
              required
              name="partnerA"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base"
              placeholder="Anna"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Jméno partnera B
            <input
              required
              name="partnerB"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base"
              placeholder="Petr"
            />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Délka vztahu
          <input
            required
            name="relationshipLength"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base"
            placeholder="např. 4 roky"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Hlavní cíle pro Amelia AI
          <textarea
            required
            name="goals"
            rows={4}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base"
            placeholder="Lepší komunikace, zvládání konfliktů, více času pro blízkost..."
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white"
        >
          Pokračovat na nástěnku
        </button>
        <p className="text-xs text-slate-500">
          Data zůstávají pouze ve vašem zařízení a ukládají se do localStorage.
        </p>
      </form>
    </section>
  );
};

export default OnboardingForm;
