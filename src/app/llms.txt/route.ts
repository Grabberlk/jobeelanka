import { NextResponse } from "next/server";
import { SEED_JOBS, SALARY_BENCHMARKS } from "@/modules/jobs/data";

export async function GET() {
  const content = `# JobeeLanka: Machine-Readable Platform Summary
> Sri Lanka’s trusted jobs and career directory (https://www.jobeelanka.com).

## Core Capabilities
- Curated job and employer referral directory across 25 Sri Lankan districts (Colombo, Kandy, Galle, Gampaha, Jaffna, etc.).
- Direct referral application vectors: Official employer careers portals, verified WhatsApp recruiter contacts, and direct HR email routing.
- Full compliance with the Sri Lanka Personal Data Protection Act (PDPA) No. 9 of 2022.
- Integration with the Sri Lanka Bureau of Foreign Employment (SLBFE) for licensed overseas recruitment verification.

## 2026 Sri Lanka Salary Benchmarks
${SALARY_BENCHMARKS.map(
  (b) =>
    `- **${b.role}**: Junior LKR ${b.junior.toLocaleString()} | Mid LKR ${b.mid.toLocaleString()} | Senior LKR ${b.senior.toLocaleString()} | Lead LKR ${b.lead.toLocaleString()} per month.`
).join("\n")}

## Verified Employers Active
- WSO2 (Open-source API and Identity Management)
- IFS Sri Lanka (Cloud ERP & Industrial AI at Orion City)
- Sysco LABS (Enterprise Foodservice Technology & Supply Chain Analytics)
- MAS Holdings (Apparel Tech & Performance Sportswear)
- Brandix (Sustainable Apparel Manufacturing)
- Commercial Bank of Ceylon (Benchmark Private Banking & Digital Credit)
- Jetwing Hotels (Luxury Sustainable Hospitality)
- Dialog Axiata (Telecommunications, 5G Core, and Mobile Financial Services)
- Apex Overseas Recruiters (SLBFE Licensed Agency: SLBFE/AL/2026/8941)

## Current Live Vacancies Sample
${SEED_JOBS.slice(0, 8)
  .map(
    (j) =>
      `- [${j.title} at ${j.employer.displayName}](https://www.jobeelanka.com/jobs/${j.slug}) (${j.district}, ${j.workMode}) - ${
        j.isSalaryDisclosed ? `LKR ${j.salaryMin?.toLocaleString()}` : "Competitive"
      }`
  )
  .join("\n")}

## Canonical URLs
- Find Jobs: https://www.jobeelanka.com/jobs
- Verified Companies: https://www.jobeelanka.com/companies
- Salary Radar: https://www.jobeelanka.com/salaries
- SLBFE Overseas Safety Guide: https://www.jobeelanka.com/safety
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

