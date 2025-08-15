"use client";

import { useEffect, useState, useRef } from "react";
import TutorCard from "@/components/TuitionCard";
import { Book } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface Tutor {
  _id: string;
  name: string;
  qualification: string;
  experience: number;
  dateJoined: string;
  assignedTuitions?: [string, string][]; // [tuitionId, assignedDate]
}


export default function Home() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function fetchTutors() {
  try {
    const res = await fetch(`${baseUrl}/api/tutors`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch tutors");
    let data: Tutor[] = await res.json();

    // Sort by dateJoined (latest first)
    data = data.sort(
      (a, b) =>
        new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime()
    );

    setTutors(data);
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
      className="min-h-screen relative overflow-hidden"
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
        <div className="max-w-6xl mx-auto relative z-10">
          <center>
            <img src="/logo.png" width={100} height={100} alt="Logo" />
          </center>
          <h1 className="text-3xl mt-4 lg:text-5xl md:text-5xl font-extrabold text-[#E4D7BD] flex justify-center items-center gap-4 drop-shadow-[0_4px_15px_rgba(154,143,124,0.4)]">
            Find Your Perfect Tutor
          </h1>
          <p className="mt-6 text-md lg:text-lg md:text-2xl text-orange-300/80 max-w-2xl mx-auto leading-relaxed tracking-tighter font-bold">
            Discover skilled tutors ready to help you excel in your learning
            journey. Learn faster, achieve more, and enjoy the process.
          </p>
          <button
            className="mt-10 px-10 py-4 bg-[#9A8F7C] font-bold tracking-wider text-white rounded-full shadow-xl shadow-[#9A8F7C]/30
                hover:bg-[#E4D7BD] hover:text-[#0F1115] active:bg-[#8B7C68] active:scale-95
                cursor-pointer transition-all flex items-center mx-auto gap-3"
            onClick={() => (window.location.href = "/assigned-tutors")}
          >
            <Book className="w-5 h-5" />
            Our Assigned Tutors
          </button>
        </div>
      </section>

      {/* Tutors List */}
      <section className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
        <h2 className="text-3xl font-bold text-[#E4D7BD] mb-10 drop-shadow-[0_2px_10px_rgba(228,215,189,0.3)]">
          All Tutors
        </h2>

        {loading ? (
          <p className="text-[#E4D7BD]/60 italic">Loading...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {tutors.map((t) => (
              <TutorCard key={t._id} tutor={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
