import { NextResponse } from "next/server";

export async function GET() {
  const swaggerSpec = {
    openapi: "3.0.3",
    info: {
      title: "JobeeLanka REST API",
      version: "2.0.0",
      description:
        "Production RESTful API specification for JobeeLanka (https://www.jobeelanka.com). Provides access to the verified job catalog, employer KYC registry, feed syndication adapters, and referral routing under Sri Lanka PDPA.",
      contact: {
        name: "JobeeLanka Developer Platform",
        url: "https://www.jobeelanka.com",
        email: "developers@jobeelanka.com",
      },
      license: {
        name: "Proprietary / JobeeLanka",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Local Development Server",
      },
      {
        url: "https://www.jobeelanka.com",
        description: "Production API Server (Cloudflare Colombo Edge)",
      },
    ],
    tags: [
      { name: "Jobs", description: "Search, filter, and publish job vacancies" },
      { name: "Employers", description: "Verified employer directory and KYC status" },
      { name: "Applications", description: "PDPA compliant candidate application ingestion" },
      { name: "Feeds", description: "Certified syndication adapters (ITPro.lk, RSS)" },
      { name: "Admin & Staff", description: "Moderation queue and staff access" },
      { name: "SEO & GEO", description: "Machine-readable discovery endpoints" },
    ],
    paths: {
      "/api/v1/jobs": {
        get: {
          tags: ["Jobs"],
          summary: "Search and filter vacancies",
          description: "Returns a paginated list of job vacancies with multi-faceted filtering by district, industry, work mode, and verified status.",
          parameters: [
            { name: "query", in: "query", schema: { type: "string" }, description: "Full-text search query (title, skill, company)" },
            { name: "district", in: "query", schema: { type: "string" }, description: "Filter by Sri Lankan district (e.g. Colombo, Kandy)" },
            { name: "industry", in: "query", schema: { type: "string" }, description: "Filter by industry taxonomy" },
            { name: "workMode", in: "query", schema: { type: "string", enum: ["ONSITE", "HYBRID", "REMOTE"] }, description: "Filter by work mode" },
            { name: "employmentType", in: "query", schema: { type: "string", enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"] } },
            { name: "salaryMin", in: "query", schema: { type: "integer" }, description: "Minimum monthly compensation (LKR)" },
            { name: "isVerifiedOnly", in: "query", schema: { type: "boolean" }, description: "Filter exclusively for verified Sri Lankan employers" },
          ],
          responses: {
            "200": {
              description: "Successful response with job list and facet counters",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      total: { type: "integer" },
                      data: { type: "array", items: { $ref: "#/components/schemas/Job" } },
                      facets: { type: "object" },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Jobs"],
          summary: "Publish a new vacancy",
          description: "Allows registered employers and certified partners to post a structured job vacancy.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "district"],
                  properties: {
                    title: { type: "string", example: "Senior Cloud Architect" },
                    district: { type: "string", example: "Colombo" },
                    industry: { type: "string", example: "Information Technology" },
                    workMode: { type: "string", enum: ["ONSITE", "HYBRID", "REMOTE"], example: "HYBRID" },
                    salaryMin: { type: "integer", example: 500000 },
                    salaryMax: { type: "integer", example: 750000 },
                    requiredSkills: { type: "array", items: { type: "string" }, example: ["Azure", "Kubernetes"] },
                    shortSnippet: { type: "string", example: "Lead enterprise cloud engineering initiatives." },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Vacancy published successfully" },
            "400": { description: "Missing mandatory fields" },
          },
        },
      },
      "/api/v1/employers": {
        get: {
          tags: ["Employers"],
          summary: "List verified organizations",
          description: "Returns verified employers, business registration numbers, and SLBFE licensing status.",
          responses: {
            "200": {
              description: "Array of verified employers",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      total: { type: "integer" },
                      data: { type: "array", items: { $ref: "#/components/schemas/Employer" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/applications": {
        post: {
          tags: ["Applications"],
          summary: "Submit encrypted application (PDPA compliant)",
          description: "Submits candidate CV and details with mandatory Sri Lanka PDPA No. 9 statutory consent.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["jobId", "candidateName", "candidateEmail", "pdpaConsentGiven"],
                  properties: {
                    jobId: { type: "string", example: "job-1" },
                    candidateName: { type: "string", example: "Kasun Perera" },
                    candidateEmail: { type: "string", example: "kasun@example.com" },
                    candidatePhone: { type: "string", example: "+94771234567" },
                    cvFileName: { type: "string", example: "Kasun_Perera_CV.pdf" },
                    coverNote: { type: "string", example: "Experienced cloud engineer." },
                    pdpaConsentGiven: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Application accepted and encrypted" },
            "400": { description: "Missing fields or PDPA consent missing" },
          },
        },
        get: {
          tags: ["Applications"],
          summary: "List applications for an employer",
          parameters: [
            { name: "jobId", in: "query", schema: { type: "string" }, description: "Optional filter by job ID" },
          ],
          responses: {
            "200": { description: "Array of candidate applications" },
          },
        },
      },
      "/api/v1/feeds/itpro": {
        post: {
          tags: ["Feeds"],
          summary: "Trigger ITPro.lk sync adapter",
          description: "Executes partner feed synchronization with duplicate hash checking and attribution.",
          responses: {
            "200": { description: "Sync completed" },
          },
        },
      },
      "/api/v1/applications/{id}": {
        patch: {
          tags: ["Applications"],
          summary: "Update candidate status in recruitment pipeline",
          description: "Updates status to SUBMITTED, VIEWED, SHORTLISTED, or REJECTED.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: { type: "string", enum: ["SUBMITTED", "VIEWED", "SHORTLISTED", "REJECTED"] },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Application status updated" },
            "404": { description: "Application not found" },
          },
        },
      },
      "/api/v1/feeds": {
        get: {
          tags: ["Feeds"],
          summary: "List all active RSS and lead ingestion feeds",
          responses: {
            "200": { description: "List of registered syndication sources and sync audit logs" },
          },
        },
        post: {
          tags: ["Feeds"],
          summary: "Register a new external job RSS feed",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "url"],
                  properties: {
                    name: { type: "string" },
                    url: { type: "string" },
                    category: { type: "string" },
                    district: { type: "string" },
                    autoSyncIntervalMinutes: { type: "integer" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Feed registered" },
          },
        },
      },
      "/api/v1/feeds/sync": {
        post: {
          tags: ["Feeds"],
          summary: "Trigger immediate RSS feed synchronization and job ingestion",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["feedId"],
                  properties: {
                    feedId: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Feed synchronized and new jobs injected into catalog" },
          },
        },
      },
      "/llms.txt": {
        get: {
          tags: ["SEO & GEO"],
          summary: "Machine-readable summary for AI Search Agents",
          description: "Returns Markdown-formatted summary for Perplexity, ChatGPT, Claude, and Gemini.",
          responses: {
            "200": { description: "Raw Markdown" },
          },
        },
      },
      "/robots.txt": {
        get: {
          tags: ["SEO & GEO"],
          summary: "Edge crawler directives",
          description: "Returns plain text robots.txt with zero Cloudflare bot challenge.",
          responses: {
            "200": { description: "Raw robots.txt" },
          },
        },
      },
    },
    components: {
      schemas: {
        Employer: {
          type: "object",
          properties: {
            id: { type: "string" },
            slug: { type: "string" },
            displayName: { type: "string" },
            district: { type: "string" },
            website: { type: "string" },
            verifiedDomain: { type: "string" },
            officialWhatsApp: { type: "string" },
            slbfeLicenseNumber: { type: "string" },
            verificationStatus: { type: "string", enum: ["VERIFIED_BUSINESS", "SLBFE_LICENSED", "PENDING"] },
            isFeatured: { type: "boolean" },
            about: { type: "string" },
          },
        },
        Job: {
          type: "object",
          properties: {
            id: { type: "string" },
            slug: { type: "string" },
            title: { type: "string" },
            employer: { $ref: "#/components/schemas/Employer" },
            industry: { type: "string" },
            shortSnippet: { type: "string" },
            employmentType: { type: "string" },
            workMode: { type: "string" },
            district: { type: "string" },
            city: { type: "string" },
            salaryMin: { type: "integer" },
            salaryMax: { type: "integer" },
            salaryCurrency: { type: "string" },
            salaryPeriod: { type: "string" },
            requiredSkills: { type: "array", items: { type: "string" } },
            applyWhatsApp: { type: "string" },
            applyEmail: { type: "string" },
            datePosted: { type: "string" },
            validThrough: { type: "string" },
          },
        },
      },
    },
  };

  return NextResponse.json(swaggerSpec, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

