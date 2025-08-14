import { Schema, model, models } from "mongoose";

const TutorSchema = new Schema(
  {
    name: String,
    experience: Number,
    dateJoined: Date,
    qualification: String,
    assignedTuitions: [
      [Schema.Types.Mixed] // Array of arrays, e.g. [["Math", "2025-08-13T10:00:00Z"]]
    ]
  },
  { timestamps: true }
);

export default models.Tutor || model("Tutor", TutorSchema);
