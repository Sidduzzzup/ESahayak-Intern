"use client";
import { useState } from 'react';

export default function ImportPage() {
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const res = await fetch('/api/buyers/import', { method: 'POST', body: fd });
    setBusy(false);
    setResult(await res.json());
  }
  return (
    <div>
      <h1>Import Buyers</h1>
      <form onSubmit={onSubmit}>
        <input type="file" name="file" accept="text/csv" required />
        <button className="btn-primary" disabled={busy} aria-busy={busy}>{busy ? 'Importing…' : 'Import'}</button>
      </form>
      {result && (
        <div style={{ marginTop: 16 }}>
          <div>Inserted: {result.inserted}</div>
          {result.errors?.length ? (
            <table>
              <thead><tr><th>Row</th><th>Errors</th></tr></thead>
              <tbody>
                {result.errors.map((e: any) => (
                  <tr key={e.index}><td>{e.index + 1}</td><td>{e.errors.join('; ')}</td></tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      )}
    </div>
  );
}
