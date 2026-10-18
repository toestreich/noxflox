"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Row } from "@/components/ui";
import {
  TODAY,
  addDays,
  applicationRequest,
  broker,
  incomeToRent,
  listingById,
  renter,
  shareableDocuments,
  shortDate,
} from "@/lib/mock-data";

const EXPIRY_OPTIONS = [7, 30, 60] as const;

export function ShareForm() {
  const router = useRouter();
  const listing = listingById(applicationRequest.listingId)!;
  const [scope, setScope] = useState<"full" | "summary">("full");
  const [expiryDays, setExpiryDays] = useState<(typeof EXPIRY_OPTIONS)[number]>(30);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(shareableDocuments.filter((d) => d.defaultOn).map((d) => d.id)),
  );

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const docCount = scope === "full" ? selected.size : 0;

  return (
    <form
      className="split"
      onSubmit={(e) => {
        e.preventDefault();
        // Prototype: nothing is saved. The access page shows the resulting share.
        router.push("/access");
      }}
    >
      <div className="main">
        <section className="card">
          <fieldset className="fieldset stack">
            <legend className="card-title" style={{ marginBottom: 12 }}>Access level</legend>
            <label className="choice">
              <input type="radio" name="scope" checked={scope === "full"} onChange={() => setScope("full")} />
              <span className="stack" style={{ gap: 4 }}>
                <strong style={{ fontSize: 15 }}>Full application</strong>
                <span className="muted" style={{ fontSize: 14 }}>
                  Summary plus the documents you select below. Most landlords need this.
                </span>
              </span>
            </label>
            <label className="choice">
              <input type="radio" name="scope" checked={scope === "summary"} onChange={() => setScope("summary")} />
              <span className="stack" style={{ gap: 4 }}>
                <strong style={{ fontSize: 15 }}>Summary only</strong>
                <span className="muted" style={{ fontSize: 14 }}>
                  Income-to-rent, employment and household. No documents leave your passport.
                </span>
              </span>
            </label>
          </fieldset>
        </section>

        <section className="card">
          <fieldset className="fieldset" disabled={scope === "summary"}>
            <legend className="card-title">Documents</legend>
            {shareableDocuments.map((d) => (
              <label key={d.id} className="check-row">
                {d.label}
                <input
                  type="checkbox"
                  checked={scope === "full" && selected.has(d.id)}
                  onChange={() => toggle(d.id)}
                />
              </label>
            ))}
          </fieldset>
        </section>
      </div>

      <div className="side">
        <section className="card">
          <fieldset className="fieldset">
            <legend className="card-title" style={{ marginBottom: 12 }}>Access expires after</legend>
            <div className="seg seg-fill seg-lg" style={{ width: "100%" }}>
              {EXPIRY_OPTIONS.map((days) => (
                <button
                  key={days}
                  type="button"
                  aria-pressed={expiryDays === days}
                  onClick={() => setExpiryDays(days)}
                >
                  {days} days
                </button>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="card" aria-live="polite">
          <h2 className="card-title">{broker.firstName} will see</h2>
          <Row label="Income to rent" value={`${incomeToRent(renter.householdIncome, listing.rent)}×`} />
          <Row label="Household" value="2 applicants" />
          <Row label="Documents" value={scope === "full" ? `${docCount} selected` : "None"} />
          <Row label="Expires" value={shortDate(addDays(TODAY, expiryDays))} />
          <p className="fine-print" style={{ marginTop: 8, fontSize: 13 }}>
            NoxFlox never collects your SSN. Bank account numbers are masked, and anything you leave unchecked stays
            private.
          </p>
        </section>

        <button type="submit" className="btn btn-primary btn-block">Share with {broker.firstName} →</button>
      </div>
    </form>
  );
}
