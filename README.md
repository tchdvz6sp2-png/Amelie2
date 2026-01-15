# Amelia AI

Progressivní webová aplikace (PWA) pro párovou terapii, která kombinuje hlasový dialog a textovou analýzu podle metodiky Gottmanova institutu.

## Funkce
- Onboarding pro páry s uložením profilu do localStorage.
- Dashboard s grafem emocionálního souladu (mock data), úkolem a historií sezení.
- Terapeutická místnost s audio vizualizérem, real-time přepisem a bezpečnostními instrukcemi.
- Post-session analýza s Gemini 3 Flash a JSON reportem.
- PWA manifest + optimalizace pro iOS a Electron boilerplate.

## Lokální spuštění
```bash
npm install
npm run dev
```

### API klíč
Zadejte klíč do prostředí jako `VITE_GEMINI_API_KEY`, aby fungovala analýza textu.

## Electron
Boilerplate pro Electron je v `electron/main.ts` a načítá Vite dev server nebo build.
