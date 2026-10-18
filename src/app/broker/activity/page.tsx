import Link from "next/link";
import { PageHeading } from "@/components/ui";
import { ActivityFeed } from "./ActivityFeed";

export const metadata = { title: "Activity" };

export default function Activity() {
  return (
    <main className="page page-wide">
      <PageHeading
        eyebrow="Activity"
        title="What's happened."
        lede="Applications, documents and access changes across all your listings."
      />

      <div className="split">
        <ActivityFeed />

        <aside className="side">
          <section className="card">
            <h2 className="card-title">Needs your attention</h2>
            <Link href="/broker/applicants/john-sam" className="row" style={{ textDecoration: "none", fontSize: 14 }}>
              <span>Review <strong>John D. &amp; Sam R.</strong></span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/broker/applicants?listing=225-e-74th-8c" className="row" style={{ textDecoration: "none", fontSize: 14 }}>
              <span>Ana P.&apos;s application is now complete</span>
              <span aria-hidden="true">→</span>
            </Link>
            <div className="row" style={{ fontSize: 14 }}>
              <span>2 shares expire in the next 3 days</span>
            </div>
          </section>

          <section className="card card-muted">
            <h2 className="card-title">Applicants see your activity too</h2>
            <p className="lede" style={{ fontSize: 14, color: "var(--ink-2)" }}>
              Each time you open an application or document, it appears in the applicant&apos;s access log.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
