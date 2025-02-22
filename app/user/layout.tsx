import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Profile",
  description: "User profile",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className + "p-10 max-w-[800px] w-full"}>
      {children}
    </div>
  );
}
