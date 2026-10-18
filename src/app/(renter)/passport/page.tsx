import Link from "next/link";
import { CheckSquare, PageHeading, Row, StatusLabel } from "@/components/ui";
import { activeShares, maxRentAt40x, passportDocuments, renter, usd } from "@/lib/mock-data";

export const metadata = { title: "Rental passport" };

export default function Passport() {
  const ready = passportDocuments.filter((d) => d.status !== "missing").length;
  const total = passportDocuments.length;
  const pct = Math.round((ready / total) * 100);
  const missing = passportDocuments.filter((d) => d.status === "missing");

  return (
    <main className="page">
      <PageHeading
        eyebrow="Rental passport"
        title={`Good evening, ${renter.firstName}.`}
        lede="Your reusable application is almost ready for NYC rentals."
        action={<Link href="/applications/share" className="btn btn-primary">Share passport →</Link>}
      />

      <div className="split">
        <section className="card main" style={{ flexDirection: "row", alignItems: "center", gap: 28, padding: 28 }}>
          <div
            role="img"
            aria-label={`${pct}% ready`}
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: `conic-gradient(var(--sage-bar) 0 ${pct}%, var(--border) 0)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ width: 94, height: 94, borderRadius: "50%", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span className="serif" style={{ fontSize: 28 }}>{pct}%</span>
              <span className="muted" style={{ fontSize: 11 }}>ready</span>
            </div>
          </div>
          <div className="stack" style={{ gap: 8, flex: 1 }}>
            <strong style={{ fontSize: 15 }}>Application readiness</strong>
            <span style={{ color: "var(--ink-2)", fontSize: 15 }}>
              {ready} of {total} core requirements are ready.
            </span>
            <div style={{ height: 6, background: "var(--chip)", borderRadius: 3, overflow: "hidden", maxWidth: 260 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "var(--sage-bar)" }} />
            </div>
            {missing.length > 0 && (
              <span className="muted small">Add your {missing[0].label.toLowerCase()} to reach 100%.</span>
            )}
          </div>
        </section>

        <section className="card side">
          <div>
            <h2 className="card-title">Rental profile</h2>
            <Row label="Reported annual income" value={usd(renter.householdIncome)} />
            <Row label="Qualifies for rent up to" value={`${usd(maxRentAt40x(renter.householdIncome))}/mo`} />
            <Row label="Desired move date" value={renter.moveIn} />
            <Row label="Household" value={<Link href="/passport/household">2 applicants</Link>} />
          </div>
        </section>
      </div>

      <Link href="/access" className="card card-link">
        <span style={{ fontSize: 15 }}>
          <strong>Shared with {activeShares.length} brokers.</strong>{" "}
          <span className="muted">Maya Chen opened your application today at 6:42 PM.</span>
        </span>
        <span style={{ fontSize: 14, fontWeight: 500 }}>Manage access →</span>
      </Link>

      <section className="card">
        <div className="card-head">
          <div>
            <h2 className="card-title" style={{ marginBottom: 4 }}>Documents</h2>
            <span className="muted" style={{ fontSize: 14 }}>
              Checked means read and cross-checked across your documents. Bank and payroll verification is coming.
            </span>
          </div>
          <Link href="/passport/documents/pay-stubs" className="btn">Upload document</Link>
        </div>
        {passportDocuments.map((doc) => (
          <div key={doc.kind} className="item">
            <span className="item-label">
              <CheckSquare state={doc.status} />
              {doc.label}
            </span>
            {doc.status === "missing" ? (
              <button className="btn btn-sm" type="button">Add</button>
            ) : doc.href ? (
              <Link href={doc.href} className="status">{doc.detail ?? "Checked"} ›</Link>
            ) : (
              <StatusLabel status={doc.status}>{doc.status === "checked" ? `${doc.detail ?? "Checked"}` : undefined}</StatusLabel>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
