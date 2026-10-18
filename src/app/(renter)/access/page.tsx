import { PageHeading } from "@/components/ui";
import { activeShares, renterActivity } from "@/lib/mock-data";
import { ActiveAccess } from "./ActiveAccess";

export const metadata = { title: "Access" };

export default function AccessPage() {
  return (
    <main className="page">
      <PageHeading
        eyebrow="Access"
        title="Who can see your passport."
        lede="Every open and download is logged. Revoking takes effect immediately."
      />

      <ActiveAccess initial={activeShares} />

      <section className="card">
        <h2 className="card-title">Activity</h2>
        {renterActivity.map((a) => (
          <div key={a.time + a.text} className="timeline-row">
            <span className="timeline-time">{a.time}</span>
            <span>{a.text}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
