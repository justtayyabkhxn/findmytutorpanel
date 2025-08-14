"use client";

import { useState } from "react";
import { GraduationCap, Briefcase, ArrowRight, BookOpen } from "lucide-react";

interface Tutor {
  _id: string;
  name: string;
  qualification: string;
  experience: number;
  dateJoined: string;
  assignedTuitions?: [string, string][]; // [tuitionName, assignedDate]
}

interface TutorCardProps {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const [clicked, setClicked] = useState(false);

  const latest = tutor.assignedTuitions?.[tutor.assignedTuitions.length - 1];
  const latestName = latest?.[0] || "N/A";
  const latestDate = latest?.[1]
    ? new Date(latest[1]).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div className="flex flex-col gap-2 bg-[#2B2F37]/80 border border-[#4B4A45] rounded-xl p-3 shadow-md hover:shadow-[#9A8F7C]/20 transition-all duration-300 hover:scale-[1.02]">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center justify-center bg-[#9A8F7C]/20 border border-[#9A8F7C]/50 text-[#E4D7BD] rounded-lg px-3 py-2 min-w-[70px]">
          <span className="text-[10px] uppercase tracking-wide opacity-80">
            Joined
          </span>
          <span className="text-sm font-bold">
            {new Date(tutor.dateJoined).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        </div>

        <button
          onClick={() => (window.location.href = `/tutors/${tutor._id}`)}
          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full shadow-sm transition-all duration-150 active:scale-95 ${
            clicked
              ? "bg-[#1B1E24] text-[#E4D7BD]"
              : "bg-[#E4D7BD] text-[#1B1E24] hover:bg-[#9A8F7C] hover:text-[#E4D7BD]"
          }`}
        >
          View <ArrowRight size={12} />
        </button>
      </div>

      {/* Name + Details */}
      <div>
        <h2 className="text-base font-bold text-[#E4D7BD] truncate">
          {tutor.name}
        </h2>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#E4D7BD]/80 mt-0.5">
          <span className="flex items-center">
            <GraduationCap size={12} className="mr-1 text-[#9A8F7C]" />
            {tutor.qualification}
          </span>
          <span className="flex items-center">
            <Briefcase size={12} className="mr-1 text-[#9A8F7C]" />
            {tutor.experience} yrs
          </span>
        </div>
      </div>

      {/* Latest Tuition */}
      <div className="bg-[#1B1E24]/60 border border-[#4B4A45] rounded-lg p-2 mt-1">
        <p className="flex items-center text-xs text-[#E4D7BD] truncate">
          <BookOpen size={12} className="mr-1 text-[#9A8F7C]" />
          <span className="font-semibold">Latest:</span>&nbsp;
          <span className="italic">&quot;{latestName}&quot;</span>
        </p>
        <p className="text-[10px] text-[#E4D7BD]/70 mt-0.5">
          Date: {latestDate}
        </p>
      </div>
    </div>
  );
}
