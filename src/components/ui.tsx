import type { ReactNode } from "react";
import type { DocumentStatus } from "@/lib/mock-data";

export function PageHeading({
  eyebrow,
  title,
  lede,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="title">{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {action}
    </div>
  );
}

export function Row({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="row">
      <span className="row-label">{label}</span>
      <strong className="row-value">{value}</strong>
    </div>
  );
}

const statusText: Record<DocumentStatus, string> = {
  checked: "Checked",
  checking: "Checking…",
  missing: "Missing",
};

export function StatusLabel({ status, children }: { status: DocumentStatus; children?: ReactNode }) {
  const cls =
    status === "checked" ? "status" : status === "checking" ? "status status-pending" : "status status-warn";
  return <span className={cls}>{children ?? statusText[status]}</span>;
}

export function CheckSquare({ state }: { state: DocumentStatus }) {
  if (state === "missing") return <span className="check-square check-square-empty" aria-hidden="true" />;
  return (
    <span className="check-square" aria-hidden="true">
      {state === "checked" ? "✓" : "…"}
    </span>
  );
}
