import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Tutor from "@/lib/models/Tutor";

// GET /api/tutors/[id] - fetch a single tutor
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectDB();
    const tutor = await Tutor.findById(id);

    if (!tutor) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    return NextResponse.json(tutor);
  } catch (error) {
    console.error("GET /tutors/:id error:", error);
    return NextResponse.json({ error: "Failed to fetch tutor" }, { status: 500 });
  }
}

// PATCH /api/tutors/[id] - update tutor
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectDB();
    const body = await req.json();

    const tutor = await Tutor.findByIdAndUpdate(
      id,
      {
        name: body.name,
        experience: Number(body.experience),
        dateJoined: new Date(body.dateJoined),
        qualification: body.qualification,
      },
      { new: true }
    );

    if (!tutor) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    return NextResponse.json(tutor);
  } catch (error) {
    console.error("PATCH /tutors/:id error:", error);
    return NextResponse.json({ error: "Failed to update tutor" }, { status: 500 });
  }
}

// DELETE /api/tutors/[id] - delete tutor
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectDB();
    const tutor = await Tutor.findByIdAndDelete(id);

    if (!tutor) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Tutor deleted" });
  } catch (error) {
    console.error("DELETE /tutors/:id error:", error);
    return NextResponse.json({ error: "Failed to delete tutor" }, { status: 500 });
  }
}
