import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Tuition from "@/lib/models/Tuition";
import Tutor from "@/lib/models/Tutor"; // Assuming this is your tutor model

// POST — assign a tuition
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // 1️⃣ Create the tuition
    const tuition = await Tuition.create({
      description: body.description,
      tutor: body.tutorId,
    });

    // 2️⃣ Push the tuition into tutor's assignedTuitions array
    await Tutor.findByIdAndUpdate(
      body.tutorId,
      { $push: { assignedTuitions: tuition._id } },
      { new: true }
    );

    return NextResponse.json(tuition, { status: 201 });
  } catch (error) {
    console.error("Error assigning tuition:", error);
    return NextResponse.json(
      { error: "Failed to assign tuition" },
      { status: 500 }
    );
  }
}


