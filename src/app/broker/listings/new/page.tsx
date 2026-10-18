import Link from "next/link";
import { PageHeading } from "@/components/ui";
import { NewListingForm } from "./NewListingForm";

export const metadata = { title: "Add a listing" };

export default function NewListing() {
  return (
    <main className="page page-wide" style={{ paddingTop: 48 }}>
      <Link href="/broker/listings" className="back-link">← Your listings</Link>
      <PageHeading
        eyebrow="New listing"
        title="Add a listing."
        lede="You'll get one application link for this apartment. Applicants reuse their NoxFlox passport and only fill the gaps."
      />
      <NewListingForm />
    </main>
  );
}
