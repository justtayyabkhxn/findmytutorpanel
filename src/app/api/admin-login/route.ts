import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // use env var in production

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const ADMIN_EMAIL = "admin@findmytutor.com";
  const ADMIN_PASSWORD = "anas";

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Create JWT payload
    const payload = {
      email,
      role: "admin",
      iat: Math.floor(Date.now() / 1000),
    };

    // Sign the JWT token (expires in 1 hour)
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    return NextResponse.json({ token }, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
