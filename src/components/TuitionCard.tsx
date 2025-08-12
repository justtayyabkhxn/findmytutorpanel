"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Briefcase, ArrowRight } from "lucide-react";

export interface Tutor {
  _id: string;
  name: string;
  qualification: string;
  experience: number;
  dateJoined: string; // or Date if you parse it before passing
}

interface TutorCardProps {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="flex items-center justify-between bg-[#2B2F37]/80 border border-[#4B4A45] rounded-2xl p-4 shadow-lg hover:shadow-[#9A8F7C]/20 transition-all duration-300">
      {/* Left Date/Tag Box */}
      <div className="flex flex-col items-center justify-center bg-[#9A8F7C]/20 border border-[#9A8F7C]/50 text-[#E4D7BD] rounded-xl px-4 py-3 min-w-[90px]">
        <span className="text-xs uppercase tracking-wide opacity-80">
          Joined
        </span>
        <span className="text-lg font-bold">
          {new Date(tutor.dateJoined).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          })}
        </span>
      </div>

      {/* Middle Content */}
      <div className="flex-1 px-5">
        <h2 className="text-lg font-bold text-[#E4D7BD]">{tutor.name}</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#E4D7BD]/80 mt-1">
          <span className="flex items-center">
            <GraduationCap size={14} className="mr-1 text-[#9A8F7C]" />
            {tutor.qualification}
          </span>
          <span className="flex items-center">
            <Briefcase size={14} className="mr-1 text-[#9A8F7C]" />
            {tutor.experience} yrs
          </span>
        </div>
      </div>

      {/* Right Action Button */}
      <Link
        href={`/tutors/${tutor._id}`}
        onClick={() => setClicked(true)}
        className={`flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-full shadow transition-transform duration-150 active:scale-95 ${
          clicked
            ? "bg-[#1B1E24] text-[#E4D7BD]"
            : "bg-[#E4D7BD] text-[#1B1E24] hover:bg-[#9A8F7C] hover:text-[#E4D7BD]"
        }`}
      >
        View <ArrowRight size={14} />
      </Link>
    </div>
  );
}
