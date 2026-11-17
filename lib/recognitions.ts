export type Recognition = {
  year: string;
  title: string;
  result: string;
  description: string;
  sourceHref?: string;
  sourceLabel?: string;
  recordType: "independently sourced" | "MpaMpe record";
};

export const recognitions: Recognition[] = [
  {
    year: "2022",
    title: "Google Developer Student Clubs Solution Challenge",
    result: "Global Top 50",
    description:
      "MpaMpe was selected among the competition's Top 50 projects worldwide.",
    sourceHref:
      "https://developers.googleblog.com/2022/10/creating-stem-culture-on-campus-in-uganda.html",
    sourceLabel: "Google Developers",
    recordType: "independently sourced",
  },
  {
    year: "2022",
    title: "MTN MoMo Hackathon Uganda",
    result: "1st Runner-Up · USD 3,000",
    description:
      "MpaMpe placed second among the mobile money innovations selected for the Uganda finale.",
    sourceHref:
      "https://pctechmag.com/2022/09/mtn-momo-uganda-outbox-award-top-innovations-in-momo-hackathon/",
    sourceLabel: "PC Tech Magazine",
    recordType: "independently sourced",
  },
  {
    year: "2022",
    title: "HiPipo Women in FinTech Hackathon",
    result: "Top 5 finalist",
    description:
      "Recorded in MpaMpe's official pitch history as an early fintech milestone.",
    sourceHref:
      "https://innovug.com/wp-content/uploads/2024/09/MpaMpe-Official-Pitch-2024-184ad681350733c27c9a7fbb89133447.pdf",
    sourceLabel: "MpaMpe 2024 pitch deck",
    recordType: "MpaMpe record",
  },
  {
    year: "2023",
    title: "FITSPA Women's Pitch Competition",
    result: "1st Runner-Up",
    description:
      "MpaMpe earned second place at the 2023 Women in FinTech pitch competition.",
    sourceHref:
      "https://fitspa.ug/wp-content/uploads/2024/06/FITSPA-Community-Update-Volume-2.pdf",
    sourceLabel: "FITSPA community update",
    recordType: "independently sourced",
  },
  {
    year: "2023",
    title: "Twende Afrika Innovation Competition",
    result: "Winner",
    description:
      "Listed among MpaMpe's official innovation milestones; the category is being documented for the public archive.",
    sourceHref: "https://linktr.ee/mpampe",
    sourceLabel: "MpaMpe official links",
    recordType: "MpaMpe record",
  },
  {
    year: "2024",
    title: "Makerere University Student Innovation Challenge",
    result: "Winner · 1st place",
    description:
      "MpaMpe took the top spot at Makerere University's 2024 innovation challenge and CEDAT Open Day.",
    sourceHref:
      "https://www.linkedin.com/posts/mpampe_sustainabilitychampions-mpampe-solve4sdgs-activity-7170235050599333888-wI_q",
    sourceLabel: "MpaMpe announcement",
    recordType: "independently sourced",
  },
  {
    year: "2024",
    title: "GEN Uganda Pitch Competition",
    result: "1st Runner-Up",
    description:
      "Part of MpaMpe's broader competition record; supporting organiser documentation is being added to the archive.",
    recordType: "MpaMpe record",
  },
  {
    year: "2025",
    title: "Junior Achievement Uganda Social Equity Programme",
    result: "Awarded team",
    description:
      "MpaMpe was selected among seven teams awarded seed funding through the 2025 programme.",
    sourceHref:
      "https://nilepost.co.ug/business/309423/creating-bright-boundless-futures-junior-achievement-uganda-awards-top-7-2025-social-equity-program-teams",
    sourceLabel: "Nile Post",
    recordType: "independently sourced",
  },
  {
    year: "2026",
    title: "Africa Startup Ecosystem Builders Awards",
    result: "Continental category winner",
    description:
      "Winner of Ecosystem Diversity, Equity & Inclusion Champion of the Year, presented in Johannesburg on 21 October 2026.",
    sourceHref: "https://www.asebs.com/winners/2026/mpampe",
    sourceLabel: "ASEB official winner profile",
    recordType: "independently sourced",
  },
];

export const globalStages: Array<{
  year: string;
  title: string;
  description: string;
  href?: string;
}> = [
  {
    year: "2023",
    title: "Presidential Student Innovations & Expo · Uganda",
    description:
      "MpaMpe presented its crowdfunding model to President Yoweri Museveni during the national student innovation showcase.",
    href: "https://www.linkedin.com/posts/mpampe_mpampe-crowdfundingrevolution-activity-7122876661947117569-QBZi",
  },
  {
    year: "2023",
    title: "UN PRME Global Forum · New York",
    description:
      "MpaMpe joined the global conversation around responsible management education and youth-led impact in New York.",
    href: "https://www.unprme.org/global-forum-2023/",
  },
  {
    year: "2024",
    title: "GreSFet · Addis Ababa",
    description:
      "MpaMpe shared its community-finance work at the regional gathering in Addis Ababa.",
  },
  {
    year: "2026",
    title: "ASEB Awards · Johannesburg",
    description:
      "MpaMpe represented Uganda's inclusive startup ecosystem and received a continental award.",
    href: "https://www.asebs.com/winners/2026/mpampe",
  },
];

export const newsLinks = [
  {
    outlet: "Google Developers Blog",
    title: "Creating a STEM culture on campus in Uganda",
    href: "https://developers.googleblog.com/2022/10/creating-stem-culture-on-campus-in-uganda.html",
  },
  {
    outlet: "PC Tech Magazine",
    title: "Top innovations awarded at the MTN MoMo Hackathon",
    href: "https://pctechmag.com/2022/09/mtn-momo-uganda-outbox-award-top-innovations-in-momo-hackathon/",
  },
  {
    outlet: "The Observer",
    title: "Kyambogo and MUBS students emerge best at MTN MoMo Hackathon",
    href: "https://observer.ug/businessnews/75372-kyambogo-mubs-students-emerge-best-at-mtn-momo-hackathon-2022",
  },
  {
    outlet: "The Independent Uganda",
    title: "MpaMpe application connects people in need with prospective funders",
    href: "https://www.independent.co.ug/mpampe-application-set-to-connect-the-needy-and-prospective-funders/",
  },
  {
    outlet: "Nile Post",
    title: "Junior Achievement Uganda awards social-equity teams",
    href: "https://nilepost.co.ug/business/309423/creating-bright-boundless-futures-junior-achievement-uganda-awards-top-7-2025-social-equity-program-teams",
  },
] as const;
