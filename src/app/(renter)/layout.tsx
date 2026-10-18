import { AppHeader } from "@/components/AppHeader";
import { renter } from "@/lib/mock-data";

export default function RenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader role="renter" initials={renter.initial} />
      {children}
    </>
  );
}
