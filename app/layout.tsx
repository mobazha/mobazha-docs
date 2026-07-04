import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mobazha Documentation",
    template: "%s · Mobazha Documentation",
  },
  description:
    "Trusted guides, references, policies, and project knowledge for Mobazha users, operators, developers, and agents.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
