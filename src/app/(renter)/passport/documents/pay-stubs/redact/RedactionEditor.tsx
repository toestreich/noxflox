"use client";

import Link from "next/link";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";

// Prototype of flow D in docs/technical-overview.md. Boxes are drawn and
// tracked in page-relative units (0–1), the shape the backend will store.
// Not implemented yet: rendering a real PDF (pdf.js) and burning the boxes
// into a flattened copy (pdf-lib) before upload.

type Box = { id: number; x: number; y: number; w: number; h: number };

const SUGGESTIONS = [
  { id: "ssn", label: "Social Security number", hint: "Brokers never need this", defaultOn: true },
  { id: "account", label: "Bank account number", hint: "Direct deposit details", defaultOn: true },
  { id: "employeeId", label: "Employee ID", hint: "Optional to hide", defaultOn: false },
] as const;

type SuggestionId = (typeof SUGGESTIONS)[number]["id"];

const clamp = (n: number) => Math.min(1, Math.max(0, n));

function Sensitive({ hidden, suggested, children }: { hidden: boolean; suggested: boolean; children: ReactNode }) {
  if (hidden) {
    return (
      <span
        aria-label="Hidden"
        style={{ display: "inline-block", minWidth: "8ch", background: "#111", color: "transparent", userSelect: "none" }}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      style={
        suggested
          ? { padding: "0 3px", outline: "2px dashed #b7791f", outlineOffset: 1, background: "#fbf1de" }
          : undefined
      }
    >
      {children}
    </span>
  );
}

export function RedactionEditor() {
  const [hidden, setHidden] = useState<Record<SuggestionId, boolean>>(
    () => Object.fromEntries(SUGGESTIONS.map((s) => [s.id, s.defaultOn])) as Record<SuggestionId, boolean>,
  );
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [draft, setDraft] = useState<Box | null>(null);
  const [drawMode, setDrawMode] = useState(true);
  const paperRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const nextId = useRef(1);

  const point = (e: PointerEvent) => {
    const r = paperRef.current!.getBoundingClientRect();
    return { x: clamp((e.clientX - r.left) / r.width), y: clamp((e.clientY - r.top) / r.height) };
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!drawMode) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = point(e);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const p = point(e);
    const s = start.current;
    setDraft({ id: 0, x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) });
  };

  const onPointerUp = () => {
    if (draft && draft.w > 0.02 && draft.h > 0.008) {
      setBoxes((b) => [...b, { ...draft, id: nextId.current++ }]);
    }
    start.current = null;
    setDraft(null);
  };

  const hiddenCount = Object.values(hidden).filter(Boolean).length + boxes.length;

  return (
    <div className="split">
      <section
        aria-label="Document"
        className="main"
        style={{ flexBasis: 560, background: "#eceae4", border: "1px solid #e2dfd7", borderRadius: 14, overflow: "hidden", gap: 0 }}
      >
        <div
          role="toolbar"
          aria-label="Redaction tools"
          className="cluster"
          style={{ justifyContent: "space-between", padding: "10px 14px", background: "#fff", borderBottom: "1px solid var(--border)" }}
        >
          <div className="cluster" style={{ gap: 6 }}>
            <button
              type="button"
              className={drawMode ? "btn btn-sm btn-primary" : "btn btn-sm"}
              aria-pressed={drawMode}
              onClick={() => setDrawMode((d) => !d)}
            >
              Draw box
            </button>
            <button
              type="button"
              className="btn btn-sm"
              disabled={boxes.length === 0}
              onClick={() => setBoxes((b) => b.slice(0, -1))}
            >
              Undo
            </button>
          </div>
          <span className="muted" style={{ fontSize: 14 }}>Page 1 of 1</span>
        </div>

        <div style={{ padding: 32, display: "flex", justifyContent: "center" }}>
          <div
            ref={paperRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 560,
              background: "#fff",
              boxShadow: "0 2px 10px rgba(35,33,30,0.12)",
              padding: "32px 36px",
              fontFamily: "'Courier New', monospace",
              fontSize: 12,
              color: "#2b2b2b",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              cursor: drawMode ? "crosshair" : "default",
              touchAction: "none",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 16 }}>HUDSON ANALYTICS INC.</div>
                <div>200 Varick St, New York, NY 10014</div>
              </div>
              <div style={{ textAlign: "right" }}>EARNINGS STATEMENT<br />Pay date: 09/15/2026</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "6px 20px", padding: "12px 0", borderTop: "1px solid #cfcfcf", borderBottom: "1px solid #cfcfcf" }}>
              <div>Employee: JOHN DAVIS</div>
              <div>SSN: <Sensitive hidden={hidden.ssn} suggested>123-45-6789</Sensitive></div>
              <div>Employee ID: <Sensitive hidden={hidden.employeeId} suggested>HA-20417</Sensitive></div>
              <div>Period: 09/01 – 09/15/2026</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "6px 12px" }}>
              <b>EARNINGS</b><b style={{ textAlign: "right" }}>CURRENT</b><b style={{ textAlign: "right" }}>YTD</b>
              <span>Regular salary</span><span style={{ textAlign: "right" }}>7,708.33</span><span style={{ textAlign: "right" }}>131,041.61</span>
              <b>Gross pay</b><b style={{ textAlign: "right" }}>7,708.33</b><b style={{ textAlign: "right" }}>131,041.61</b>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "6px 12px" }}>
              <b>DEDUCTIONS</b><span /><span />
              <span>Federal income tax</span><span style={{ textAlign: "right" }}>1,302.11</span><span style={{ textAlign: "right" }}>22,135.87</span>
              <span>NY state + NYC tax</span><span style={{ textAlign: "right" }}>642.17</span><span style={{ textAlign: "right" }}>10,916.89</span>
              <span>Social Security + Medicare</span><span style={{ textAlign: "right" }}>589.69</span><span style={{ textAlign: "right" }}>10,024.73</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #cfcfcf", fontWeight: 700 }}>
              <span>NET PAY</span><span>5,174.36</span>
            </div>
            <div>Direct deposit: Chase checking acct <Sensitive hidden={hidden.account} suggested>000123456789</Sensitive></div>

            {[...boxes, ...(draft ? [draft] : [])].map((b) => (
              <span
                key={b.id}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: `${b.x * 100}%`,
                  top: `${b.y * 100}%`,
                  width: `${b.w * 100}%`,
                  height: `${b.h * 100}%`,
                  background: b.id === 0 ? "rgba(17,17,17,0.6)" : "#111",
                  outline: b.id === 0 ? "2px solid #3366cc" : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <aside className="side">
        <section className="card">
          <h2 className="card-title" style={{ marginBottom: 4 }}>Suggested</h2>
          <p className="muted small" style={{ margin: "0 0 8px" }}>Found automatically. Tick to hide.</p>
          {SUGGESTIONS.map((s) => (
            <label key={s.id} className="check-row">
              <span className="stack" style={{ gap: 2 }}>
                <span>{s.label}</span>
                <span className="muted small">{s.hint}</span>
              </span>
              <input
                type="checkbox"
                checked={hidden[s.id]}
                onChange={(e) => setHidden((h) => ({ ...h, [s.id]: e.target.checked }))}
              />
            </label>
          ))}
        </section>

        <section className="card">
          <h2 className="card-title">Your boxes</h2>
          {boxes.length === 0 ? (
            <p className="muted small" style={{ margin: "0 0 12px" }}>Drag on the document to hide anything else.</p>
          ) : (
            boxes.map((b, i) => (
              <div key={b.id} className="item" style={{ padding: "10px 0" }}>
                <span>Box {i + 1} · page 1</span>
                <button type="button" className="btn btn-sm" onClick={() => setBoxes((all) => all.filter((x) => x.id !== b.id))}>
                  Remove
                </button>
              </div>
            ))
          )}
          <div className="callout callout-warn" style={{ marginTop: 8 }}>
            Don&apos;t cover your name, employer, pay dates or amounts. Brokers need them.
          </div>
        </section>

        <section className="card card-muted" style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>
          This happens on your computer. Only the redacted copy is uploaded, and brokers see it labelled{" "}
          <strong style={{ color: "var(--ink)" }}>
            &ldquo;Redacted in NoxFlox · {hiddenCount} {hiddenCount === 1 ? "area" : "areas"} hidden&rdquo;
          </strong>
          .
        </section>

        <div className="cluster" style={{ flexWrap: "nowrap" }}>
          <Link href="/passport/documents/pay-stubs" className="btn" style={{ flex: 1, minHeight: 48 }}>Cancel</Link>
          <Link href="/passport" className="btn btn-primary" style={{ flex: 2, minHeight: 48 }}>Save redacted copy</Link>
        </div>
      </aside>
    </div>
  );
}
