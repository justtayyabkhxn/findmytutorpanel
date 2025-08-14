"use client";

import { useEffect, useState, useRef } from "react";
import TutorCard from "@/components/TuitionCard";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface Tutor {
  _id: string;
  name: string;
  qualification: string;
  experience: number;
  dateJoined: string;
  assignedTuitions: [string, string][]; // [tuitionId, date]
}

export default function AssignedTutors() {
  const [assigned, setAssigned] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function fetchTutors() {
      try {
        const res = await fetch(`${baseUrl}/api/tutors`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch tutors");

        const tutors: Tutor[] = await res.json();

        // Filter tutors with assignedTuitions and sort by the latest date
        const filtered = tutors
          .filter(t => Array.isArray(t.assignedTuitions) && t.assignedTuitions.length > 0)
          .sort((a, b) => {
            const aDate = new Date(a.assignedTuitions[a.assignedTuitions.length - 1][1]).getTime();
            const bDate = new Date(b.assignedTuitions[b.assignedTuitions.length - 1][1]).getTime();
            return bDate - aDate; // Descending (most recent first)
          });

        setAssigned(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTutors();
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-hidden text-[#E4D7BD]"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundPosition: "top left",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0F1115]/90 z-0"></div>

      {/* Hero Section */}
      <section className="relative text-center py-10 px-6 z-10">
        <div className="max-w-4xl mx-auto relative z-10 items-center">
          <center>
            <img src="/logo.png" width={100} height={100} alt="Logo" />
          </center>
          <h1 className="text-2xl lg:text-5xl md:text-5xl font-extrabold flex justify-center items-center gap-3 drop-shadow-[0_4px_15px_rgba(154,143,124,0.4)]">
            Tutors with Assigned Tuitions
          </h1>
          <p className="mt-1 text-lg text-orange-300/80 font-bold max-w-2xl mx-auto leading-relaxed tracking-tighter">
            Explore our dedicated tutors who are actively guiding students to success.
          </p>
        </div>
      </section>

      {/* Tutors Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <h2 className="text-3xl font-bold text-[#E4D7BD] mb-10 drop-shadow-[0_2px_10px_rgba(228,215,189,0.3)]">
          All Assigned Tutors
        </h2>
        {loading ? (
          <p className="text-[#E4D7BD]/60 italic">Loading...</p>
        ) : assigned.length === 0 ? (
          <p className="text-[#E4D7BD]/60 italic">
            No tutors have assigned tuitions yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {assigned.map((t) => (
              <TutorCard key={t._id} tutor={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
