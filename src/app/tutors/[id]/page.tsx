import React from "react";
import {
  User,
  GraduationCap,
  Briefcase,
  Calendar,
  BookOpen,
} from "lucide-react";

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

  // 1️⃣ Fetch tutor details
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tutors/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) return <div className="text-red-500">Tutor not found</div>;

  const tutor: Tutor = await res.json();

  // 2️⃣ Fetch full tuition details for each assigned tuition ID
  const assignedTuitions: Tuition[] = tutor.assignedTuitions?.length
    ? await Promise.all(
        tutor.assignedTuitions.map(async (tuitionId: string) => {
          const tuitionRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/assign-tuition/${tuitionId}`,
            { cache: "no-store" }
          );
          if (!tuitionRes.ok) return null;
          return tuitionRes.json() as Promise<Tuition>;
        })
      ).then((tuitions) => tuitions.filter((t): t is Tuition => t !== null))
    : [];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      {/* Tutor Header */}
      <div className="border-b pb-4 mb-6 flex items-center gap-3">
        <User className="text-gray-700" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{tutor.name}</h1>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <Calendar size={16} />
            Joined on {new Date(tutor.dateJoined).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Tutor Details */}
      <div className="space-y-3">
        <p className="flex items-center gap-2">
          <GraduationCap size={18} className="text-gray-600" />
          <span className="font-semibold">Qualification:</span>{" "}
          {tutor.qualification}
        </p>
        <p className="flex items-center gap-2">
          <Briefcase size={18} className="text-gray-600" />
          <span className="font-semibold">Experience:</span>{" "}
          {tutor.experience} years
        </p>
      </div>

      {/* Assigned Tuitions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-gray-700" />
          Assigned Tuitions
        </h2>
        {assignedTuitions.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No tuitions assigned.</p>
        ) : (
          <ul className="space-y-2">
            {assignedTuitions.map((tu, index) => (
              <li
                key={tu._id || index}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
              >
                <p className="font-medium">{tu.description}</p>
                {tu.student && (
                  <p className="text-sm text-gray-500">
                    Student: {tu.student.name}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
