import { NextRequest, NextResponse } from "next/server";
import { SEED_ADMIN_AND_STAFF, StaffUser } from "@/modules/admin/data";
import { verifyAdminSessionToken } from "@/modules/auth/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase";

// In-memory store for active session lifetime
let staffList: StaffUser[] = [...SEED_ADMIN_AND_STAFF];

function checkAuth(req: NextRequest) {
  const token = req.cookies.get("jobeelanka_admin_session")?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

// GET: List all staff
export async function GET(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Attempt to read from Supabase if connected
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("staff").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return NextResponse.json({
          success: true,
          data: data.map((s: any) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            role: s.role,
            department: s.department,
            permissions: s.permissions || [],
            status: s.status,
            twoFactorEnabled: s.two_factor_enabled,
            avatarUrl: s.avatar_url,
            lastLogin: s.last_login || "Never",
          })),
        });
      }
    } catch {
      // Fallback to in-memory store
    }
  }

  return NextResponse.json({ success: true, data: staffList });
}

// POST: Create a new staff member
export async function POST(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, role, department, permissions } = body || {};

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required fields" },
        { status: 400 }
      );
    }

    const emailTrimmed = String(email).trim().toLowerCase();
    const exists = staffList.some((s) => s.email.toLowerCase() === emailTrimmed);
    if (exists) {
      return NextResponse.json(
        { error: `Staff member with email ${emailTrimmed} already exists` },
        { status: 409 }
      );
    }

    const newStaff: StaffUser = {
      id: `usr-staff-${Date.now()}`,
      name: String(name).trim(),
      email: emailTrimmed,
      role: role as StaffUser["role"],
      department: department ? String(department).trim() : "Operational Staff",
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80`,
      status: "ACTIVE",
      lastLogin: "Never",
      permissions: Array.isArray(permissions) && permissions.length > 0
        ? permissions
        : role === "SUPER_ADMIN"
        ? [
            "ALL_PRIVILEGES",
            "MANAGE_STAFF",
            "APPROVE_EMPLOYERS",
            "OVERRIDE_MODERATION",
            "VIEW_AUDIT_LOGS",
            "SYSTEM_SETTINGS",
            "API_KEY_ISSUANCE",
            "CSV_IMPORT_EXPORT",
          ]
        : role === "MODERATOR_STAFF"
        ? [
            "REVIEW_VACANCIES",
            "APPROVE_JOBS",
            "REJECT_JOBS",
            "EDIT_TAXONOMY",
            "TRIAGE_REPORTS",
          ]
        : [
            "VERIFY_SLBFE_LICENSES",
            "AUDIT_PDPA_CONSENTS",
            "INVESTIGATE_SCAM_REPORTS",
            "BLOCK_FRAUDULENT_AGENTS",
            "EXPORT_COMPLIANCE_LOGS",
          ],
    };

    staffList = [newStaff, ...staffList];

    // Persist to Supabase if available
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase.from("staff").upsert({
          id: newStaff.id,
          name: newStaff.name,
          email: newStaff.email,
          role: newStaff.role,
          department: newStaff.department,
          permissions: newStaff.permissions,
          status: newStaff.status,
          two_factor_enabled: false,
        });
      } catch {
        // Continue with in-memory sync
      }
    }

    return NextResponse.json({ success: true, data: newStaff, list: staffList });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE: Remove a staff member
export async function DELETE(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing staff id" }, { status: 400 });
  }

  // Guard: Protect primary super admin accounts from deletion
  const target = staffList.find((s) => s.id === id);
  if (
    target &&
    (target.email === "contactrajeevan@hotmail.com" ||
      target.email === "anasbikes1992@gmail.com")
  ) {
    return NextResponse.json(
      { error: "Root Super Administrator accounts cannot be deleted." },
      { status: 403 }
    );
  }

  staffList = staffList.filter((s) => s.id !== id);

  // Sync delete with Supabase if available
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from("staff").delete().eq("id", id);
    } catch {
      // Continue
    }
  }

  return NextResponse.json({ success: true, message: "Staff removed", list: staffList });
}
