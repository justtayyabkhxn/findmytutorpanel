import "./globals.css";
import React from "react";
import Link from "next/link";
import { Home, Users } from "lucide-react"; // Lucide icons

export const metadata = {
  title: "FindMyTutor Panel",
  description: "Tutor management panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/logo.png" type="image/x-icon" />
      </head>
      <body className="w-full min-h-screen bg-[#1B1E24]/100 text-[#E4D7BD]">
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-[#2B2F37]/70 backdrop-blur-lg border-b border-[#4B4A45] shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 hover:scale-105 transition-transform duration-300"
              aria-label="Go to homepage"
            >
              <img
                src="/logo.png"
                alt="FindMyTutor"
                height={80}
                width={80}
                className="rounded-3xl"
              />
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-8 text-base font-semibold">
              <Link
                href="/"
                className="relative flex items-center gap-2 text-[#E4D7BD] hover:text-[#9A8F7C] transition-colors duration-300"
              >
                <Home size={18} />
                Home
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-[#9A8F7C] scale-x-0 origin-left transition-transform duration-300 hover:scale-x-100"></span>
              </Link>
              <Link
                href="/assigned-tutors"
                className="relative flex items-center gap-2 text-[#E4D7BD] hover:text-[#9A8F7C] transition-colors duration-300"
              >
                <Users size={18} />
                Assigned Tutors
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-[#9A8F7C] scale-x-0 origin-left transition-transform duration-300 hover:scale-x-100"></span>
              </Link>
              {/* <Link
                href="/leadership-board"
                className="relative flex items-center gap-2 text-[#E4D7BD] hover:text-[#9A8F7C] transition-colors duration-300"
              >
                <Trophy size={18} />
                Leardership Board
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-[#9A8F7C] scale-x-0 origin-left transition-transform duration-300 hover:scale-x-100"></span>
              </Link> */}
            </nav>
          </div>
        </header>

        {/* Render children */}
        {children}
      </body>
    </html>
  );
}
