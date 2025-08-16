"use client";

import {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  useCallback,
} from "react";
import { Edit, Trash2, Plus, BookOpen, Save, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import EditAssignedTuitionsModal from "@/components/EditAssign";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface Tutor {
  _id: string;
  name: string;
  experience: number;
  dateJoined: string;
  qualification: string;
  assignedTuitions: [string, string][]; // [tuitionId, date]
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
  const [assignedTuitionsMap, setAssignedTuitionsMap] = useState<{
    [key: string]: Tuition[];
  }>({});

  const router = useRouter();

  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [assignDate, setAssignDate] = useState<string>("");

  // Add new state at the top
  const [searchTerm, setSearchTerm] = useState("");

  // Derived list of tutors based on search
  const filteredTutors = tutors.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.qualification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = async (e: FormEvent) => {
    e.preventDefault();
    if (!assignId) return;

    const res = await fetch(`${baseUrl}/api/assign-tuition`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tutorId: assignId,
        tuition: tuitionDesc, // could be tuitionId if using existing ones
        date: assignDate || new Date().toISOString(),
      }),
    });

    if (res.ok) {
      setAssignId(null);
      setTuitionDesc("");
      setAssignDate("");
      await fetchTutors();
    } else {
      console.error("Failed to assign tuition");
    }
  };

  // ✅ Check auth token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  // ✅ Fetch tutors (memoized)
  const fetchTutors = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/api/tutors`, { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to fetch tutors");
        return;
      }
      const data: Tutor[] = await res.json();
      setTutors(data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  }, []);

  // ✅ Run once on mount
  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  // Add Tutor / Update Tutor
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `${baseUrl}/api/tutors/${editingId}`
      : `${baseUrl}/api/tutors`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ name: "", experience: "", dateJoined: "", qualification: "" });
      setEditingId(null);
      await fetchTutors();
    }
  };

  // Delete Tutor
  const handleDelete = async (id: string) => {
    const res = await fetch(`${baseUrl}/api/tutors/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchTutors();
    }
  };

  // Assign Tuitio

  // Form change handler
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // CSV generator
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
      tutor.assignedTuitions
        ?.map(([tuitionId, date]) =>
          `${tuitionId.replace(/"/g, '""')} (${new Date(date).toLocaleString()})`
        )
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


  // CSV download trigger
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

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/admin/login");
  };
  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-pink-100 tracking-tight drop-shadow-lg">
          📚 Tutor Admin Panel
        </h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
      {assignId && (
        <form
          onSubmit={handleAssign}
          className="mt-6 p-6 bg-white rounded-3xl text-black shadow-lg space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-800">
            Assign Tuition to {tutors.find((t) => t._id === assignId)?.name}
          </h2>

          <textarea
            placeholder="Enter tuition description..."
            value={tuitionDesc}
            onChange={(e) => setTuitionDesc(e.target.value)}
            className="border border-green-200 p-3 w-full rounded-2xl focus:ring-2 focus:ring-green-300 resize-none"
            rows={4}
            required
          />

          <input
            type="datetime-local"
            value={assignDate}
            onChange={(e) => setAssignDate(e.target.value)}
            className="border border-green-200 p-3 w-full rounded-2xl focus:ring-2 focus:ring-green-300"
            required
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-full shadow-md transition"
            >
              <BookOpen size={18} /> Assign Tuition
            </button>
            <button
              type="button"
              onClick={() => {
                setAssignId(null);
                setTuitionDesc("");
                setAssignDate("");
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-full shadow-md transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {/* Search Bar */}
      {/* Add/Edit Tutor Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 mt-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl shadow-lg border border-pink-100"
      >
        <div className="grid grid-cols-1 text-gray-900 md:grid-cols-2 gap-5">
          <input
            type="text"
            name="name"
            placeholder="Tutor Name"
            value={form.name}
            onChange={handleInputChange}
            className="border border-pink-200 p-3 rounded-2xl w-full focus:ring-2 focus:ring-pink-300 focus:outline-none"
            required
          />
          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            value={form.experience}
            onChange={handleInputChange}
            className="border border-pink-200 p-3 rounded-2xl w-full focus:ring-2 focus:ring-pink-300 focus:outline-none"
            required
          />
          <input
            type="date"
            name="dateJoined"
            value={form.dateJoined}
            onChange={handleInputChange}
            className="border border-pink-200 p-3 rounded-2xl w-full focus:ring-2 focus:ring-pink-300 focus:outline-none"
            required
          />
          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            value={form.qualification}
            onChange={handleInputChange}
            className="border border-pink-200 p-3 rounded-2xl w-full focus:ring-2 focus:ring-pink-300 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl"
        >
          {editingId ? <Save size={18} /> : <Plus size={18} />}
          {editingId ? "Update Tutor" : "Add Tutor"}
        </button>
      </form>
      <div className="mt-5 flex justify-between items-center">
  {/* Search Bar */}
  <input
    type="text"
    placeholder="🔍 Search tutors..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border border-pink-300 p-3 rounded-2xl w-80 focus:ring-2 focus:ring-pink-400 focus:outline-none"
  />

  {/* Download CSV */}
  <button
    onClick={downloadCSV}
    className="inline-flex cursor-pointer items-center gap-2 bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl"
  >
    <Plus size={18} />
    Download CSV
  </button>
</div>

      {/* Tutor List */}
      <div className="mt-10 bg-white rounded-3xl shadow-lg overflow-hidden border border-pink-100">
        <div className="overflow-x-auto w-full text-gray-900">
          <table className="w-full border-collapse min-w-[600px]">
            <thead className="bg-gradient-to-r from-pink-100 to-purple-100">
              <tr>
                {[
                  "Name",
                  "Experience",
                  "Date Joined",
                  "Qualification",
                  "Assigned Tuitions",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="p-4 text-left text-sm font-semibold text-gray-700"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTutors.map((tutor) => (
                <tr
                  key={tutor._id}
                  className="hover:bg-pink-50 transition-colors duration-200"
                >
                  <td className="p-4">{tutor.name}</td>
                  <td className="p-4">{tutor.experience}</td>
                  <td className="p-4">
                    {new Date(tutor.dateJoined).toLocaleDateString()}
                  </td>
                  <td className="p-4">{tutor.qualification}</td>
                  <td className="p-4 max-w-xs">
                    {tutor.assignedTuitions?.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-gray-900 max-w-xs">
                        {tutor.assignedTuitions.map(
                          ([tuitionName, assignedDate], idx) => (
                            <li key={idx}>
                              {tuitionName} —{" "}
                              <span className="text-gray-500">
                                {new Date(assignedDate).toLocaleString()}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs italic text-gray-500">
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
                      className="flex items-center gap-1 bg-yellow-300 hover:bg-yellow-400 text-gray-800 px-3 py-1 rounded-full shadow-sm transition"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        const confirmed = window.confirm(
                          "Are you sure you want to delete this assignment?"
                        );
                        if (confirmed) {
                          handleDelete(tutor._id);
                        }
                      }}
                      className="flex items-center gap-1 bg-red-300 hover:bg-red-400 text-gray-800 px-3 py-1 rounded-full shadow-sm transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                    <button
                      onClick={() => setAssignId(tutor._id)}
                      className="flex items-center gap-1 bg-green-300 hover:bg-green-400 text-gray-800 px-3 py-1 rounded-full shadow-sm transition"
                    >
                      <BookOpen size={16} /> Assign
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTutor(tutor);
                        setEditModalOpen(true);
                      }}
                      className="flex items-center gap-1 bg-orange-300 hover:bg-orange-400 text-gray-800 px-3 py-1 rounded-full shadow-sm transition"
                    >
                      Edit Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Assign Tuition Form */}
      <EditAssignedTuitionsModal
        tutor={selectedTutor}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={fetchTutors} // your function to refresh data
      />
      ;
    </div>
  );
}
