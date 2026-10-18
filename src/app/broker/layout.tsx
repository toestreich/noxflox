import { AppHeader } from "@/components/AppHeader";
import { broker } from "@/lib/mock-data";

export default function BrokerLayout({ children }: LayoutProps<"/broker">) {
  return (
    <>
      <AppHeader role="broker" initials={broker.initials} />
      {children}
    </>
  );
}
