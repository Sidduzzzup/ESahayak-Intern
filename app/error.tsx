"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" aria-live="assertive">
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
      <button className="btn" onClick={() => reset()}>Try again</button>
    </div>
  );
}
