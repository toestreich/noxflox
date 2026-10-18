"use client";

import { useState } from "react";
import type { ActiveShare } from "@/lib/mock-data";

export function ActiveAccess({ initial }: { initial: ActiveShare[] }) {
  const [shares, setShares] = useState(initial);
  const [revoked, setRevoked] = useState<ActiveShare[]>([]);

  const revoke = (share: ActiveShare) => {
    if (!window.confirm(`Revoke ${share.broker}'s access? They lose access immediately.`)) return;
    setShares((s) => s.filter((x) => x.id !== share.id));
    setRevoked((r) => [share, ...r]);
  };

  return (
    <section className="card">
      <h2 className="card-title" style={{ marginBottom: 4 }}>Active access</h2>
      <p className="lede" style={{ fontSize: 14, marginBottom: 8 }} aria-live="polite">
        {shares.length === 0
          ? "No brokers can see your application right now."
          : `${shares.length} ${shares.length === 1 ? "broker can" : "brokers can"} currently see your application.`}
      </p>

      {shares.map((s) => (
        <div key={s.id} className="person-row">
          <span className="avatar avatar-lg" aria-hidden="true">{s.initials}</span>
          <div className="stack" style={{ flex: "1 1 240px", gap: 3 }}>
            <span className="person-name">{s.broker}</span>
            <span className="muted small">{s.listing} · {s.scope}</span>
          </div>
          <div className="stack small" style={{ flex: "1 1 180px", gap: 3 }}>
            <span className="muted">Last opened</span>
            <strong>{s.lastOpened}</strong>
          </div>
          <div className="stack small" style={{ flex: "1 1 120px", gap: 3 }}>
            <span className="muted">Expires</span>
            <strong>{s.expires}</strong>
          </div>
          <button type="button" className="btn btn-danger" onClick={() => revoke(s)}>
            Revoke<span className="sr-only"> {s.broker}</span>
          </button>
        </div>
      ))}

      {revoked.map((s) => (
        <div key={s.id} className="person-row" style={{ opacity: 0.6 }}>
          <span className="avatar avatar-lg avatar-pending" aria-hidden="true">{s.initials}</span>
          <div className="stack" style={{ flex: "1 1 240px", gap: 3 }}>
            <span className="person-name">{s.broker}</span>
            <span className="muted small">{s.listing}</span>
          </div>
          <span className="muted small">Revoked just now</span>
        </div>
      ))}
    </section>
  );
}
