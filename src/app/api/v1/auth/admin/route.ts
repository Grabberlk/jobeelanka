import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/modules/auth/admin-auth";

const COOKIE_NAME = "jobeelanka_admin_session";

// GET: Check current admin session
export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const admin = verifyAdminSessionToken(token);
  if (!admin) {
    const res = NextResponse.json({ authenticated: false }, { status: 401 });
    res.cookies.delete(COOKIE_NAME);
    return res;
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      department: admin.department,
    },
  });
}

// POST: Admin login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = verifyAdminCredentials(String(email), String(password));
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid admin email or password" },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken(admin);
    const res = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department,
      },
    });

    res.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE: Admin logout
export async function DELETE() {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.delete(COOKIE_NAME);
  return res;
}

