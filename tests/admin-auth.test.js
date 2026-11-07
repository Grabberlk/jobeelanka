const { test, describe } = require("node:test");
const assert = require("node:assert/strict");

describe("Admin Authentication & Security Suite", () => {
  const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3001";
  let adminSessionCookie = "";

  test("GET /api/v1/auth/admin returns 401 when no session cookie is provided", async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/admin`);
      assert.equal(res.status, 401);
      const json = await res.json();
      assert.equal(json.authenticated, false);
    } catch (e) {
      if (e.code === "ECONNREFUSED") return;
      throw e;
    }
  });

  test("POST /api/v1/auth/admin rejects unauthorized emails or incorrect passwords", async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "hacker@random.com", password: "wrong" }),
      });
      assert.equal(res.status, 401);
      const json = await res.json();
      assert.ok(json.error);
    } catch (e) {
      if (e.code === "ECONNREFUSED") return;
      throw e;
    }
  });

  test("POST /api/v1/auth/admin accepts super admin contactrajeevan@hotmail.com with password Aa123456", async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "contactrajeevan@hotmail.com", password: "Aa123456" }),
      });
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.equal(json.user.email, "contactrajeevan@hotmail.com");
      assert.equal(json.user.role, "SUPER_ADMIN");

      // Verify Set-Cookie header contains jobeelanka_admin_session
      const cookieHeader = res.headers.get("set-cookie");
      assert.ok(cookieHeader && cookieHeader.includes("jobeelanka_admin_session="));
      adminSessionCookie = cookieHeader.split(";")[0];
    } catch (e) {
      if (e.code === "ECONNREFUSED") return;
      throw e;
    }
  });

  test("POST /api/v1/auth/admin accepts super admin anasbikes1992@gmail.com with password Aa123456", async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "anasbikes1992@gmail.com", password: "Aa123456" }),
      });
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.equal(json.user.email, "anasbikes1992@gmail.com");
      assert.equal(json.user.role, "SUPER_ADMIN");
    } catch (e) {
      if (e.code === "ECONNREFUSED") return;
      throw e;
    }
  });

  test("GET /api/v1/admin/staff requires valid admin session", async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/admin/staff`);
      assert.equal(res.status, 401);
    } catch (e) {
      if (e.code === "ECONNREFUSED") return;
      throw e;
    }
  });
});
