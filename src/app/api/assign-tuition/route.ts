import { NextResponse,NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Tutor from "@/lib/models/Tutor";

// ✅ GET: Fetch tutors with assigned tuitions
export async function GET() {
  try {
    await connectDB();

    let tutors = await Tutor.find({
      assignedTuitions: { $exists: true, $not: { $size: 0 } }
    }).lean();

    tutors = tutors.sort((a, b) => {
      const aMostRecent = new Date(a.assignedTuitions[a.assignedTuitions.length - 1][1]).getTime();
      const bMostRecent = new Date(b.assignedTuitions[b.assignedTuitions.length - 1][1]).getTime();
      return bMostRecent - aMostRecent;
    });

    return NextResponse.json(tutors);
  } catch (error) {
    console.error("Error fetching assigned tutors:", error);
    return NextResponse.json(
      { error: "Failed to fetch assigned tutors" },
      { status: 500 }
    );
  }
}

// ✅ POST: Add [Tuition, date] to a tutor
export async function POST(request: Request) {
  try {
    await connectDB();

    const { tutorId, tuition, date } = await request.json();

    if (!tutorId || !tuition || !date) {
      return NextResponse.json(
        { error: "tutorId, tuition, and date are required" },
        { status: 400 }
      );
    }

    const updatedTutor = await Tutor.findByIdAndUpdate(
      tutorId,
      { $push: { assignedTuitions: [tuition, date] } },
      { new: true }
    );

    if (!updatedTutor) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTutor);
  } catch (error) {
    console.error("Error adding assigned tuition:", error);
    return NextResponse.json(
      { error: "Failed to add assigned tuition" },
      { status: 500 }
    );
  }
}




export async function PUT(req: NextRequest) {
  try {
    const { id, assignedTuitions }: { id: string; assignedTuitions: string[] } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Tutor ID is required" }), { status: 400 });
    }

    if (!Array.isArray(assignedTuitions)) {
      return new Response(JSON.stringify({ error: "assignedTuitions must be an array" }), { status: 400 });
    }

    const updatedTutor = await Tutor.findByIdAndUpdate(
      id,
      { assignedTuitions },
      { new: true }
    ).populate("assignedTuitions");

    if (!updatedTutor) {
      return new Response(JSON.stringify({ error: "Tutor not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedTutor), { status: 200 });
  } catch (error) {
    console.error("Error updating assigned tuitions:", error);
    return new Response(JSON.stringify({ error: "Failed to update assigned tuitions" }), { status: 500 });
  }
}
