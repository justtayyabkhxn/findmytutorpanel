"use client";
import "./globals.css";
import React from "react";
import { Home, Users } from "lucide-react";

function NavbarButton({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  const isActive =
    typeof window !== "undefined" && window.location.pathname === href;

  return (
    <button
      onClick={() => (window.location.href = href)}
      className={`relative flex items-center gap-2 cursor-pointer transition-all duration-150 active:scale-95 ${
        isActive ? "text-[#9A8F7C]" : "text-[#E4D7BD] hover:text-[#9A8F7C]"
      }`}
    >
      <Icon size={18} />
      {label}
      {/* underline */}
      <span
        className={`absolute left-0 -bottom-1 w-full h-0.5 bg-[#9A8F7C] transition-transform duration-300 origin-left ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      ></span>
    </button>
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
      <body className="w-full min-h-screen bg-[#1B1E24] text-[#E4D7BD]">
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-[#2B2F37]/50 border-b border-[#4B4A45] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 flex justify-center items-center gap-6">
            <NavbarButton href="/" icon={Home} label="Home" />
            <NavbarButton
              href="/assigned-tutors"
              icon={Users}
              label="Assigned Tutors"
            />
          </div>
        </header>

        {/* Page Content */}
        {children}
      </body>
    </html>
  );
}
