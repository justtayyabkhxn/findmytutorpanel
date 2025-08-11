import { Schema, model, models } from "mongoose";

const TuitionSchema = new Schema({
  description: String,
  tutor: { type: Schema.Types.ObjectId, ref: "Tutor" }
}, { timestamps: true });


export default models.Tuition || model("Tuition", TuitionSchema);
