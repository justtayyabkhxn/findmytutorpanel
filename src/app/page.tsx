import TutorCard from "@/components/TuitionCard";
import { Users, Trophy } from "lucide-react";

interface Tutor {
  _id: string;
  name: string;
  qualification: string;
  experience: number;
  dateJoined: string;
  assignedTuitions?: string[]; // or your actual structure if populated
}

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tutors`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tutors");
  }

  const tutors: Tutor[] = await res.json();

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundPosition: "top left",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0F1115]/80 z-0"></div>

      {/* Hero Section */}
      <section className="relative text-center py-24 px-6 z-10">
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#E4D7BD] flex justify-center items-center gap-4 drop-shadow-[0_4px_15px_rgba(154,143,124,0.4)]">
            <Users className="text-orange-300 w-12 h-12 drop-shadow-[0_0_10px_rgba(154,143,124,0.5)]" />
            Find Your Perfect Tutor
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-orange-300/80 max-w-2xl mx-auto leading-relaxed tracking-tighter font-bold">
            Discover skilled tutors ready to help you excel in your learning journey.
            Learn faster, achieve more, and enjoy the process.
          </p>
          <button className="mt-10 px-10 py-4 bg-[#9A8F7C] font-bold tracking-wider text-white rounded-full shadow-xl shadow-[#9A8F7C]/30 hover:bg-[#E4D7BD] hover:text-[#0F1115] cursor-pointer transition-all flex items-center mx-auto gap-3">
            <Trophy className="w-5 h-5" />
            Leadership Board
          </button>
        </div>
      </section>

      {/* Tutors List */}
      <section className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
        <h2 className="text-3xl font-bold text-[#E4D7BD] mb-10 drop-shadow-[0_2px_10px_rgba(228,215,189,0.3)]">
          All Tutors
        </h2>
        {tutors.length === 0 ? (
          <p className="text-[#E4D7BD]/60 italic">No tutors available at the moment.</p>
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
