import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.mobazha.org"),
  title: {
    default: "Mobazha Documentation",
    template: "%s · Mobazha Documentation",
  },
  description:
    "Trusted guides, references, policies, and project knowledge for Mobazha users, operators, developers, and agents.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Mobazha Documentation",
    description: "Trusted Mobazha guidance for people and agents.",
    url: "https://docs.mobazha.org",
    siteName: "Mobazha Documentation",
  },
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
