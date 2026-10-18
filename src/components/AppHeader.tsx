"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "renter" | "broker";

const tabs: Record<Role, { href: string; label: string }[]> = {
  renter: [
    { href: "/passport", label: "Passport" },
    { href: "/applications", label: "Applications" },
    { href: "/access", label: "Access" },
  ],
  broker: [
    { href: "/broker/listings", label: "Listings" },
    { href: "/broker/applicants", label: "Applicants" },
    { href: "/broker/activity", label: "Activity" },
  ],
};

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export function AppHeader({ role, initials }: { role: Role; initials: string }) {
  const pathname = usePathname();

  return (
    <header className="app-header">
      <nav className="nav" aria-label="Main">
        <Link href={role === "renter" ? "/passport" : "/broker/listings"} className="brand">
          <span className="brand-mark" aria-hidden="true">N</span>
          NoxFlox
        </Link>
        {tabs[role].map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="nav-link"
            aria-current={isActive(pathname, tab.href) ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="header-right">
        <span className="demo-label">DEMO VIEW</span>
        <span className="seg" role="group" aria-label="Switch demo view">
          <Link href="/passport" aria-current={role === "renter" ? "page" : undefined}>
            Renter
          </Link>
          <Link href="/broker/listings" aria-current={role === "broker" ? "page" : undefined}>
            Broker
          </Link>
        </span>
        <span className="avatar" aria-label="Account">{initials}</span>
      </div>
    </header>
  );
}
