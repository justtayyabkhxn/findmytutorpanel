import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Tutor from "@/lib/models/Tutor";

// GET all tutors
export async function GET() {
  try {
    await connectDB();

    // Just fetch tutors, newest first
    const tutors = await Tutor.find().sort({ createdAt: -1 });

    return NextResponse.json(tutors);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tutors: " + error },
      { status: 500 }
    );
  }
}

// POST create tutor
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const tutor = await Tutor.create({
      name: body.name,
      experience: Number(body.experience),
      dateJoined: new Date(body.dateJoined),
      qualification: body.qualification,
      assignedTuitions: body.assignedTuitions || [] // Accept array of [tuitionName, assignedTime]
    });

    return NextResponse.json(tutor, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create tutor: " + error },
      { status: 500 }
    );
  }
}
