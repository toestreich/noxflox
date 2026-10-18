"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const needs = [
  "A government ID",
  "Recent pay stubs and bank statements",
  "Last year's W-2 or tax return",
  "An employment letter, if you have one",
];

export default function SignUp() {
  const router = useRouter();
  const [role, setRole] = useState<"renter" | "broker">("renter");

  return (
    <>
      <header className="app-header">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">N</span>
          NoxFlox
        </Link>
        <Link href="/passport" className="nav-link">Already have an account? Sign in</Link>
      </header>

      <main className="page" style={{ paddingTop: 72 }}>
        <div className="split" style={{ justifyContent: "center", gap: 48 }}>
          <div className="main" style={{ maxWidth: 460, gap: 24 }}>
            <div>
              <span className="eyebrow" style={{ border: "1px solid var(--field-border)", borderRadius: 999, padding: "6px 12px" }}>
                Free for renters
              </span>
              <h1 className="title" style={{ marginTop: 18 }}>Create your Rental Passport.</h1>
              <p className="lede" style={{ fontSize: 16 }}>
                One application you build once and share with any broker. No passwords: we email you a sign-in link.
              </p>
            </div>

            <form
              className="card stack"
              style={{ gap: 18, padding: 28 }}
              onSubmit={(e) => {
                e.preventDefault();
                // Prototype: no account is created. Jump into the matching demo view.
                router.push(role === "renter" ? "/passport" : "/broker/listings");
              }}
            >
              <fieldset className="fieldset">
                <legend className="legend">I&apos;m</legend>
                <div className="seg seg-fill seg-lg" style={{ width: "100%" }}>
                  <button type="button" aria-pressed={role === "renter"} onClick={() => setRole("renter")}>
                    Looking to rent
                  </button>
                  <button type="button" aria-pressed={role === "broker"} onClick={() => setRole("broker")}>
                    A broker or landlord
                  </button>
                </div>
              </fieldset>
              <label className="field">
                {role === "renter" ? "Full legal name" : "Your name"}
                <input type="text" name="name" autoComplete="name" placeholder={role === "renter" ? "As it appears on your ID" : ""} />
              </label>
              {role === "broker" && (
                <label className="field">
                  Brokerage
                  <input type="text" name="brokerage" autoComplete="organization" />
                </label>
              )}
              <label className="field">
                Email
                <input type="email" name="email" autoComplete="email" placeholder="you@example.com" />
              </label>
              <button type="submit" className="btn btn-primary btn-block">Email me a sign-in link →</button>
              <p className="fine-print" style={{ textAlign: "center" }}>
                By continuing you agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
              </p>
            </form>
          </div>

          <aside className="side" style={{ maxWidth: 420, paddingTop: 8 }}>
            <section className="card">
              <h2 className="card-title">What you&apos;ll need, about 10 minutes</h2>
              {needs.map((n, i) => (
                <div key={n} className="row" style={{ justifyContent: "flex-start", fontSize: 14 }}>
                  <span className="serif muted" style={{ width: 14 }}>{i + 1}</span>
                  {n}
                </div>
              ))}
            </section>
            <section className="stack" style={{ gap: 14, padding: "0 4px" }}>
              <div>
                <strong style={{ fontSize: 14 }}>Private by default</strong>
                <p className="lede" style={{ fontSize: 14, marginTop: 3 }}>
                  Nothing is shared until you choose a broker, what they see, and for how long.
                </p>
              </div>
              <div>
                <strong style={{ fontSize: 14 }}>No SSN required</strong>
                <p className="lede" style={{ fontSize: 14, marginTop: 3 }}>
                  We never ask for it, and you can black it out on any document before it&apos;s uploaded.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}
