import { Job } from "@/modules/jobs/types";

export function generateJobPostingSchema(job: Job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.descriptionHtml || `<p>${job.shortSnippet}</p>`,
    "identifier": {
      "@type": "PropertyValue",
      "name": "JobeeLanka",
      "value": job.id,
    },
    "datePosted": job.datePosted,
    "validThrough": job.validThrough,
    "employmentType": job.employmentType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.employer.displayName,
      "sameAs": job.employer.website,
      "logo": job.employer.logo,
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.city,
        "addressRegion": job.district,
        "addressCountry": job.country,
      },
    },
    ...(job.workMode === "REMOTE" && {
      "jobLocationType": "TELECOMMUTE",
      "applicantLocationRequirements": {
        "@type": "Country",
        "name": "Sri Lanka",
      },
    }),
    ...(job.isSalaryDisclosed && job.salaryMin && {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": job.salaryCurrency,
        "value": {
          "@type": "QuantitativeValue",
          "minValue": job.salaryMin,
          "maxValue": job.salaryMax || job.salaryMin,
          "unitText": job.salaryPeriod,
        },
      },
    }),
    "directApply": job.directApplyAllowed,
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

