import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "All posts",
  description: "All available posts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
