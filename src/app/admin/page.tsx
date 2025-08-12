"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Edit, Trash2, Plus, BookOpen, Save } from "lucide-react";
import { useRouter } from "next/navigation";

const baseUrl =process.env.NEXT_PUBLIC_BASE_URL;

interface Tutor {
  _id: string;
  name: string;
  experience: number;
  dateJoined: string;
  qualification: string;
  assignedTuitions: string[];
}

interface TutorForm {
  name: string;
  experience: string;
  dateJoined: string;
  qualification: string;
}

interface Tuition {
  _id: string;
  description: string;
  student?: { name: string };
}

export default function AdminPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [form, setForm] = useState<TutorForm>({
    name: "",
    experience: "",
    dateJoined: "",
    qualification: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [assignId, setAssignId] = useState<string | null>(null);
  const [tuitionDesc, setTuitionDesc] = useState<string>("");

  // Map of tutorId -> array of assigned tuitions details
  const [assignedTuitionsMap, setAssignedTuitionsMap] = useState<{
    [key: string]: Tuition[];
  }>({});

  const router = useRouter();

  // Check auth token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  // Fetch assigned tuition details for each tutor
  const fetchAssignedTuitions = async (tutors: Tutor[]) => {
    const map: { [key: string]: Tuition[] } = {};
    for (const tutor of tutors) {
      if (tutor.assignedTuitions && tutor.assignedTuitions.length > 0) {
        const tuitions = await Promise.all(
          tutor.assignedTuitions.map(async (tuitionId) => {
            const res = await fetch(`${baseUrl}/api/assign-tuition/${tuitionId}`);
            if (!res.ok) return null;
            return res.json();
          })
        );
        map[tutor._id] = tuitions.filter(Boolean) as Tuition[];
      } else {
        map[tutor._id] = [];
      }
    }
    setAssignedTuitionsMap(map);
  };

  const fetchTutors = async () => {
    const res = await fetch(`{${baseUrl}/api/tutors`);
    if (!res.ok) {
      console.error("Failed to fetch tutors");
      return;
    }
    const data: Tutor[] = await res.json();
    setTutors(data);
    fetchAssignedTuitions(data);
  };

  useEffect(() => {
    fetchTutors();
  }, [tutors]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/tutors/${editingId}` : "/api/tutors";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", experience: "", dateJoined: "", qualification: "" });
    setEditingId(null);
    fetchTutors();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${baseUrl}/api/tutors/${id}`, { method: "DELETE" });
    fetchTutors();
  };

  const handleAssign = async (e: FormEvent) => {
    e.preventDefault();
    if (!assignId) return;

    const res = await fetch(`${baseUrl}/api/assign-tuition`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: tuitionDesc, tutorId: assignId }),
    });

    if (res.ok) {
      setAssignId(null);
      setTuitionDesc("");
      fetchTutors();
    } else {
      console.error("Failed to assign tuition");
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const convertToCSV = () => {
    const headers = [
      "Name",
      "Experience (years)",
      "Date Joined",
      "Qualification",
      "Assigned Tuitions",
    ];

    const rows = tutors.map((tutor) => {
      const assignedTuitions =
        assignedTuitionsMap[tutor._id]
          ?.map((t) => t.description.replace(/"/g, '""')) // escape quotes
          .join("; ") || "";

      return [
        `"${tutor.name.replace(/"/g, '""')}"`,
        tutor.experience.toString(),
        tutor.dateJoined.split("T")[0],
        `"${tutor.qualification.replace(/"/g, '""')}"`,
        `"${assignedTuitions}"`,
      ].join(",");
    });

    return [headers.join(","), ...rows].join("\n");
  };

  // Trigger CSV download
  const downloadCSV = () => {
    const csv = convertToCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tutors_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-white tracking-tight">
        📚 Tutor Admin Panel
      </h1>

      {/* Add/Edit Tutor Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-2xl shadow-lg border border-gray-100"
      >
        <div className="grid grid-cols-1 text-gray-900 md:grid-cols-2 gap-5">
          <input
            type="text"
            name="name"
            placeholder="Tutor Name"
            value={form.name}
            onChange={handleInputChange}
            className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            value={form.experience}
            onChange={handleInputChange}
            className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <input
            type="date"
            name="dateJoined"
            value={form.dateJoined}
            onChange={handleInputChange}
            className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            value={form.qualification}
            onChange={handleInputChange}
            className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {editingId ? <Save size={18} /> : <Plus size={18} />}
          {editingId ? "Update Tutor" : "Add Tutor"}
        </button>
      </form>

      <div className=" mt-5 text-right">
        <button
          onClick={downloadCSV}
          className="inline-flex cursor-pointer items-center gap-2 bg-purple-600 hover:bg-purple-700 text-gray-800 px-4 py-2 rounded-xl font-semibold transition shadow-md"
        >
          {/* You can use any icon here, for example: */}
          <Plus size={18} />
          Download CSV
        </button>
      </div>

      {/* Tutor List */}
<div className="mt-10 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
  {/* Wrap table in a horizontally scrollable container */}
  <div className="overflow-x-auto w-full text-gray-900">
    <table className="w-full border-collapse min-w-[600px]">
      <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-800">
                Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800">
                Experience
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800">
                Date Joined
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800">
                Qualification
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800">
                Assigned Tuitions
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor) => (
              <tr
                key={tutor._id}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <td className="p-4">{tutor.name}</td>
                <td className="p-4">{tutor.experience}</td>
                <td className="p-4">
                  {new Date(tutor.dateJoined).toLocaleDateString()}
                </td>
                <td className="p-4">{tutor.qualification}</td>
                <td className="p-4 max-w-xs">
                  {assignedTuitionsMap[tutor._id] &&
                  assignedTuitionsMap[tutor._id].length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-900 max-w-xs">
                      {assignedTuitionsMap[tutor._id].map((tuition) => (
                        <li key={tuition._id}>{tuition.description}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs italic text-gray-800">
                      No tuitions assigned
                    </p>
                  )}
                </td>
                <td className="p-4 flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setForm({
                        name: tutor.name,
                        experience: tutor.experience.toString(),
                        dateJoined: tutor.dateJoined.split("T")[0],
                        qualification: tutor.qualification,
                      });
                      setEditingId(tutor._id);
                    }}
                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded-lg shadow-sm"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tutor._id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-gray-900 px-3 py-1 rounded-lg shadow-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  <button
                    onClick={() => setAssignId(tutor._id)}
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-gray-800 px-3 py-1 rounded-lg shadow-sm"
                  >
                    <BookOpen size={16} /> Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {/* Assign Tuition Form */}
      {assignId && (
        <form
          onSubmit={handleAssign}
          className="mt-6 p-6 bg-gradient-to-r from-green-50 to-white rounded-2xl shadow-lg border border-gray-100 space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-800">
            Assign Tuition to {tutors.find((t) => t._id === assignId)?.name}
          </h2>
          <textarea
            placeholder="Enter tuition description..."
            value={tuitionDesc}
            onChange={(e) => setTuitionDesc(e.target.value)}
            className="border border-gray-200 p-3 w-full rounded-xl focus:ring-2 focus:ring-green-400 resize-none"
            rows={4}
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-gray-800 px-5 py-2 rounded-lg shadow-md transition"
            >
              <BookOpen size={18} /> Assign Tuition
            </button>
            <button
              type="button"
              onClick={() => {
                setAssignId(null);
                setTuitionDesc("");
              }}
              className="bg-gray-400 hover:bg-gray-500 text-gray-900 px-5 py-2 rounded-lg shadow-md transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
