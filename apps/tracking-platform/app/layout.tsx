import { type Metadata } from "next";
import {
  SignedIn,
  SignedOut,
  UserButton,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import Sidebar from "../components/layout/sidebar/SidebarCard";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tracking platform",
  description: " Interview assignment for Full-stack Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen bg-gray-100`}
        >
          <header className="flex gap-4 justify-between p-4 w-full text-white bg-black opacity-85">
            <h1 className="text-2xl font-bold">Tracking Platform</h1>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <SignedIn>
            <main className="container flex flex-row gap-4 justify-center items-start py-10 mx-auto">
              <Sidebar />
              <div className="grow">{children}</div>
            </main>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </body>
      </html>
    </Providers>
  );
}
