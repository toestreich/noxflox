"use client";

import { useState } from "react";

export function InviteForm() {
  const [role, setRole] = useState<"co-applicant" | "guarantor">("co-applicant");
  const [sentTo, setSentTo] = useState<string | null>(null);

  return (
    <form
      className="card stack"
      style={{ gap: 16 }}
      onSubmit={(e) => {
        e.preventDefault();
        const email = new FormData(e.currentTarget).get("email");
        // Prototype: no email is sent.
        setSentTo(typeof email === "string" && email ? email : "them");
        e.currentTarget.reset();
      }}
    >
      <h2 className="card-title" style={{ margin: 0 }}>Invite someone</h2>
      <fieldset className="fieldset">
        <legend className="legend">Their role</legend>
        <div className="seg seg-fill seg-lg" style={{ maxWidth: 360, width: "100%" }}>
          <button type="button" aria-pressed={role === "co-applicant"} onClick={() => setRole("co-applicant")}>
            Co-applicant
          </button>
          <button type="button" aria-pressed={role === "guarantor"} onClick={() => setRole("guarantor")}>
            Guarantor
          </button>
        </div>
      </fieldset>
      <div className="grid-2">
        <label className="field">
          Name
          <input type="text" name="name" required />
        </label>
        <label className="field">
          Email
          <input type="email" name="email" required />
        </label>
      </div>
      <div className="cluster" style={{ justifyContent: "space-between" }}>
        <span className="muted small" aria-live="polite">
          {sentTo
            ? `Invite to ${sentTo} ready (prototype: nothing was sent).`
            : "They'll build their own passport, free. You never see their documents."}
        </span>
        <button type="submit" className="btn btn-primary">Send invite</button>
      </div>
    </form>
  );
}
