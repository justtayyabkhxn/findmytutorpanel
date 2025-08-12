import {
  User,
  GraduationCap,
  Briefcase,
  Calendar,
  BookOpen,
} from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface Student {
  name: string;
}

interface Tuition {
  _id?: string;
  description: string;
  student?: Student;
}

interface Tutor {
  name: string;
  qualification: string;
  experience: number;
  dateJoined: string;
  assignedTuitions: string[];
}

export default async function TutorDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch tutor details
  const res = await fetch(`${baseUrl}/api/tutors/${id}`, { cache: "no-store" });
  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 font-bold">
        Tutor not found
      </div>
    );
  }

  const tutor: Tutor = await res.json();

  // Fetch full tuition details for each assigned tuition ID
  const assignedTuitions: Tuition[] = tutor.assignedTuitions?.length
    ? await Promise.all(
        tutor.assignedTuitions.map(async (tuitionId: string) => {
          const tuitionRes = await fetch(
            `${baseUrl}/api/assign-tuition/${tuitionId}`,
            { cache: "no-store" }
          );
          if (!tuitionRes.ok) return null;
          return (tuitionRes.json()) as Promise<Tuition>;
        })
      ).then((tuitions) => tuitions.filter((t): t is Tuition => t !== null))
    : [];

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

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="bg-[#2B2F37]/80 border border-[#4B4A45] rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 border-b border-[#4B4A45] pb-4 mb-6">
            <User className="text-[#9A8F7C]" size={40} />
            <div>
              <h1 className="text-3xl font-bold text-[#E4D7BD] drop-shadow-[0_2px_6px_rgba(154,143,124,0.3)]">
                {tutor.name}
              </h1>
              <p className="text-[#E4D7BD]/70 text-sm flex items-center gap-2">
                <Calendar size={16} className="text-[#9A8F7C]" />
                Joined on{" "}
                {new Date(tutor.dateJoined).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Tutor details */}
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-[#E4D7BD]/90">
              <GraduationCap size={18} className="text-[#9A8F7C]" />
              <span className="font-semibold">Qualification:</span>{" "}
              {tutor.qualification}
            </p>
            <p className="flex items-center gap-2 text-[#E4D7BD]/90">
              <Briefcase size={18} className="text-[#9A8F7C]" />
              <span className="font-semibold">Experience:</span>{" "}
              {tutor.experience} years
            </p>
          </div>
        </div>

        {/* Assigned Tuitions */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-[#E4D7BD] drop-shadow-[0_2px_6px_rgba(228,215,189,0.3)]">
            <BookOpen size={20} className="text-[#9A8F7C]" />
            Assigned Tuitions
          </h2>
          {assignedTuitions.length === 0 ? (
            <p className="text-sm text-[#E4D7BD]/60 italic">
              No tuitions assigned.
            </p>
          ) : (
            <ul className="space-y-3">
              {assignedTuitions.map((tu, index) => (
                <li
                  key={tu._id || index}
                  className="p-4 bg-[#2B2F37]/60 border border-[#4B4A45] rounded-lg hover:bg-[#9A8F7C]/10 transition"
                >
                  <p className="font-medium text-[#E4D7BD]">
                    {tu.description}
                  </p>
                  {tu.student && (
                    <p className="text-sm text-[#E4D7BD]/70">
                      Student: {tu.student.name}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
