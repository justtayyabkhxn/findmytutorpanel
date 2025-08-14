import {
  User,
  GraduationCap,
  Briefcase,
  Calendar,
  BookOpen,
} from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;



interface Tutor {
  name: string;
  qualification: string;
  experience: number;
  dateJoined: string;
  assignedTuitions: [string, string][]; // [tuitionDescription, assignedDate]
}

export default async function TutorDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${baseUrl}/api/tutors/${id}`, { cache: "no-store" });
  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 font-bold">
        Tutor not found
      </div>
    );
  }

  const tutor: Tutor = await res.json();

  // Sort newest first
  const sortedTuitions = [...tutor.assignedTuitions].sort(
    (a, b) => new Date(b[1]).getTime() - new Date(a[1]).getTime()
  );

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
      <div className="absolute inset-0 bg-[#0F1115]/80 z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="bg-[#2B2F37]/80 border border-[#4B4A45] rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 border-b border-[#4B4A45] pb-4 mb-6">
            <User className="text-[#9A8F7C]" size={40} />
            <div>
              <h1 className="text-3xl font-bold text-[#E4D7BD]">
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
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-[#E4D7BD]">
            <BookOpen size={20} className="text-[#9A8F7C]" />
            Assigned Tuitions
          </h2>
          {sortedTuitions.length === 0 ? (
            <p className="text-sm text-[#E4D7BD]/60 italic">
              No tuitions assigned.
            </p>
          ) : (
            <ul className="space-y-3">
              {sortedTuitions.map(([tuitionDescription, assignedDate], idx) => (
                <li
                  key={idx}
                  className="p-4 bg-[#2B2F37]/60 border border-[#4B4A45] rounded-lg hover:bg-black/50 transition"
                >
                  <p className="font-medium text-[#E4D7BD]">
                    {tuitionDescription}
                  </p>
                  <p className="text-xs text-[#E4D7BD]/50 mt-1">
                    Assigned on:{" "}
                    {new Date(assignedDate).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
