// Sample data for the front-end prototype. Nothing here is real.
// When the backend lands, these become queries against the schema in
// docs/technical-overview.md; the shapes intentionally mirror it.

export type DocumentStatus = "checked" | "checking" | "missing";

export interface PassportDocument {
  kind: string;
  label: string;
  status: DocumentStatus;
  detail?: string;
  href?: string;
}

export interface Listing {
  id: string;
  address: string;
  unit: string;
  neighborhood: string;
  rent: number;
  available: string;
  applicants: number;
  readyForReview: number;
}

/** Fixed "today" so dates in the prototype stay consistent. */
export const TODAY = new Date(2026, 9, 18);

export const renter = {
  firstName: "John",
  fullName: "John Davis",
  shortName: "John D.",
  initial: "J",
  householdIncome: 300_000,
  moveIn: "Nov 1, 2026",
};

export const broker = {
  name: "Maya Chen",
  firstName: "Maya",
  initials: "MC",
};

export const passportDocuments: PassportDocument[] = [
  { kind: "government_id", label: "Government ID", status: "checked" },
  { kind: "employment_letter", label: "Employment letter", status: "checked" },
  {
    kind: "pay_stub",
    label: "Pay stubs",
    status: "checked",
    detail: "3 of 3 checked",
    href: "/passport/documents/pay-stubs",
  },
  { kind: "bank_statement", label: "Bank statements", status: "checked", detail: "3 of 3 checked" },
  { kind: "w2", label: "W-2 / 1099", status: "checked" },
  { kind: "tax_return", label: "Tax return", status: "checking" },
  { kind: "landlord_reference", label: "Landlord reference", status: "missing" },
];

export const household = [
  { initials: "JD", name: "John Davis", you: true, role: "Primary applicant", income: 185_000, state: "86% ready" },
  { initials: "SR", name: "Sam Rivera", you: false, role: "Co-applicant", income: 115_000, state: "Ready" },
];

export const pendingInvites = [
  { initials: "LD", name: "Linda Davis", role: "Guarantor", invited: "Oct 17" },
];

export const listings: Listing[] = [
  { id: "123-w-10th-4b", address: "123 W 10th Street", unit: "Apt 4B", neighborhood: "West Village", rent: 4850, available: "Nov 1", applicants: 7, readyForReview: 4 },
  { id: "225-e-74th-8c", address: "225 E 74th Street", unit: "Apt 8C", neighborhood: "Upper East Side", rent: 5600, available: "Nov 15", applicants: 4, readyForReview: 3 },
  { id: "81-christopher-3a", address: "81 Christopher Street", unit: "Apt 3A", neighborhood: "West Village", rent: 6250, available: "Available now", applicants: 3, readyForReview: 1 },
  { id: "410-w-24th-5d", address: "410 W 24th Street", unit: "Apt 5D", neighborhood: "Chelsea", rent: 5150, available: "Nov 1", applicants: 2, readyForReview: 2 },
  { id: "170-e-88th-12b", address: "170 E 88th Street", unit: "Apt 12B", neighborhood: "Upper East Side", rent: 4400, available: "Nov 10", applicants: 3, readyForReview: 2 },
  { id: "37-w-12th-6f", address: "37 W 12th Street", unit: "Apt 6F", neighborhood: "Greenwich Village", rent: 7200, available: "Dec 1", applicants: 1, readyForReview: 1 },
];

export const brokerStats = { activeListings: 6, totalApplicants: 20, readyForReview: 13, newToday: 5 };

