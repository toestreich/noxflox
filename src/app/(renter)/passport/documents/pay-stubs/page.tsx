import Link from "next/link";
import { PageHeading } from "@/components/ui";

export const metadata = { title: "Pay stubs" };

const fields: [string, string][] = [
  ["Employer", "Hudson Analytics"],
  ["Employee", "John Davis"],
  ["Pay period", "Sep 1 – 15, 2026"],
  ["Frequency", "Twice a month"],
  ["Gross pay", "$7,708.33"],
  ["Year to date", "$131,041.61"],
];

function FileIcon({ type }: { type: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 36,
        height: 44,
        borderRadius: 4,
        background: "var(--surface-muted)",
        border: "1px solid #e2dfd7",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        fontSize: 9,
        fontWeight: 700,
        color: "var(--muted)",
        paddingBottom: 5,
        flexShrink: 0,
      }}
    >
      {type}
    </span>
  );
}

export default function PayStubs() {
  return (
    <main className="page" style={{ paddingTop: 48 }}>
      <Link href="/passport" className="back-link">← Rental passport</Link>
      <PageHeading
        eyebrow="Documents"
        title="Pay stubs"
        lede="Your 3 most recent. We read each one and check it against your other documents."
      />

      <div className="split">
        <div className="main">
          <label
            className="card"
            style={{ border: "1.5px dashed #c9c4b9", padding: "36px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center", cursor: "pointer" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 16V4" />
              <path d="M7 9l5-5 5 5" />
              <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
            </svg>
            <strong style={{ fontSize: 16 }}>Drop files here or choose files</strong>
            <span className="muted" style={{ fontSize: 14 }}>PDF, JPG or PNG · up to 10 MB each</span>
            <span className="muted small">Prototype: files stay on your computer and aren&apos;t uploaded.</span>
            <input type="file" accept="application/pdf,image/jpeg,image/png" multiple className="sr-only" />
          </label>

          <section className="card" style={{ padding: "8px 24px" }}>
            <div className="item" style={{ borderTop: "none" }}>
              <FileIcon type="PDF" />
              <div className="stack" style={{ flex: 1, gap: 6 }}>
                <div className="cluster" style={{ justifyContent: "space-between" }}>
                  <span>paystub_2026-10-15.pdf</span>
                  <span className="muted small">Uploading · 64%</span>
                </div>
                <div style={{ height: 4, background: "var(--chip)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: "64%", height: "100%", background: "var(--ink)" }} />
                </div>
              </div>
            </div>
            <div className="item">
              <FileIcon type="PDF" />
              <span style={{ flex: 1 }}>paystub_2026-09-30.pdf</span>
              <span className="muted small">Reading document…</span>
            </div>
            <div className="item">
              <FileIcon type="JPG" />
              <span style={{ flex: 1 }}>IMG_4021.jpg</span>
              <span className="cluster">
                <span className="status status-warn">Review needed</span>
                <button type="button" className="btn btn-sm" aria-label="Remove IMG_4021.jpg">×</button>
              </span>
            </div>
          </section>

          <section className="card">
            <div className="cluster" style={{ justifyContent: "space-between" }}>
              <h2 className="card-title" style={{ margin: 0 }}>Does this look right?</h2>
              <span className="muted small">Read from IMG_4021.jpg</span>
            </div>
            <div className="grid-2" style={{ marginTop: 10, gap: "0 32px" }}>
              {fields.map(([label, value]) => (
                <div key={label} className="row">
                  <span className="row-label">{label}</span>
                  <strong className="row-value">{value}</strong>
                </div>
              ))}
            </div>
            <div className="callout callout-warn" style={{ marginTop: 12 }}>
              We also found a Social Security number and a bank account number. Hide them before this goes into your
              passport.
            </div>
            <div className="cluster" style={{ marginTop: 16 }}>
              <Link href="/passport/documents/pay-stubs/redact" className="btn btn-primary">Hide sensitive details →</Link>
              <button type="button" className="btn">Edit details</button>
              <button type="button" className="btn">Replace file</button>
            </div>
          </section>
        </div>

        <aside className="side">
          <section className="card">
            <h2 className="card-title">What brokers look for</h2>
            <div className="row" style={{ fontSize: 14 }}>Your 3 most recent stubs, the newest from the last 30 days</div>
            <div className="row" style={{ fontSize: 14 }}>Every page, with your name and employer visible</div>
            <div className="row" style={{ fontSize: 14 }}>No SSN or full account numbers. We help you hide them.</div>
          </section>
          <section className="card card-muted stack" style={{ gap: 8 }}>
            <div className="cluster" style={{ justifyContent: "space-between" }}>
              <h2 className="card-title" style={{ margin: 0 }}>Connect payroll instead</h2>
              <span className="eyebrow" style={{ border: "1px solid var(--field-border)", borderRadius: 999, padding: "3px 8px", fontSize: 10 }}>Soon</span>
            </div>
            <p className="lede" style={{ fontSize: 14 }}>
              Link your payroll provider and your income shows as verified, with no uploads.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
