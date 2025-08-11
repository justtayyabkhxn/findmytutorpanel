import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Tuition from "@/lib/models/Tuition";
// GET — fetch a tuition by ID
export async function GET(req: Request) {
  try {
    await connectDB();

    // Extract ID from URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // last segment

    if (!id) {
      return NextResponse.json({ error: "Tuition ID is required" }, { status: 400 });
    }

    // Populate tutor details too
    const tuition = await Tuition.findById(id).populate("tutor", "name email");

    if (!tuition) {
      return NextResponse.json({ error: "Tuition not found" }, { status: 404 });
    }

    return NextResponse.json(tuition, { status: 200 });
  } catch (error) {
    console.error("Error fetching tuition:", error);
    return NextResponse.json(
      { error: "Failed to fetch tuition" },
      { status: 500 }
    );
  }
}