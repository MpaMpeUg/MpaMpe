import type {
  Campaign,
  Event,
  MaverickOpportunity,
  Story,
} from "@/lib/types";

export const campaigns: Campaign[] = [
  {
    id: "camp_oscar",
    slug: "oscar-nigyema-education-support",
    title: "Help Oscar Nigyema Continue His Economics Degree",
    shortTitle: "Oscar's education journey",
    summary:
      "A student-led campaign that helped Oscar stay at Makerere University and continue building his future.",
    story: [
      "Oscar Nigyema was pursuing an Economics degree at Makerere University when tuition pressure threatened to interrupt his studies.",
      "The MpaMpe community rallied around a clear, verified need. In eight days, students, friends and well-wishers contributed the full tuition target.",
      "Oscar's campaign became MpaMpe's first proof that trusted digital storytelling can turn a community's care into practical support.",
    ],
    category: "Education",
    location: "Kampala, Uganda",
    image: "/images/campaign-oscar.webp",
    goal: 3_500_000,
    raised: 3_500_000,
    supporters: 87,
    currency: "UGX",
    status: "completed",
    organizer: "MpaMpe Campaign Team",
    organizerType: "Verified campaign partner",
    verified: true,
    featured: true,
    endDate: "2023-10-18",
    budget: [{ label: "University tuition", amount: 3_500_000 }],
    updates: [
      {
        id: "update_oscar_1",
        title: "Goal reached in eight days",
        body: "The community completed Oscar's tuition target. Thank you to every supporter who shared and gave.",
        publishedAt: "2023-10-18",
      },
    ],
  },
  {
    id: "camp_joel",
    slug: "joel-mugisha-heart-surgery",
    title: "Support Joel Mugisha's Life-Saving Heart Surgery",
    shortTitle: "10 Hearts for Joel",
    summary:
      "Hundreds of donors united to help a mechanical engineering student access urgent heart treatment.",
    story: [
      "Joel Mugisha needed urgent specialist care for a serious heart condition. His family and university community required a trusted way to coordinate support.",
      "MpaMpe helped organize the story, donation information and community outreach. The campaign brought together 320 supporters and raised more than UGX 20 million.",
      "The campaign demonstrated the power of transparent updates and focused community mobilization during a medical emergency.",
    ],
    category: "Medical",
    location: "Kampala, Uganda",
    image: "/images/campaign-joel.webp",
    goal: 25_000_000,
    raised: 20_200_000,
    supporters: 320,
    currency: "UGX",
    status: "completed",
    organizer: "10 Hearts for Joel Team",
    organizerType: "Verified community campaign",
    verified: true,
    featured: true,
    endDate: "2024-11-15",
    budget: [
      { label: "Medical procedure and hospital care", amount: 18_500_000 },
      { label: "Tests, medication and recovery support", amount: 6_500_000 },
    ],
    updates: [
      {
        id: "update_joel_1",
        title: "Community campaign completed",
        body: "The campaign closed after mobilising 320 supporters. Final treatment and accountability updates are being consolidated.",
        publishedAt: "2024-11-20",
      },
    ],
  },
  {
    id: "camp_mavericks",
    slug: "equip-mpampe-mavericks",
    title: "Equip MpaMpe Mavericks for Community Impact",
    shortTitle: "Equip the Mavericks",
    summary:
      "Help volunteers reach communities, document needs responsibly and amplify verified campaigns.",
    story: [
      "MpaMpe Mavericks are volunteers who support campaign storytelling, community outreach, events, technology and field activities.",
      "This campaign will provide training materials, identification, transport support and basic storytelling equipment for supervised community work.",
      "Every contribution helps volunteers serve more safely, consistently and effectively.",
    ],
    category: "Community",
    location: "Uganda",
    image: "/images/hero.webp",
    goal: 15_000_000,
    raised: 6_450_000,
    supporters: 112,
    currency: "UGX",
    status: "active",
    organizer: "MpaMpe Foundation",
    organizerType: "Platform campaign",
    verified: true,
    featured: true,
    endDate: "2026-09-30",
    budget: [
      { label: "Volunteer orientation and safeguarding", amount: 3_000_000 },
      { label: "Community field support", amount: 6_000_000 },
      { label: "Storytelling and identification kits", amount: 4_500_000 },
      { label: "Monitoring and recognition", amount: 1_500_000 },
    ],
    updates: [
      {
        id: "update_mavericks_1",
        title: "First orientation cohort planned",
        body: "The next Mavericks orientation will cover safeguarding, campaign ethics and responsible digital advocacy.",
        publishedAt: "2026-06-15",
      },
    ],
  },
];

export const maverickOpportunities: MaverickOpportunity[] = [
  {
    id: "opp_campaign_amplifier",
    title: "Campaign Amplifier",
    type: "Digital advocacy",
    location: "Remote / Uganda",
    commitment: "2–4 hours weekly",
    closingDate: "2026-08-15",
    spaces: 25,
    summary:
      "Share approved campaign content and help verified stories reach supportive communities.",
    skills: ["Social media", "Communication", "Community building"],
  },
  {
    id: "opp_storytelling",
    title: "Storytelling Maverick",
    type: "Creative",
    location: "Kampala",
    commitment: "Two field sessions monthly",
    closingDate: "2026-08-30",
    spaces: 8,
    summary:
      "Support consent-led interviews, photography, video and campaign updates.",
    skills: ["Photography", "Writing", "Video"],
  },
  {
    id: "opp_technology",
    title: "Technology Maverick",
    type: "Technology",
    location: "Remote",
    commitment: "Flexible project work",
    closingDate: "2026-09-15",
    spaces: 10,
    summary:
      "Test the MpaMpe platform, improve data quality and support digital literacy.",
    skills: ["Testing", "Design", "Software", "Data"],
  },
];

export const stories: Story[] = [
  {
    slug: "what-oscar-taught-us",
    title: "What Oscar's eight-day campaign taught us about community",
    excerpt:
      "A clear need, a trusted story and a determined student community became MpaMpe's first major proof point.",
    image: "/images/campaign-oscar.webp",
    date: "2026-05-18",
    category: "Campaign lessons",
  },
  {
    slug: "mavericks-community-service",
    title: "Mavericks: volunteering that moves beyond the share button",
    excerpt:
      "The volunteer community is creating a practical bridge between online campaigns and people on the ground.",
    image: "/images/mavericks.webp",
    date: "2026-06-02",
    category: "Community",
  },
  {
    slug: "building-trust-into-giving",
    title: "Why transparent campaign updates matter",
    excerpt:
      "Donors deserve to see more than a progress bar. Updates turn a transaction into accountable participation.",
    image: "/images/impact-2.webp",
    date: "2026-06-12",
    category: "Trust",
  },
];

export const events: Event[] = [
  {
    id: "event_orientation",
    title: "Mavericks Community Orientation",
    date: "2026-07-18",
    location: "Kampala — venue shared after registration",
    type: "Training",
    summary:
      "An introduction to MpaMpe, safeguarding, campaign ethics and volunteer opportunities.",
  },
  {
    id: "event_campaign_clinic",
    title: "Campaign Story Clinic",
    date: "2026-08-08",
    location: "Online",
    type: "Workshop",
    summary:
      "A practical session for organizers preparing a clear budget, story and campaign evidence.",
  },
];

export const impactStats = [
  { value: "3", label: "flagship campaigns delivered" },
  { value: "500+", label: "people mobilised to give" },
  { value: "UGX 30M+", label: "community support coordinated" },
  { value: "1", label: "growing Mavericks community" },
];
