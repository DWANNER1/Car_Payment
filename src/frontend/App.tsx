import { useEffect, useState } from 'react';

export default function App() {
  const [health, setHealth] = useState<string>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data.ok ? 'healthy' : 'unknown'))
      .catch(() => setHealth('offline'));
  }, []);

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: 24 }}>
      <h1>Car Payment Portal</h1>
      <p>Starter frontend scaffold for Codex.</p>
      <ul>
        <li>API status: {health}</li>
        <li>Design doc: docs/Detailed_Technical_Design.md</li>
        <li>Agent instructions: AGENTS.md</li>
      </ul>
    </main>
  );
}
