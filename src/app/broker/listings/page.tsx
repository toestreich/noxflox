import Link from "next/link";
import { PageHeading } from "@/components/ui";
import { broker, brokerStats, listings, usd } from "@/lib/mock-data";

export const metadata = { title: "Listings" };

const stats = [
  { label: "Active listings", value: brokerStats.activeListings },
  { label: "Total applicants", value: brokerStats.totalApplicants },
  { label: "Ready for review", value: brokerStats.readyForReview },
  { label: "New today", value: brokerStats.newToday },
];

export default function Listings() {
  return (
    <main className="page page-wide">
      <PageHeading
        eyebrow="Broker workspace"
        title={`Good evening, ${broker.firstName}.`}
        lede="Here's what needs your attention across your rental listings."
        action={<Link href="/broker/listings/new" className="btn btn-primary">+ Add listing</Link>}
      />

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <div className="small" style={{ color: "var(--ink-2)" }}>{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <section className="card">
        <h2 className="card-title" style={{ marginBottom: 4 }}>Your listings</h2>
        <p className="lede" style={{ marginBottom: 16 }}>Applications organized by property.</p>
        {listings.map((l) => (
          <div key={l.id} className="listing-row">
            <div>
              <div className="listing-address">{l.address} · {l.unit}</div>
              <div className="muted small">{l.neighborhood} · {usd(l.rent)}/mo · {l.available}</div>
            </div>
            <div>
              <div className="count">{l.applicants}</div>
              <div className="muted small">{l.applicants === 1 ? "applicant" : "applicants"}</div>
            </div>
            <div>
              <div className="count">{l.readyForReview}</div>
              <div className="muted small">ready for review</div>
            </div>
            <Link href={`/broker/applicants?listing=${l.id}`} className="btn">View applicants →</Link>
          </div>
        ))}
      </section>
    </main>
  );
}
