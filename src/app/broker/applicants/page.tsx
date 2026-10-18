import Link from "next/link";
import { PageHeading } from "@/components/ui";
import { applicants, listingById } from "@/lib/mock-data";

export const metadata = { title: "Applicants" };

export default async function Applicants({ searchParams }: PageProps<"/broker/applicants">) {
  const { listing: listingParam } = await searchParams;
  const listingId = typeof listingParam === "string" ? listingParam : undefined;
  const listing = listingId ? listingById(listingId) : undefined;
  const rows = listing ? applicants.filter((a) => a.listingId === listing.id) : applicants;

  return (
    <main className="page page-wide">
      <PageHeading
        eyebrow="Applicants"
        title={listing ? `${listing.address} · ${listing.unit}` : "Everyone who's applied."}
        lede={
          listing ? (
            <>
              Showing applicants for this listing. <Link href="/broker/applicants">Show all</Link>
            </>
          ) : (
            "Applications shared with you across all listings."
          )
        }
      />

      <section className="card">
        {rows.length === 0 && <p className="lede">No applicants in this prototype for this listing yet.</p>}
        {rows.map((a, i) => {
          const l = listingById(a.listingId)!;
          return (
            <div key={a.id} className="listing-row" style={i === 0 ? { borderTop: "none" } : undefined}>
              <div>
                <div className="listing-address">{a.names}</div>
                <div className="muted small">{l.address} · {l.unit}</div>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{a.state}</div>
                <div className="muted small">status</div>
              </div>
              <div>
                <div style={{ fontSize: 15 }}>{a.shared}</div>
                <div className="muted small">shared</div>
              </div>
              {a.hasDetail ? (
                <Link href={`/broker/applicants/${a.id}`} className="btn">Review →</Link>
              ) : (
                <span className="muted small" style={{ textAlign: "right" }}>Not in prototype</span>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}
