import Link from "next/link";

const points = [
  {
    title: "Private by default",
    body: "You decide who can see your application, what they can access, and for how long.",
  },
  {
    title: "Ready before the listing",
    body: "Keep one reusable application package prepared for NYC's fastest-moving rentals.",
  },
  {
    title: "See every access",
    body: "Know when your application is opened and revoke a broker's access at any time.",
  },
];

export default function Landing() {
  return (
    <>
      <header className="app-header">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">N</span>
          NoxFlox
        </Link>
        <Link href="/passport" className="nav-link">View demo</Link>
      </header>

      <main className="page" style={{ alignItems: "center", textAlign: "center", paddingTop: 112 }}>
        <span className="eyebrow" style={{ border: "1px solid var(--field-border)", borderRadius: 999, padding: "6px 12px" }}>
          Built for New York renters
        </span>
        <h1 className="title" style={{ fontSize: 64, maxWidth: 760 }}>
          Your rental application. Ready before you find the apartment.
        </h1>
        <p className="lede" style={{ fontSize: 18, maxWidth: 620 }}>
          Build one secure Rental Passport. Apply faster without repeatedly emailing your financial life to people you
          just met.
        </p>
        <Link href="/signup" className="btn btn-primary" style={{ minWidth: 320, minHeight: 48, marginTop: 12 }}>
          Explore the beta →
        </Link>
        <p className="fine-print">Free for renters · Synthetic demo data · Revoke access anytime</p>

        <div
          className="grid-3"
          style={{ width: "100%", textAlign: "left", marginTop: 72, paddingTop: 48, borderTop: "1px solid var(--border)" }}
        >
          {points.map((p) => (
            <div key={p.title} style={{ padding: "0 24px" }}>
              <h2 style={{ fontSize: 15, margin: "0 0 10px" }}>{p.title}</h2>
              <p className="lede">{p.body}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