export function listingById(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

/** The application request John received from Maya. */
export const applicationRequest = {
  listingId: "123-w-10th-4b",
  expires: "Nov 17",
  required: [
    { label: "Government ID", inPassport: true },
    { label: "Employment letter", inPassport: true },
    { label: "Pay stubs (3)", inPassport: true },
    { label: "Bank statements (3)", inPassport: true },
    { label: "W-2 / 1099", inPassport: true },
    { label: "Tax return", inPassport: true },
    { label: "Landlord reference", inPassport: false },
  ],
};

export const shareableDocuments = [
  { id: "government_id", label: "Government ID", defaultOn: true },
  { id: "employment_letter", label: "Employment letter", defaultOn: true },
  { id: "pay_stub", label: "Pay stubs (3)", defaultOn: true },
  { id: "bank_statement", label: "Bank statements (3)", defaultOn: true },
  { id: "w2", label: "W-2 / 1099", defaultOn: true },
  { id: "tax_return", label: "Tax return", defaultOn: false },
];

export interface ActiveShare {
  id: string;
  initials: string;
  broker: string;
  listing: string;
  scope: "Full application" | "Summary only";
  lastOpened: string;
  expires: string;
}

export const activeShares: ActiveShare[] = [
  { id: "s1", initials: "MC", broker: "Maya Chen", listing: "123 W 10th Street · Apt 4B", scope: "Full application", lastOpened: "Today, 6:42 PM", expires: "Nov 17" },
  { id: "s2", initials: "DO", broker: "Daniel Ortiz", listing: "225 E 74th Street · Apt 8C", scope: "Summary only", lastOpened: "Oct 16, 11:05 AM", expires: "Oct 23" },
];

export const renterActivity = [
  { time: "Today, 6:44 PM", text: "Maya Chen downloaded Pay stub · Oct 15" },
  { time: "Today, 6:42 PM", text: "Maya Chen opened your application summary" },
  { time: "Today, 6:30 PM", text: "You shared a full application with Maya Chen" },
  { time: "Oct 16, 11:05 AM", text: "Daniel Ortiz opened your application summary" },
  { time: "Oct 9, 9:12 AM", text: "You revoked Priya Shah's access" },
];

export interface ApplicantSummary {
  id: string;
  names: string;
  listingId: string;
  state: "Ready for review" | "Complete" | "In progress";
  shared: string;
  hasDetail: boolean;
}

export const applicants: ApplicantSummary[] = [
  { id: "john-sam", names: "John D. & Sam R.", listingId: "123-w-10th-4b", state: "Ready for review", shared: "Today, 6:30 PM", hasDetail: true },
  { id: "ana-p", names: "Ana P.", listingId: "225-e-74th-8c", state: "Complete", shared: "Oct 17, 9:20 AM", hasDetail: false },
  { id: "leo-k", names: "Leo K.", listingId: "410-w-24th-5d", state: "In progress", shared: "Not shared yet", hasDetail: false },
];

export const applicantDetail = {
  id: "john-sam",
  names: "John D. & Sam R.",
  listingId: "123-w-10th-4b",
  sharedAt: "Today at 6:30 PM",
  expires: "Nov 17",
  householdIncome: 300_000,
  people: [
    { name: "John D.", employer: "Hudson Analytics, since 2022", income: 185_000 },
    { name: "Sam R.", employer: "NYC public schools, since 2019", income: 115_000 },
  ],
  rentalHistory: "2 prior NYC leases",
  landlordReference: "Not provided yet",
  documentsChecked: 11,
  documentsTotal: 12,
  documents: [
    { label: "Government ID", status: "checked" as DocumentStatus },
    { label: "Employment letter", status: "checked" as DocumentStatus },
    { label: "Pay stubs · Sep 15, Sep 30, Oct 15", status: "checked" as DocumentStatus },
    { label: "Bank statements · Jul–Sep", status: "checked" as DocumentStatus },
    { label: "W-2 · 2025", status: "checked" as DocumentStatus },
    { label: "Tax return · 2025", status: "checking" as DocumentStatus },
  ],
};

export type ActivityCategory = "applications" | "documents" | "access";

export const brokerActivity: { day: string; time: string; who?: string; text: string; sub: string; category: ActivityCategory }[] = [
  { day: "Today", time: "6:30 PM", who: "John D. & Sam R.", text: "shared a full application", sub: "123 W 10th Street · Apt 4B", category: "applications" },
  { day: "Today", time: "4:12 PM", who: "Ana P.", text: "added the tax return you requested", sub: "225 E 74th Street · Apt 8C", category: "documents" },
  { day: "Today", time: "1:47 PM", who: "Leo K.", text: "opened your application link", sub: "410 W 24th Street · Apt 5D · hasn't shared yet", category: "applications" },
  { day: "Today", time: "10:05 AM", who: "Priya S.", text: "revoked your access", sub: "81 Christopher Street · Apt 3A · her documents are no longer available", category: "access" },
  { day: "Yesterday", time: "5:58 PM", text: "You requested a tax return from Ana P.", sub: "225 E 74th Street · Apt 8C", category: "documents" },
  { day: "Yesterday", time: "2:20 PM", text: "You added 410 W 24th Street · Apt 5D", sub: "Application link created", category: "applications" },
  { day: "Yesterday", time: "11:31 AM", who: "Marcus T.", text: "'s access expired", sub: "170 E 88th Street · Apt 12B · ask him to share again if needed", category: "access" },
];

// ---------- helpers ----------

export const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** NYC's common "40× rent" rule: annual income vs. monthly rent. */
export const incomeToRent = (annualIncome: number, monthlyRent: number) =>
  Math.round(annualIncome / monthlyRent);

export const maxRentAt40x = (annualIncome: number) => annualIncome / 40;

export const shortDate = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const addDays = (d: Date, days: number) => {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
};
