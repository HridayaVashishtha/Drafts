# Adult-ish (React)

A small private site scaffolded with Vite + React. It implements three pages: a landing page, a drafts wall showing message cards, and a message detail page that shows the full message and song.

Quick start:

```powershell
npm install
npm run dev
```

Then open http://localhost:5173

Notes:
- The project fetches entries from the provided SheetDB API: https://sheetdb.io/api/v1/yjusytgjlvwox
- Field names are handled loosely; adjust `src/lib/api.js` or page parsing if your sheet uses custom column names.
