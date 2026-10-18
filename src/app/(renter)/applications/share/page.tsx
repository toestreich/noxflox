import Link from "next/link";
import { PageHeading } from "@/components/ui";
import { applicationRequest, broker, listingById } from "@/lib/mock-data";
import { ShareForm } from "./ShareForm";

export const metadata = { title: "Share your application" };

export default function SharePage() {
  const listing = listingById(applicationRequest.listingId)!;

  return (
    <main className="page" style={{ paddingTop: 48 }}>
      <Link href="/applications" className="back-link">← {listing.address} · {listing.unit}</Link>
      <PageHeading
        eyebrow={`Share with ${broker.name}`}
        title={`Choose what ${broker.firstName} can see.`}
        lede="You can change this or revoke access at any time."
      />
      <ShareForm />
    </main>
  );
}
