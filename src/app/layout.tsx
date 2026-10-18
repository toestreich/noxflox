import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "NoxFlox", template: "%s · NoxFlox" },
  description: "Your rental application, ready before you find the apartment.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
