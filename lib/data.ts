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
    image: "/images/campaign-oscar-actual.webp",
    goal: 3_500_000,
    raised: 3_500_000,
    supporters: 87,
    currency: "UGX",
    status: "completed",
    organizer: "MpaMpe Campaign Team",
    organizerType: "Verified campaign partner",
    verified: true,
    featured: true,
    visibility: "public",
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
    image: "/images/campaign-joel-actual.webp",
    goal: 25_000_000,
    raised: 20_200_000,
    supporters: 320,
    currency: "UGX",
    status: "completed",
    organizer: "10 Hearts for Joel Team",
    organizerType: "Verified community campaign",
    verified: true,
    featured: true,
    visibility: "public",
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
    id: "camp_mxm_2026",
    slug: "mxm-2026-christmas-mission",
    title: "MpaMpe Xmas Mission 2026: Let Every Child Smile",
    shortTitle: "MxM 2026",
    summary:
      "Help MpaMpe spread love, hope and joy to children and families in marginalised communities this Christmas.",
    story: [
      "MpaMpe Xmas Mission 2026 is a community mission to make Christmas brighter for children and families in marginalised communities.",
      "Supporters can contribute clothes, shoes, scholastic materials, food items or money. Volunteers can also join the Mavericks team to help prepare, distribute and document support responsibly.",
      "Every contribution counts and every act of kindness matters. Together, we can reach more, raise more and do more.",
    ],
    category: "Community",
    location: "Uganda",
    image: "/images/mxm-2025/01.webp",
    goal: 10_000_000,
    raised: 0,
    supporters: 0,
    currency: "UGX",
    status: "active",
    organizer: "MpaMpe Foundation",
    organizerType: "Platform campaign",
    verified: true,
    featured: true,
    visibility: "public",
    endDate: "2026-12-20",
    budget: [
      { label: "Food, treats and family support", amount: 4_000_000 },
      { label: "Scholastic and hygiene materials", amount: 2_500_000 },
      { label: "Community transport and distribution", amount: 2_000_000 },
      { label: "Volunteer safeguarding and coordination", amount: 1_500_000 },
    ],
    updates: [
      {
        id: "update_mxm_2026_1",
        title: "The MxM 2026 call is open",
        body: "Donate, volunteer or register for mission updates as MpaMpe prepares to bring Christmas support to more families.",
        publishedAt: "2026-11-14",
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
    slug: "oscar-tuition-campaign",
    title: "Eight days of giving: how Oscar's tuition goal was reached",
    excerpt:
      "MpaMpe's 2023 pilot brought the Makerere community together to raise UGX 3.5 million for Oscar Nigyema's tuition.",
    body: [
      "Oscar Nigyema was pursuing an Economics degree at Makerere University when tuition pressure threatened to interrupt his studies.",
      "The campaign set a clear UGX 3.5 million goal and invited the university community to rally around a specific, verified need. Eight days later, the full target had been raised by 87 supporters.",
      "Oscar's campaign became MpaMpe's first major proof that trusted digital storytelling can turn a community's care into practical support. It also shaped the platform's approach to campaign review, budgeting and transparent updates.",
    ],
    image: "/images/campaign-oscar.webp",
    date: "2023-10-18",
    category: "Education campaign",
    sourceHref: "https://www.youtube.com/watch?v=fbus6frL04Q",
    sourceLabel: "Watch Oscar's campaign story",
  },
  {
    slug: "joel-heart-surgery",
    title: "10 Hearts for Joel: a community helped make surgery possible",
    excerpt:
      "The MpaMpe community raised UGX 20,260,500 before Joel Mugisha's successful heart surgery.",
    body: [
      "Joel Mugisha, a mechanical engineering student, needed urgent specialist care for a serious heart condition. His family and university community needed a trusted way to coordinate support.",
      "Through the 10 Hearts for Joel campaign, supporters shared Joel's story, contributed and kept the appeal moving. Before surgery began, the community had raised UGX 20,260,500 toward the UGX 25 million goal.",
      "Joel later shared his gratitude after a successful surgery. MpaMpe also recognised the Mulago Heart Institute and friends who helped subsidise and clear the remaining balance.",
    ],
    image: "/images/campaign-joel.webp",
    date: "2024-11-20",
    category: "Medical campaign",
    sourceHref:
      "https://www.linkedin.com/posts/mpampe_10hearts4joel-togetherwecan-mpampe-activity-7286696050592014336-m-8K",
    sourceLabel: "Read Joel's campaign update",
  },
  {
    slug: "mxm-2025-impact",
    title: "MxM 2025: 254 people reached through one Christmas mission",
    excerpt:
      "Seventeen Mavericks and a generous community brought clothing, shoes, food, hygiene support and celebration to Makerere Kivulu.",
    body: [
      "MpaMpe Xmas Mission 2025 brought 17 Mavericks to Makerere Kivulu to share practical support and festive joy with children and families.",
      "In two weeks, the community raised UGX 520,000. The mission distributed women's, men's and baby clothing packs, 101 pairs of shoes, sanitary pads for 30 women, food and treats, and four large Christmas gift hampers.",
      "In total, 254 people were reached. The day also made room for games, dancing, shared meals and the human connections at the heart of the mission's theme: Let Every Child Smile.",
    ],
    image: "/images/IMG-20251130-WA0102.jpg",
    date: "2025-12-20",
    category: "Community mission",
    sourceHref:
      "https://www.linkedin.com/feed/update/urn:li:activity:7409317333971763200",
    sourceLabel: "Read the original MxM impact update",
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

export const mxmGalleryImages = [
  { src: "/images/mxm-2025/01.webp", alt: "MpaMpe Mavericks gathered for the 2025 Xmas Mission" },
  { src: "/images/mxm-2025/02.webp", alt: "MpaMpe Xmas Mission celebration cake" },
  { src: "/images/mxm-2025/03.webp", alt: "MpaMpe Mavericks preparing for community activities" },
  { src: "/images/mxm-2025/04.webp", alt: "Children gathered during the MpaMpe Xmas Mission" },
  { src: "/images/mxm-2025/05.webp", alt: "MpaMpe Mavericks sharing food and gifts" },
  { src: "/images/mxm-2025/06.webp", alt: "A MpaMpe Maverick welcoming community members" },
  { src: "/images/mxm-2025/07.webp", alt: "A volunteer presenting a Christmas gift hamper" },
  { src: "/images/mxm-2025/08.webp", alt: "MpaMpe volunteers speaking with community members" },
  { src: "/images/mxm-2025/09.webp", alt: "A community member meeting a MpaMpe Maverick" },
  { src: "/images/mxm-2025/10.webp", alt: "MpaMpe volunteers coordinating the mission day" },
  { src: "/images/mxm-2025/11.webp", alt: "MpaMpe Mavericks in front of the Xmas Mission banner" },
  { src: "/images/mxm-2025/12.webp", alt: "MpaMpe Mavericks celebrating a successful mission" },
] as const;

const pixPngImages = new Set([35, 40, 41]);

export const pixGalleryImages = Array.from({ length: 48 }, (_, index) => {
  const photoNumber = index + 1;
  const extension = pixPngImages.has(photoNumber) ? "png" : "jpg";

  return {
    src: `/images/gallery/pix/pix-${String(photoNumber).padStart(3, "0")}.${extension}`,
    alt: `MpaMpe community photo ${photoNumber}`,
  };
});

export const galleryImages = [
  ...pixGalleryImages,
  {
    src: "/images/campaign-oscar-actual.webp",
    alt: "MpaMpe team with Oscar after his education campaign",
  },
  {
    src: "/images/campaign-joel-actual.webp",
    alt: "MpaMpe team during Joel's medical support campaign",
  },
  ...mxmGalleryImages,
] as const;
