import { Users } from "lucide-react";
import TutorCard from "@/components/TuitionCard"; // adjust path as needed

interface Tuition {
  _id: string;
  description: string;
}

interface TutorRaw {
  _id: string;
  name: string;
  qualification: string;
  experience: number;
  dateJoined: string;
  assignedTuitions?: string[]; // from API: tuition IDs
}

interface Tutor {
  _id: string;
  name: string;
  qualification: string;
  experience: number;
  dateJoined: string;
  assignedTuitions: Tuition[]; // fully populated
}

export default async function AssignedTutors() {
  const res = await fetch(`/api/tutors`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tutors");
  }

  const tutors: TutorRaw[] = await res.json();

  const tutorsWithDetails: Tutor[] = await Promise.all(
    tutors.map(async (t) => {
      const assignedTuitions: Tuition[] = t.assignedTuitions?.length
        ? await Promise.all(
            t.assignedTuitions.map(async (tuitionId) => {
              const tuitionRes = await fetch(
                `/api/assign-tuition/${tuitionId}`,
                { cache: "no-store" }
              );
              if (!tuitionRes.ok) return null;
              return (await tuitionRes.json()) as Tuition;
            })
          ).then((results) => results.filter(Boolean) as Tuition[])
        : [];

      return {
        ...t,
        assignedTuitions,
      };
    })
  );

  const assigned = tutorsWithDetails.filter(
    (t) => t.assignedTuitions.length > 0
  );

  return (
    <div
      className="min-h-screen relative overflow-hidden text-[#E4D7BD]"
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
      <section className="relative text-center py-20 px-6 z-10">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl font-extrabold flex justify-center items-center gap-3 drop-shadow-[0_4px_15px_rgba(154,143,124,0.4)]">
            <Users className="text-orange-300 w-12 h-12 drop-shadow-[0_0_10px_rgba(154,143,124,0.5)]" />
            Tutors with Assigned Tuitions
          </h1>
          <p className="mt-4 text-lg text-orange-300/80 font-bold max-w-2xl mx-auto leading-relaxed tracking-tighter">
            Explore our dedicated tutors who are actively guiding students to success.
          </p>
        </div>
      </section>

      {/* Tutors Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <h2 className="text-3xl font-bold text-[#E4D7BD] mb-10 drop-shadow-[0_2px_10px_rgba(228,215,189,0.3)]">
          All Assigned Tutors
        </h2>
        {assigned.length === 0 ? (
          <p className="text-[#E4D7BD]/60 italic">
            No tutors have assigned tuitions yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {assigned.map((t) => (
              <TutorCard key={t._id} tutor={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
