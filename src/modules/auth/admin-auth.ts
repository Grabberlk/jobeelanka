import crypto from "crypto";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN";
  department: string;
}

// Configurable via environment variables (with secure defaults)
const DEFAULT_SUPER_ADMINS: AdminUser[] = [
  {
    id: "admin-rajeevan",
    name: "Rajeevan",
    email: "contactrajeevan@hotmail.com",
    role: "SUPER_ADMIN",
    department: "Executive & Platform Governance",
  },
  {
    id: "admin-anas",
    name: "Anas",
    email: "anasbikes1992@gmail.com",
    role: "SUPER_ADMIN",
    department: "Technical & Directory Administration",
  },
];

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "jobeelanka_prod_gov_secret_key_2026_lk";
const PASSWORD_SALT =
  process.env.ADMIN_PASSWORD_SALT || "jobeelanka_secure_salt_8921";

// Expected password: "Aa123456"
// SHA-256 hash of "Aa123456" + PASSWORD_SALT:
export const EXPECTED_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  crypto
    .createHash("sha256")
    .update(`Aa123456${PASSWORD_SALT}`)
    .digest("hex");

export function getAuthorizedAdmins(): AdminUser[] {
  const envEmails = process.env.ADMIN_EMAILS;
  if (!envEmails) return DEFAULT_SUPER_ADMINS;

  const emails = envEmails.split(",").map((e) => e.trim().toLowerCase());
  return emails.map((email, idx) => {
    const existing = DEFAULT_SUPER_ADMINS.find(
      (a) => a.email.toLowerCase() === email
    );
    if (existing) return existing;
    return {
      id: `admin-env-${idx}`,
      name: email.split("@")[0].toUpperCase(),
      email,
      role: "SUPER_ADMIN",
      department: "Governance Operations",
    };
  });
}

export function verifyAdminCredentials(
  email: string,
  passwordPlain: string
): AdminUser | null {
  if (!email || !passwordPlain) return null;

  const admins = getAuthorizedAdmins();
  const matchedAdmin = admins.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!matchedAdmin) return null;

  const computedHash = crypto
    .createHash("sha256")
    .update(`${passwordPlain}${PASSWORD_SALT}`)
    .digest("hex");

  const expectedHash = EXPECTED_PASSWORD_HASH;

  // Constant-time comparison to prevent timing attacks
  const bufA = Buffer.from(computedHash, "hex");
  const bufB = Buffer.from(expectedHash, "hex");

  if (bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)) {
    return matchedAdmin;
  }

  return null;
}

export function createAdminSessionToken(admin: AdminUser): string {
  const payload = {
    sub: admin.id,
    email: admin.email,
    role: admin.role,
    name: admin.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64url");

  return `${data}.${signature}`;
}

export function verifyAdminSessionToken(token: string): AdminUser | null {
  if (!token || !token.includes(".")) return null;

  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expectedSig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64url");

  if (signature !== expectedSig) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8")
    );
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    const admins = getAuthorizedAdmins();
    const found = admins.find(
      (a) => a.email.toLowerCase() === payload.email.toLowerCase()
    );
    if (found) return found;

    return {
      id: payload.sub,
      name: payload.name || "Administrator",
      email: payload.email,
      role: "SUPER_ADMIN",
      department: "Executive Governance",
    };
  } catch {
    return null;
  }
}
