import { AnalyzedJobPreview } from "../../types";

function cleanText(val: string): string {
  return val
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export const UndpAdapter = {
  canHandle(url: string, html = ""): boolean {
    const isUndpUrl = /undp\.org|partneragencies\.net/i.test(url);
    const hasUndpMarker = /cj_view_jobs|cj_view_job|undp.*vacanc/i.test(html) || isUndpUrl;
    return hasUndpMarker;
  },

  parse(html: string, baseUrl = "https://jobs.undp.org"): AnalyzedJobPreview[] {
    const jobs: AnalyzedJobPreview[] = [];

    // Match rows from standard UNDP vacancy tables
    // Table rows typically contain: <tr><td>...<a href="cj_view_job.cfm?cur_job_id=...">Title</a></td><td>Agency</td><td>Duty Station</td><td>Deadline</td></tr>
    const rowMatches = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];

    for (let i = 0; i < rowMatches.length; i++) {
      const row = rowMatches[i];

      // Must contain a job view link
      const linkMatch =
        row.match(/<a[^>]+href=["']([^"']*(?:cj_view_job|erecruitjobs|erecruit|job_id=)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/i) ||
        row.match(/<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*(?:Officer|Specialist|Consultant|Advisor|Associate|Manager|Analyst|Coordinator|Intern)[^<]*)<\/a>/i);

      if (!linkMatch) continue;

      const rawHref = linkMatch[1];
      const title = cleanText(linkMatch[2]);
      if (!title || title.length < 4 || /back to top|click here/i.test(title)) continue;

      let fullApplyUrl = rawHref;
      try {
        fullApplyUrl = new URL(rawHref, baseUrl).toString();
      } catch {
        // keep raw
      }

      // Extract remaining table cells
      const cells = (row.match(/<td[^>]*>[\s\S]*?<\/td>/gi) || []).map(cleanText);
      
      let agency = "UNDP";
      let location = "Colombo, Sri Lanka";
      let closingDate: string | undefined = undefined;

      // Look across cells for duty station and deadline
      for (const cell of cells) {
        if (/UN\w+|UNDP|UNICEF|UNFPA|UNV/i.test(cell) && cell.length < 40) {
          agency = cell;
        } else if (/Colombo|Sri Lanka|Kandy|Galle|Jaffna|Worldwide|Multiple/i.test(cell)) {
          location = cell;
        } else if (/\d{1,2}-[A-Za-z]{3}-\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}/.test(cell)) {
          closingDate = cell;
        }
      }

      const isRemote = /remote|telework|home-based|home based/i.test(`${title} ${location}`);
      const district = /kandy/i.test(location) ? "Kandy" : /galle/i.test(location) ? "Galle" : "Colombo";

      jobs.push({
        tempId: `undp-${Math.random().toString(36).slice(2, 9)}`,
        title,
        company: agency,
        companyLogo: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=128&auto=format&fit=crop&q=80",
        location,
        district,
        workMode: isRemote ? "REMOTE" : "ONSITE",
        employmentType: /intern/i.test(title) ? "INTERNSHIP" : /consult/i.test(title) ? "CONTRACT" : "FULL_TIME",
        industry: "UN Missions & International Development",
        applyUrl: fullApplyUrl,
        sourceUrl: fullApplyUrl,
        shortSnippet: `Official vacancy in ${agency}: ${title}. Location: ${location}. Apply directly on official UN career destination portal.`,
        closingDate,
        confidenceScore: 95,
        detectionStrategy: "ADAPTER_UNDP",
        isDuplicate: false,
        missingFields: [],
      });
    }

    return jobs;
  },
};

