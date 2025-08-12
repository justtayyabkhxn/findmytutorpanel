"use client"
import "./globals.css";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users } from "lucide-react";

function NavbarLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative flex items-center gap-2 transition-all duration-150 active:scale-95 ${
        isActive
          ? "text-[#9A8F7C]" // active color
          : "text-[#E4D7BD] hover:text-[#9A8F7C]"
      }`}
    >
      <Icon size={18} />
      {children}
      <span
        className={`absolute left-0 -bottom-1 w-full h-0.5 bg-[#9A8F7C] transition-transform duration-300 origin-left ${
          isActive ? "scale-x-100" : "scale-x-0 hover:scale-x-100"
        }`}
      ></span>
    </Link>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/x-icon" />
      </head>
      <body className="w-full min-h-screen bg-[#1B1E24]/100 text-[#E4D7BD]">
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-[#2B2F37]/70 backdrop-blur-lg border-b border-[#4B4A45] shadow-sm">
          <div className="max-w-7xl mx-auto px-15  py-4 flex items-center justify-between">
            {/* Logo */}
            {/* <Link
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
            </Link> */}

            {/* Nav */}
            <nav className="flex items-center gap-8 text-base font-semibold">
              <NavbarLink href="/" icon={Home}>
                Home
              </NavbarLink>
              <NavbarLink href="/assigned-tutors" icon={Users}>
                Assigned Tutors
              </NavbarLink>
            </nav>
          </div>
        </header>

        {/* Render children */}
        {children}
      </body>
    </html>
  );
}
