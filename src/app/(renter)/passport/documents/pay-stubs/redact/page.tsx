import Link from "next/link";
import { PageHeading } from "@/components/ui";
import { RedactionEditor } from "./RedactionEditor";

export const metadata = { title: "Hide sensitive details" };

export default function RedactPage() {
  return (
    <main className="page page-wide" style={{ paddingTop: 40 }}>
      <Link href="/passport/documents/pay-stubs" className="back-link">← Pay stubs</Link>
      <PageHeading
        eyebrow="Pay stub · Sep 1 – 15"
        title="Hide sensitive details."
        lede="We found 3 things you may not want to share. Hidden areas are permanently removed."
      />
      <RedactionEditor />
    </main>
  );
}
