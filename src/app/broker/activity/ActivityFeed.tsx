"use client";

import { useState } from "react";
import { brokerActivity, type ActivityCategory } from "@/lib/mock-data";

const FILTERS: { id: ActivityCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "applications", label: "Applications" },
  { id: "documents", label: "Documents" },
  { id: "access", label: "Access" },
];

export function ActivityFeed() {
  const [filter, setFilter] = useState<ActivityCategory | "all">("all");
  const events = brokerActivity.filter((e) => filter === "all" || e.category === filter);
  const days = [...new Set(events.map((e) => e.day))];

  return (
    <section className="card main" style={{ gap: 0 }}>
      <div className="cluster" role="group" aria-label="Filter activity" style={{ gap: 8, marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={filter === f.id ? "btn btn-sm btn-primary" : "btn btn-sm"}
            style={{ borderRadius: 999 }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {days.length === 0 && <p className="lede">Nothing here yet.</p>}
      {days.map((day) => (
        <div key={day}>
          <div className="eyebrow" style={{ color: "var(--muted)", padding: "12px 0 8px" }}>{day}</div>
          {events
            .filter((e) => e.day === day)
            .map((e) => (
              <div key={day + e.time} className="timeline-row" style={{ gap: 20 }}>
                <span className="timeline-time" style={{ width: 72, fontSize: 13 }}>{e.time}</span>
                <div className="stack" style={{ gap: 3 }}>
                  <span>
                    {e.who && <strong>{e.who}</strong>}
                    {e.who && !e.text.startsWith("'") ? " " : ""}
                    {e.text}
                  </span>
                  <span className="muted small">{e.sub}</span>
                </div>
              </div>
            ))}
        </div>
      ))}
    </section>
  );
}
