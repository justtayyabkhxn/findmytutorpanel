import { Schema, model, models } from "mongoose";

const TutorSchema = new Schema({
  name: String,
  experience: Number, // years
  dateJoined: Date,
  qualification: String,
  assignedTuitions: [{ type: Schema.Types.ObjectId, ref: "Tuition" }]
}, { timestamps: true });


export default models.Tutor || model("Tutor", TutorSchema);
