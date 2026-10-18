import Link from "next/link";
import { CheckSquare, PageHeading, Row } from "@/components/ui";
import { applicationRequest, broker, incomeToRent, listingById, renter, usd } from "@/lib/mock-data";

export const metadata = { title: "Application request" };

export default function ApplicationRequest() {
  const listing = listingById(applicationRequest.listingId)!;
  const inPassport = applicationRequest.required.filter((r) => r.inPassport).length;
  const needed = listing.rent * 40;
  const meets = renter.householdIncome >= needed;

  return (
    <main className="page">
      <PageHeading
        eyebrow="Application request"
        title={`${listing.address} · ${listing.unit}`}
        lede={`${broker.name} requested your application. This request expires ${applicationRequest.expires}.`}
      />

      <div className="split">
        <section className="card main" style={{ gap: 0 }}>
          <div style={{ paddingBottom: 16 }}>
            <h2 className="card-title" style={{ marginBottom: 4 }}>{broker.firstName} asked for</h2>
            <span className="muted" style={{ fontSize: 14 }}>
              {inPassport} of {applicationRequest.required.length} are already in your passport.
            </span>
          </div>
          {applicationRequest.required.map((r) => (
            <div key={r.label} className="item">
              <span className="item-label">
                <CheckSquare state={r.inPassport ? "checked" : "missing"} />
                {r.label}
              </span>
              {r.inPassport ? (
                <span className="status">In passport</span>
              ) : (
                <button type="button" className="btn btn-sm">Add</button>
              )}
            </div>
          ))}
        </section>

        <div className="side">
          <section className="card">
            <h2 className="card-title">Listing</h2>
            <Row label="Rent" value={`${usd(listing.rent)}/mo`} />
            <Row label="Neighborhood" value={listing.neighborhood} />
            <Row label="Move-in" value={listing.available} />
            <Row label="Income needed (40×)" value={usd(needed)} />
            <div className={`callout ${meets ? "callout-ok" : "callout-warn"}`} style={{ marginTop: 8 }}>
              {meets
                ? `Your reported income of ${usd(renter.householdIncome)} meets this requirement (${incomeToRent(renter.householdIncome, listing.rent)}×).`
                : "Your income is below 40× this rent. Adding a guarantor can help."}
            </div>
          </section>

          <div className="stack">
            <Link href="/applications/share" className="btn btn-primary btn-block">Review &amp; share →</Link>
            <p className="fine-print" style={{ textAlign: "center" }}>
              Nothing is shared until you confirm · Revoke access anytime
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
