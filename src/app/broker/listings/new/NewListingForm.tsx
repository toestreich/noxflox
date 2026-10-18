"use client";

import { useState } from "react";

const REQUIREMENTS = [
  { label: "Government ID", on: true },
  { label: "Employment letter", on: true },
  { label: "Pay stubs (3)", on: true },
  { label: "Bank statements (3)", on: true },
  { label: "W-2 / 1099", on: true },
  { label: "Tax return", on: true },
  { label: "Landlord reference", on: false },
  { label: "Guarantor", on: false },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32);

export function NewListingForm() {
  const [address, setAddress] = useState("410 W 24th Street");
  const [unit, setUnit] = useState("Apt 5D");
  const [created, setCreated] = useState(false);
  const [copied, setCopied] = useState(false);

  const link = `noxflox.app/apply/${slugify(`${address} ${unit}`) || "your-listing"}`;

  return (
    <div className="split">
      <form
        className="card main"
        style={{ gap: 22, padding: 28 }}
        onSubmit={(e) => {
          e.preventDefault();
          // Prototype: the listing isn't saved anywhere.
          setCreated(true);
        }}
      >
        <div className="grid-3">
          <label className="field span-2">
            Address
            <input value={address} onChange={(e) => setAddress(e.target.value)} required />
          </label>
          <label className="field">
            Unit
            <input value={unit} onChange={(e) => setUnit(e.target.value)} />
          </label>
          <label className="field">
            Neighborhood
            <input defaultValue="Chelsea" />
          </label>
          <label className="field">
            Monthly rent
            <input defaultValue="$5,150" inputMode="numeric" />
          </label>
          <label className="field">
            Available
            <input defaultValue="Nov 1" />
          </label>
        </div>

        <fieldset className="fieldset">
          <legend className="legend">Required from applicants</legend>
          <div className="grid-2">
            {REQUIREMENTS.map((r) => (
              <label key={r.label} className="check-tile">
                <input type="checkbox" defaultChecked={r.on} />
                {r.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="cluster" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
          <label className="field">
            Link stays open
            <select defaultValue="rented" style={{ minWidth: 200 }}>
              <option value="rented">Until listing is rented</option>
              <option value="30">30 days</option>
              <option value="14">14 days</option>
            </select>
          </label>
          <button type="submit" className="btn btn-primary">{created ? "Listing created ✓" : "Create listing"}</button>
        </div>
      </form>

      <aside className="side">
        <section className="card stack" style={{ gap: 14 }}>
          <h2 className="card-title" style={{ margin: 0 }}>Application link</h2>
          <div className="code-box" style={{ opacity: created ? 1 : 0.55 }}>{link}</div>
          <div className="cluster" style={{ flexWrap: "nowrap" }}>
            <button
              type="button"
              className="btn"
              style={{ flex: 1 }}
              disabled={!created}
              onClick={() => {
                navigator.clipboard?.writeText(`https://${link}`).then(() => setCopied(true), () => undefined);
              }}
            >
              {copied ? "Copied" : "Copy link"}
            </button>
            <button type="button" className="btn" style={{ flex: 1 }} disabled={!created}>QR for showing</button>
          </div>
          <p className="muted small" style={{ margin: 0, lineHeight: 1.5 }} aria-live="polite">
            {created
              ? "Paste it into your StreetEasy replies, or show the QR code at the open house."
              : "Ready once the listing is created."}
          </p>
        </section>

        <section className="card">
          <h2 className="card-title">What applicants see</h2>
          {[
            "Your name, the address and rent",
            "Which of your required documents they already have",
            "Whether they meet the 40× income rule for this rent",
          ].map((t, i) => (
            <div key={t} className="row" style={{ justifyContent: "flex-start", fontSize: 14 }}>
              <span className="serif muted">{i + 1}</span>
              {t}
            </div>
          ))}
        </section>
      </aside>
    </div>
  );
}
