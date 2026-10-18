import Link from "next/link";
import { PageHeading, Row } from "@/components/ui";
import { household, maxRentAt40x, pendingInvites, usd } from "@/lib/mock-data";
import { InviteForm } from "./InviteForm";

export const metadata = { title: "Household" };

export default function HouseholdPage() {
  const combined = household.reduce((sum, p) => sum + p.income, 0);

  return (
    <main className="page" style={{ paddingTop: 48 }}>
      <Link href="/passport" className="back-link">← Rental passport</Link>
      <PageHeading
        eyebrow="Household"
        title="Apply together."
        lede="Everyone keeps their own passport. Brokers see one combined application."
      />

      <div className="split">
        <div className="main">
          <section className="card">
            <h2 className="card-title">Your household</h2>
            {household.map((p) => (
              <div key={p.name} className="person-row" style={{ padding: "16px 0" }}>
                <span className="avatar avatar-lg" aria-hidden="true">{p.initials}</span>
                <div className="stack" style={{ flex: "1 1 200px", gap: 3 }}>
                  <span className="person-name">
                    {p.name} {p.you && <span className="muted small" style={{ fontFamily: "var(--sans)" }}>· you</span>}
                  </span>
                  <span className="muted small">{p.role} · {usd(p.income)}</span>
                </div>
                <span className={p.state === "Ready" ? "status" : "status status-pending"}>{p.state}</span>
              </div>
            ))}
            {pendingInvites.map((p) => (
              <div key={p.name} className="person-row" style={{ padding: "16px 0 4px" }}>
                <span className="avatar avatar-lg avatar-pending" aria-hidden="true">{p.initials}</span>
                <div className="stack" style={{ flex: "1 1 200px", gap: 3 }}>
                  <span className="person-name">{p.name}</span>
                  <span className="muted small">{p.role} · invited {p.invited} · hasn&apos;t started</span>
                </div>
                <span className="cluster">
                  <button type="button" className="btn btn-sm">Resend</button>
                  <button type="button" className="btn btn-sm btn-danger">Remove</button>
                </span>
              </div>
            ))}
          </section>

          <InviteForm />
        </div>

        <aside className="side">
          <section className="card">
            <h2 className="card-title">Combined</h2>
            <Row label="Household income" value={usd(combined)} />
            <Row label="Qualifies up to (40×)" value={`${usd(maxRentAt40x(combined))}/mo`} />
            <Row label="With guarantor" value={<span className="muted">Pending</span>} />
          </section>
          <section className="card card-muted">
            <h2 className="card-title">Do you need a guarantor?</h2>
            <p className="lede" style={{ fontSize: 14, color: "var(--ink-2)" }}>
              Many NYC landlords ask for one when household income is under 40× the rent. Guarantors usually need
              around 80× the rent, so they apply with their own documents.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
