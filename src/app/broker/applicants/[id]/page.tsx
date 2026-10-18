import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckSquare, PageHeading, Row, StatusLabel } from "@/components/ui";
import { applicantDetail, incomeToRent, listingById, usd } from "@/lib/mock-data";

export const metadata = { title: "Applicant review" };

export function generateStaticParams() {
  return [{ id: applicantDetail.id }];
}

export default async function ApplicantReview({ params }: PageProps<"/broker/applicants/[id]">) {
  const { id } = await params;
  if (id !== applicantDetail.id) notFound();

  const a = applicantDetail;
  const listing = listingById(a.listingId)!;
  const [first, second] = a.people;

  return (
    <main className="page page-wide" style={{ paddingTop: 48 }}>
      <Link href={`/broker/applicants?listing=${listing.id}`} className="back-link">
        ← {listing.address} · {listing.unit} · {listing.applicants} applicants
      </Link>
      <PageHeading
        eyebrow="Applicant"
        title={a.names}
        lede={`Shared a full application ${a.sharedAt.toLowerCase()} · access expires ${a.expires}`}
        action={
          <div className="cluster">
            <button type="button" className="btn">Request a document</button>
            <button type="button" className="btn btn-primary">Export for landlord</button>
          </div>
        }
      />

      <div className="stat-grid">
        <div className="stat">
          <div className="small" style={{ color: "var(--ink-2)" }}>Income to rent</div>
          <div className="stat-value">{incomeToRent(a.householdIncome, listing.rent)}×</div>
          <div className="muted" style={{ fontSize: 12 }}>{usd(a.householdIncome)} combined</div>
        </div>
        <div className="stat">
          <div className="small" style={{ color: "var(--ink-2)" }}>Household</div>
          <div className="stat-value">{a.people.length}</div>
          <div className="muted" style={{ fontSize: 12 }}>applicants, no guarantor</div>
        </div>
        <div className="stat">
          <div className="small" style={{ color: "var(--ink-2)" }}>Documents checked</div>
          <div className="stat-value">{a.documentsChecked} of {a.documentsTotal}</div>
          <div className="muted" style={{ fontSize: 12 }}>{a.documentsTotal - a.documentsChecked} still being checked</div>
        </div>
        <div className="stat">
          <div className="small" style={{ color: "var(--ink-2)" }}>Move-in</div>
          <div className="stat-value">{listing.available}</div>
          <div className="muted" style={{ fontSize: 12 }}>matches listing</div>
        </div>
      </div>

      <section className="card stack" style={{ gap: 14 }}>
        <h2 className="card-title" style={{ margin: 0 }}>Summary</h2>
        <div className="grid-2" style={{ gap: "0 40px" }}>
          <div>
            <Row label={`${first.name} · employer`} value={first.employer} />
            <Row label={`${first.name} · annual income`} value={usd(first.income)} />
            <Row label="Rental history" value={a.rentalHistory} />
          </div>
          <div>
            <Row label={`${second.name} · employer`} value={second.employer} />
            <Row label={`${second.name} · annual income`} value={usd(second.income)} />
            <Row label="Landlord reference" value={a.landlordReference} />
          </div>
        </div>

        <h3 className="small" style={{ margin: "10px 0 0", color: "var(--ink-2)" }}>Worth confirming</h3>
        <div className="callout callout-warn">
          <strong aria-hidden="true">!</strong>
          <span>John&apos;s tax return is still being checked. Income above uses his pay stubs and W-2.</span>
        </div>
        <div className="callout callout-ok">
          <strong aria-hidden="true">✓</strong>
          <span>Names, employers and pay amounts match across ID, pay stubs, W-2 and employment letters for both applicants.</span>
        </div>
        <p className="fine-print">
          Figures are read from the applicants&apos; documents and cross-checked. They are not yet verified against bank
          or payroll records. NoxFlox does not score, rank or recommend applicants.
        </p>
      </section>

      <section className="card">
        <div className="cluster" style={{ justifyContent: "space-between", paddingBottom: 12 }}>
          <h2 className="card-title" style={{ margin: 0 }}>Documents · {first.name}</h2>
          <span className="muted small">The applicant sees each document you open.</span>
        </div>
        {a.documents.map((d) => (
          <div key={d.label} className="item" style={{ padding: "12px 0" }}>
            <span className="item-label">
              <CheckSquare state={d.status} />
              {d.label}
            </span>
            <span className="cluster" style={{ gap: 16 }}>
              <StatusLabel status={d.status}>{d.status === "checking" ? "Checking" : undefined}</StatusLabel>
              <button type="button" className="btn btn-sm">View</button>
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
