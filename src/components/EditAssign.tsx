import { useState, useEffect } from "react";

interface Tutor {
  _id: string;
  name: string;
  experience: number;
  dateJoined: string;
  qualification: string;
  assignedTuitions: [string, string][]; // [tuitionId, date]
}

interface EditAssignedTuitionsModalProps {
  tutor: Tutor | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditAssignedTuitionsModal({
  tutor,
  isOpen,
  onClose,
  onUpdate,
}: EditAssignedTuitionsModalProps) {
  const [assignments, setAssignments] = useState<[string, string][]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (tutor?.assignedTuitions) {
      setAssignments(tutor.assignedTuitions);
    } else {
      setAssignments([]);
    }
  }, [tutor]);

  const handleChange = (
    index: number,
    field: "tuition" | "time",
    value: string
  ) => {
    setAssignments((prev) => {
      const updated = [...prev];
      updated[index] =
        field === "tuition"
          ? [value, updated[index][1]]
          : [updated[index][0], value];
      return updated;
    });
  };

  const handleUpdate = async () => {
    if (!tutor?._id) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/assign-tuition`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: tutor._id,
            assignedTuitions: assignments,
          }),
        }
      );
      if (!res.ok) throw new Error(`Failed to update: ${res.status}`);
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Failed to update assigned tuitions:", err);
    }
  };

  if (!isOpen || !tutor) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
      <div className="backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/30 w-[700px]">
        <h2 className="text-xl font-bold mb-5 text-black">
          ✏️ Edit Assigned Tuitions
          <span className="block text-sm text-black font-normal">
            {tutor.name}
          </span>
        </h2>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {assignments.map(([tuitionId, time], index) => (
            <div
              key={index}
              className="flex gap-2 items-center bg-white/60 rounded-xl p-2 border border-gray-200"
            >
              <input
                className="border border-gray-300 p-2 rounded-lg text-black flex-1 focus:ring-2 focus:ring-blue-300 outline-none"
                placeholder="Tuition ID"
                value={tuitionId}
                onChange={(e) => handleChange(index, "tuition", e.target.value)}
              />
              <input
                type="datetime-local"
                className="border border-gray-300 p-2 rounded-lg flex-1 text-black focus:ring-2 focus:ring-blue-300 outline-none"
                value={
                  isClient && time
                    ? new Date(time).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => handleChange(index, "time", e.target.value)}
              />
              <button
                onClick={() =>
                  setAssignments((prev) => prev.filter((_, i) => i !== index))
                }
                className="px-3 py-1 bg-red-500 text-black rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-black rounded-xl shadow-md transition font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
