import { useState, useEffect, useMemo } from "react";

const SOURCES = [
  { id: "nyt", name: "NYT The Upshot", emoji: "📰", region: "US" },
  { id: "reuters", name: "Reuters Graphics", emoji: "🌐", region: "Global" },
  { id: "bloomberg", name: "Bloomberg Graphics", emoji: "📊", region: "US" },
  { id: "ft", name: "FT Visual & Data Journalism", emoji: "🟧", region: "UK" },
  { id: "washpost", name: "Washington Post", emoji: "🏛️", region: "US" },
  { id: "owid", name: "Our World in Data", emoji: "🌍", region: "Global" },
  { id: "marshall", name: "The Marshall Project", emoji: "⚖️", region: "US" },
  { id: "scmp", name: "SCMP Infographics", emoji: "🔴", region: "Asia" },
  { id: "caixin", name: "Caixin 財新·數字說", emoji: "🟡", region: "Asia" },
  { id: "initium", name: "Initium 端傳媒·數洞", emoji: "🟣", region: "Asia" },
  { id: "nbc", name: "NBC News", emoji: "🔵", region: "US" },
  { id: "gijn", name: "GIJN", emoji: "🔎", region: "Global" },
];

const TOPICS = [
  "All",
  "Politics",
  "Climate",
  "Health",
  "Economics",
  "Crime & Justice",
  "Technology",
  "Demographics",
  "Sports",
  "Education",
];

const SAMPLE_ARTICLES = [
  {
    id: 1,
    title: "Mapping the Surge: How Migration Patterns Shifted in 2025",
    source: "reuters",
    topic: "Demographics",
    date: "2026-03-28",
    url: "#",
    summary:
      "Reuters Graphics visualizes three decades of global migration data, revealing unexpected corridors between South America and Southeast Asia.",
    dataset: {
      name: "UN DESA International Migration Stock 2024",
      url: "https://www.un.org/development/desa/pd/content/international-migrant-stock",
    },
    featured: true,
  },
  {
    id: 2,
    title: "The Hidden Cost of Heat: A County-by-County Analysis",
    source: "nyt",
    topic: "Climate",
    date: "2026-03-26",
    url: "#",
    summary:
      "The Upshot combines satellite thermal data with hospital admission records to quantify the health burden of extreme heat across the United States.",
    dataset: {
      name: "NOAA Climate Data + CMS Hospital Records",
      description:
        "Composite dataset from NOAA daily temperature readings and anonymized CMS hospital admission data, 2015–2025.",
    },
    featured: true,
  },
  {
    id: 3,
    title: "Where Every Dollar Goes: Federal Spending Visualized",
    source: "washpost",
    topic: "Economics",
    date: "2026-03-25",
    url: "#",
    summary:
      "An interactive treemap breaks down the 2026 federal budget, letting readers explore discretionary vs. mandatory spending at every level.",
    dataset: {
      name: "USAspending.gov API",
      url: "https://api.usaspending.gov/",
    },
  },
  {
    id: 4,
    title: "全球晶片供應鏈的脆弱節點",
    source: "caixin",
    topic: "Technology",
    date: "2026-03-24",
    url: "#",
    summary:
      "Caixin's data team maps the global semiconductor supply chain, identifying critical chokepoints and geopolitical risk factors across 14 countries.",
    dataset: {
      description:
        "Proprietary Caixin dataset combining trade flow data from UN Comtrade with firm-level supply chain disclosures.",
    },
  },
  {
    id: 5,
    title: "Exposed: Prison Temperatures Exceed Safety Thresholds",
    source: "marshall",
    topic: "Crime & Justice",
    date: "2026-03-23",
    url: "#",
    summary:
      "An investigation using IoT sensor data from 250+ correctional facilities reveals systemic failures in climate control during summer months.",
    dataset: {
      name: "Marshall Project FOIA Sensor Data",
      url: "https://github.com/themarshallproject/prison-temp-data",
    },
  },
  {
    id: 6,
    title: "The Inequality Equation: Education Spending vs. Outcomes",
    source: "ft",
    topic: "Education",
    date: "2026-03-22",
    url: "#",
    summary:
      "FT's visual team examines whether increased education spending actually improves student outcomes, using OECD PISA data across 80 countries.",
    dataset: {
      name: "OECD PISA 2025 Results",
      url: "https://www.oecd.org/pisa/data/",
    },
  },
  {
    id: 7,
    title: "香港人口結構轉變的十年觀察",
    source: "initium",
    topic: "Demographics",
    date: "2026-03-21",
    url: "#",
    summary:
      "Initium's data team traces a decade of demographic shifts in Hong Kong through census data, immigration records, and birth/death registries.",
    dataset: {
      name: "Hong Kong Census & Statistics Dept",
      url: "https://www.censtatd.gov.hk/",
    },
  },
  {
    id: 8,
    title: "Life Expectancy: The Pandemic's Long Shadow",
    source: "owid",
    topic: "Health",
    date: "2026-03-20",
    url: "#",
    summary:
      "Our World in Data updates its life expectancy tracker showing which countries have recovered to pre-pandemic levels — and which haven't.",
    dataset: {
      name: "OWID Life Expectancy Dataset",
      url: "https://github.com/owid/owid-datasets",
    },
  },
  {
    id: 9,
    title: "AI Lobbying Explodes: Who's Spending What in Washington",
    source: "bloomberg",
    topic: "Politics",
    date: "2026-03-19",
    url: "#",
    summary:
      "Bloomberg Graphics tracks the 400% increase in AI-related lobbying expenditures since 2023, mapping connections between firms and legislators.",
    dataset: {
      name: "OpenSecrets Lobbying Database",
      url: "https://www.opensecrets.org/federal-lobbying",
    },
  },
  {
    id: 10,
    title: "Inside the Numbers: Asia's Startup Funding Drought",
    source: "scmp",
    topic: "Economics",
    date: "2026-03-18",
    url: "#",
    summary:
      "SCMP Infographics charts the sharp decline in venture capital flowing to Asian startups, sector by sector, from 2021 peak to present.",
    dataset: {
      description:
        "Aggregated from Crunchbase, PitchBook, and regional VC databases. Not publicly downloadable.",
    },
  },
  {
    id: 11,
    title: "Cross-Border Data Investigations: A GIJN Toolkit",
    source: "gijn",
    topic: "Technology",
    date: "2026-03-17",
    url: "#",
    summary:
      "A methodological guide to cross-border data investigations featuring case studies from Pandora Papers, FinCEN Files, and Pegasus Project.",
    dataset: {
      name: "ICIJ Offshore Leaks Database",
      url: "https://offshoreleaks.icij.org/",
    },
  },
  {
    id: 12,
    title: "The Changing Map of American Sports Fandom",
    source: "nbc",
    topic: "Sports",
    date: "2026-03-15",
    url: "#",
    summary:
      "Using geotagged social media data and merchandise sales, NBC maps how sports team loyalties have shifted across state lines over the past decade.",
    dataset: {
      description:
        "Composite of Twitter/X API geotagged posts and licensed merchandise sales data from Fanatics.",
    },
  },
];

/* ─── Styles ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --ink: #1a1a1a;
    --paper: #faf8f4;
    --cream: #f0ece4;
    --warm-gray: #8c8578;
    --accent: #c43d2e;
    --accent-soft: #f5e6e4;
    --rule: #d4cfc6;
    --blue: #2563eb;
    --blue-soft: #e8effd;
    --green: #16803c;
    --green-soft: #e6f4ec;
    --tag-bg: #eae6de;
  }

  body {
    font-family: 'IBM Plex Sans', sans-serif;
    background: var(--paper);
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .app {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ─── Masthead ─── */
  .masthead {
    text-align: center;
    padding: 48px 0 24px;
    border-bottom: 3px double var(--ink);
  }
  .masthead-date {
    font-size: 11px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--warm-gray);
    margin-bottom: 12px;
  }
  .masthead h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(32px, 6vw, 56px);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -0.5px;
  }
  .masthead h1 .accent { color: var(--accent); }
  .masthead-sub {
    font-size: 14px;
    color: var(--warm-gray);
    margin-top: 10px;
    font-weight: 300;
    letter-spacing: 0.3px;
  }

  /* ─── Nav ─── */
  .nav-bar {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--rule);
    overflow-x: auto;
    scrollbar-width: none;
  }
  .nav-bar::-webkit-scrollbar { display: none; }
  .nav-tab {
    padding: 14px 20px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--warm-gray);
    cursor: pointer;
    border: none;
    background: none;
    white-space: nowrap;
    position: relative;
    transition: color 0.2s;
    font-family: 'IBM Plex Sans', sans-serif;
  }
  .nav-tab:hover { color: var(--ink); }
  .nav-tab.active { color: var(--ink); }
  .nav-tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 16px;
    right: 16px;
    height: 2px;
    background: var(--accent);
  }

  /* ─── Filters ─── */
  .filter-bar {
    display: flex;
    gap: 8px;
    padding: 20px 0;
    flex-wrap: wrap;
    align-items: center;
    border-bottom: 1px solid var(--rule);
  }
  .filter-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--warm-gray);
    margin-right: 4px;
  }
  .filter-pill {
    padding: 5px 14px;
    border-radius: 100px;
    border: 1px solid var(--rule);
    background: transparent;
    font-size: 12.5px;
    font-family: 'IBM Plex Sans', sans-serif;
    color: var(--warm-gray);
    cursor: pointer;
    transition: all 0.2s;
  }
  .filter-pill:hover { border-color: var(--ink); color: var(--ink); }
  .filter-pill.active { background: var(--ink); border-color: var(--ink); color: var(--paper); }

  .search-input {
    margin-left: auto;
    padding: 6px 14px;
    border: 1px solid var(--rule);
    border-radius: 100px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 13px;
    background: transparent;
    color: var(--ink);
    width: 200px;
    transition: border-color 0.2s;
    outline: none;
  }
  .search-input::placeholder { color: var(--warm-gray); opacity: 0.6; }
  .search-input:focus { border-color: var(--ink); }

  /* ─── Source dropdown ─── */
  .source-dropdown { position: relative; }
  .source-dropdown-btn {
    padding: 5px 14px;
    border-radius: 100px;
    border: 1px solid var(--rule);
    background: transparent;
    font-size: 12.5px;
    font-family: 'IBM Plex Sans', sans-serif;
    color: var(--warm-gray);
    cursor: pointer;
    transition: all 0.2s;
  }
  .source-dropdown-btn:hover { border-color: var(--ink); color: var(--ink); }
  .source-dropdown-btn.has-filter { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .source-menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    background: var(--paper);
    border: 1px solid var(--rule);
    border-radius: 8px;
    padding: 8px 0;
    min-width: 260px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    z-index: 100;
    max-height: 340px;
    overflow-y: auto;
  }
  .source-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 16px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-family: 'IBM Plex Sans', sans-serif;
    color: var(--ink);
  }
  .source-option:hover { background: var(--cream); }
  .source-check {
    width: 16px; height: 16px;
    border: 1.5px solid var(--rule);
    border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px;
    flex-shrink: 0;
    transition: all 0.15s;
  }
  .source-check.checked { background: var(--ink); border-color: var(--ink); color: var(--paper); }

  /* ─── Featured ─── */
  .featured-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 32px 0;
    border-bottom: 1px solid var(--rule);
  }
  @media (max-width: 700px) { .featured-row { grid-template-columns: 1fr; } }
  .featured-card {
    padding: 24px;
    background: linear-gradient(135deg, var(--cream) 0%, var(--paper) 100%);
    border: 1px solid var(--rule);
    border-radius: 4px;
    transition: box-shadow 0.3s, transform 0.3s;
    cursor: pointer;
  }
  .featured-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
  .featured-badge {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
  }
  .featured-card h3 {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    font-weight: 400;
    line-height: 1.3;
    margin-bottom: 8px;
  }
  .featured-card p { font-size: 14px; color: #555; line-height: 1.6; font-weight: 300; }

  /* ─── Article list ─── */
  .article-list { padding: 8px 0 40px; }
  .article-item {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 16px;
    padding: 20px 0;
    border-bottom: 1px solid var(--rule);
    align-items: start;
    transition: background 0.2s;
    cursor: pointer;
  }
  .article-item:hover { background: rgba(0,0,0,0.015); margin: 0 -12px; padding-left: 12px; padding-right: 12px; }
  @media (max-width: 640px) {
    .article-item { grid-template-columns: 1fr; gap: 4px; }
    .article-date { order: -1; }
  }
  .article-date {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: var(--warm-gray);
    padding-top: 3px;
  }
  .article-main h3 {
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.35;
    margin-bottom: 4px;
  }
  .source-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 500;
    color: var(--warm-gray);
    margin-right: 8px;
  }
  .topic-tag {
    display: inline-block;
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    background: var(--tag-bg);
    padding: 2px 8px;
    border-radius: 3px;
    color: var(--warm-gray);
  }
  .article-main p { font-size: 13.5px; color: #666; margin-top: 6px; line-height: 1.55; font-weight: 300; }
  .article-dataset {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    font-size: 12px;
    color: var(--blue);
    font-weight: 500;
  }
  .ds-icon {
    width: 16px; height: 16px;
    background: var(--blue-soft);
    border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px;
    flex-shrink: 0;
  }
  .article-dataset a { color: var(--blue); text-decoration: none; }
  .article-dataset a:hover { text-decoration: underline; }
  .ds-desc { color: #888 !important; font-weight: 300 !important; font-style: italic; }

  /* ─── Sources tab ─── */
  .sources-section { padding: 32px 0 48px; }
  .sources-section h2 { font-family: 'DM Serif Display', serif; font-size: 24px; font-weight: 400; margin-bottom: 20px; }
  .sources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
  }
  .source-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid var(--rule);
    border-radius: 4px;
    transition: all 0.2s;
    cursor: pointer;
  }
  .source-card:hover { border-color: var(--ink); background: var(--cream); }
  .s-emoji { font-size: 20px; }
  .s-info { flex: 1; }
  .s-name { font-size: 14px; font-weight: 500; }
  .s-region { font-size: 11px; color: var(--warm-gray); text-transform: uppercase; letter-spacing: 1px; }
  .s-status {
    width: 8px; height: 8px;
    background: var(--green);
    border-radius: 50%;
    opacity: 0.7;
  }

  /* ─── Feed status ─── */
  .feed-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 0 8px;
    font-size: 12px;
    color: var(--warm-gray);
  }
  .feed-dot {
    width: 6px; height: 6px;
    background: var(--green);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

  /* ─── Empty ─── */
  .empty-state { text-align: center; padding: 60px 20px; color: var(--warm-gray); }
  .empty-state .empty-icon { font-size: 40px; margin-bottom: 12px; }

  /* ─── Footer ─── */
  .footer {
    border-top: 3px double var(--ink);
    padding: 24px 0;
    text-align: center;
    margin-top: 20px;
  }
  .footer p { font-size: 12px; color: var(--warm-gray); line-height: 1.8; }
  .footer a { color: var(--ink); text-decoration: none; font-weight: 500; }
  .footer a:hover { text-decoration: underline; }

  .count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 18px;
    padding: 0 5px;
    border-radius: 100px;
    background: var(--accent-soft);
    color: var(--accent);
    font-size: 11px;
    font-weight: 600;
    margin-left: 6px;
  }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeUp 0.4s ease-out both; }
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.1s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.2s; }

  /* ─── Suggest a Source ─── */
  .suggest-section {
    margin-top: 40px;
    padding-top: 32px;
    border-top: 1px solid var(--rule);
  }
  .suggest-title {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 6px;
  }
  .suggest-desc {
    font-size: 13.5px;
    color: var(--warm-gray);
    font-weight: 300;
    margin-bottom: 16px;
  }
  .suggest-form { max-width: 560px; }
  .suggest-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }
  @media (max-width: 560px) { .suggest-row { flex-direction: column; } }
  .suggest-input, .suggest-textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--rule);
    border-radius: 4px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 13.5px;
    background: transparent;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s;
  }
  .suggest-input:focus, .suggest-textarea:focus { border-color: var(--ink); }
  .suggest-input::placeholder, .suggest-textarea::placeholder { color: var(--warm-gray); opacity: 0.5; }
  .suggest-textarea { resize: vertical; margin-bottom: 12px; min-height: 72px; }
  .suggest-btn {
    padding: 9px 24px;
    background: var(--ink);
    color: var(--paper);
    border: none;
    border-radius: 4px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .suggest-btn:hover { opacity: 0.85; }
  .suggest-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .suggest-note {
    font-size: 11.5px;
    color: var(--warm-gray);
    margin-top: 8px;
    font-weight: 300;
  }

  /* ─── About ─── */
  .about-section {
    padding: 36px 0 48px;
    max-width: 680px;
  }
  .about-heading {
    font-family: 'DM Serif Display', serif;
    font-size: 28px;
    font-weight: 400;
    margin-bottom: 24px;
  }
  .about-content p {
    font-size: 15px;
    line-height: 1.75;
    color: #444;
    margin-bottom: 16px;
    font-weight: 300;
  }
  .about-content a {
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 2px;
    font-weight: 400;
  }
  .about-content a:hover { color: var(--accent); }
  .about-subheading {
    font-family: 'DM Serif Display', serif;
    font-size: 19px;
    font-weight: 400;
    margin-top: 28px;
    margin-bottom: 12px;
    color: var(--ink);
  }
  .about-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 8px;
  }
  .about-link-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    border: 1px solid var(--rule);
    border-radius: 6px;
    text-decoration: none !important;
    color: var(--ink);
    transition: all 0.2s;
  }
  .about-link-card:hover { border-color: var(--ink); background: var(--cream); }
  .about-link-icon { font-size: 22px; flex-shrink: 0; }
  .about-link-card div { display: flex; flex-direction: column; }
  .about-link-card strong { font-size: 14px; font-weight: 600; }
  .about-link-card span { font-size: 12.5px; color: var(--warm-gray); font-weight: 300; }
  .inline-link {
    background: none;
    border: none;
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 2px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 15px;
    font-weight: 400;
    cursor: pointer;
    padding: 0;
  }
  .inline-link:hover { color: var(--accent); }
`;

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getSourceName(id) {
  return SOURCES.find((s) => s.id === id)?.name || id;
}
function getSourceEmoji(id) {
  return SOURCES.find((s) => s.id === id)?.emoji || "📄";
}

export default function App() {
  const [tab, setTab] = useState("articles");
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedSources, setSelectedSources] = useState(new Set());
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const [suggestForm, setSuggestForm] = useState({ name: "", url: "", reason: "" });

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".source-dropdown")) setShowSourceMenu(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const filteredArticles = useMemo(() => {
    const now = new Date();
    return SAMPLE_ARTICLES.filter((a) => {
      if (topic !== "All" && a.topic !== topic) return false;
      if (selectedSources.size > 0 && !selectedSources.has(a.source)) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.summary.toLowerCase().includes(search.toLowerCase())) return false;
      if (dateRange !== "all") {
        const articleDate = new Date(a.date + "T00:00:00");
        const diffDays = (now - articleDate) / (1000 * 60 * 60 * 24);
        if (dateRange === "7d" && diffDays > 7) return false;
        if (dateRange === "30d" && diffDays > 30) return false;
        if (dateRange === "90d" && diffDays > 90) return false;
      }
      return true;
    });
  }, [topic, selectedSources, search, dateRange]);

  const featured = filteredArticles.filter((a) => a.featured);
  const rest = filteredArticles.filter((a) => !a.featured);

  const toggleSource = (id) => {
    setSelectedSources((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* ─── Masthead ─── */}
        <header className="masthead">
          <div className="masthead-date">{today}</div>
          <h1>
            The Data <span className="accent">Journalism</span> Tracker
          </h1>
          <div className="masthead-sub">
            A curated feed of data-driven stories, datasets &amp; methods — for
            students, journalists &amp; curious minds · Built by <a href="https://binchen19.github.io/" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "2px" }}>Bin Chen</a>
          </div>
        </header>

        {/* ─── Nav ─── */}
        <nav className="nav-bar">
          {[
            { key: "articles", label: "Articles" },
            { key: "sources", label: "Sources" },
            { key: "about", label: "About" },
          ].map((t) => (
            <button
              key={t.key}
              className={`nav-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              {t.key === "articles" && <span className="count-badge">{filteredArticles.length}</span>}
            </button>
          ))}
        </nav>

        {/* ─── Articles ─── */}
        {tab === "articles" && (
          <>
            <div className="filter-bar">
              <span className="filter-label">Topic</span>
              {TOPICS.map((t) => (
                <button key={t} className={`filter-pill ${topic === t ? "active" : ""}`} onClick={() => setTopic(t)}>
                  {t}
                </button>
              ))}
              <div className="source-dropdown">
                <button
                  className={`source-dropdown-btn ${selectedSources.size > 0 ? "has-filter" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setShowSourceMenu(!showSourceMenu); }}
                >
                  {selectedSources.size > 0 ? `${selectedSources.size} source${selectedSources.size > 1 ? "s" : ""}` : "All Sources ▾"}
                </button>
                {showSourceMenu && (
                  <div className="source-menu">
                    {SOURCES.map((s) => (
                      <button key={s.id} className="source-option" onClick={() => toggleSource(s.id)}>
                        <span className={`source-check ${selectedSources.has(s.id) ? "checked" : ""}`}>
                          {selectedSources.has(s.id) ? "✓" : ""}
                        </span>
                        <span>{s.emoji}</span>
                        <span>{s.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                className="search-input"
                type="text"
                placeholder="Search articles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-bar" style={{ borderBottom: "1px solid var(--rule)", paddingTop: 12, paddingBottom: 12 }}>
              <span className="filter-label">Date</span>
              {[
                { key: "all", label: "All Time" },
                { key: "7d", label: "Past 7 Days" },
                { key: "30d", label: "Past 30 Days" },
                { key: "90d", label: "Past 90 Days" },
              ].map((d) => (
                <button key={d.key} className={`filter-pill ${dateRange === d.key ? "active" : ""}`} onClick={() => setDateRange(d.key)}>
                  {d.label}
                </button>
              ))}
            </div>

            <div className="feed-status">
              <span className="feed-dot" />
              Live feed · Updated every 30 minutes via RSS
            </div>

            {/* Featured */}
            {featured.length > 0 && topic === "All" && !search && selectedSources.size === 0 && (
              <div className="featured-row">
                {featured.map((a, i) => (
                  <div key={a.id} className={`featured-card fade-in stagger-${i + 1}`}>
                    <div className="featured-badge">★ Featured</div>
                    <h3>{a.title}</h3>
                    <div style={{ marginBottom: 6 }}>
                      <span className="source-tag">{getSourceEmoji(a.source)} {getSourceName(a.source)}</span>
                      <span className="topic-tag">{a.topic}</span>
                    </div>
                    <p>{a.summary}</p>
                    {a.dataset && (
                      <div className="article-dataset" style={{ marginTop: 12 }}>
                        <span className="ds-icon">📦</span>
                        {a.dataset.url ? (
                          <a href={a.dataset.url} target="_blank" rel="noreferrer">{a.dataset.name || "Dataset"}</a>
                        ) : (
                          <span className="ds-desc">{a.dataset.description}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* List */}
            <div className="article-list">
              {(featured.length > 0 && topic === "All" && !search && selectedSources.size === 0 ? rest : filteredArticles).map((a, i) => (
                <div key={a.id} className={`article-item fade-in stagger-${(i % 4) + 1}`}>
                  <div className="article-date">{formatDate(a.date)}</div>
                  <div className="article-main">
                    <h3>{a.title}</h3>
                    <span className="source-tag">{getSourceEmoji(a.source)} {getSourceName(a.source)}</span>
                    <span className="topic-tag">{a.topic}</span>
                    <p>{a.summary}</p>
                    {a.dataset && (
                      <div className="article-dataset">
                        <span className="ds-icon">📦</span>
                        {a.dataset.url ? (
                          <a href={a.dataset.url} target="_blank" rel="noreferrer">{a.dataset.name || "Dataset"}</a>
                        ) : (
                          <span className="ds-desc">{a.dataset.name ? a.dataset.name + " — " : ""}{a.dataset.description}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredArticles.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <p>No articles match your filters.<br />Try adjusting your topic, source, or search query.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── Sources ─── */}
        {tab === "sources" && (
          <div className="sources-section">
            <h2>Tracked Sources</h2>
            <p style={{ fontSize: 14, color: "#8c8578", fontWeight: 300, marginBottom: 20 }}>
              {SOURCES.length} outlets monitored via RSS · Articles fetched every 30 minutes
            </p>
            <div className="sources-grid">
              {SOURCES.map((s, i) => (
                <div key={s.id} className={`source-card fade-in stagger-${(i % 4) + 1}`}>
                  <span className="s-emoji">{s.emoji}</span>
                  <div className="s-info">
                    <div className="s-name">{s.name}</div>
                    <div className="s-region">{s.region}</div>
                  </div>
                  <span className="s-status" title="Feed active" />
                </div>
              ))}
            </div>

            {/* Suggest a Source */}
            <div className="suggest-section">
              <h3 className="suggest-title">Suggest a Source</h3>
              <p className="suggest-desc">
                Know a great data journalism outlet we're missing? Fill in the form below — it will open a GitHub Issue so we can review and discuss your suggestion.
              </p>
              <div className="suggest-form">
                <div className="suggest-row">
                  <input
                    className="suggest-input"
                    type="text"
                    placeholder="Source name (e.g., The Pudding)"
                    value={suggestForm.name}
                    onChange={(e) => setSuggestForm({ ...suggestForm, name: e.target.value })}
                  />
                  <input
                    className="suggest-input"
                    type="url"
                    placeholder="URL (e.g., https://pudding.cool)"
                    value={suggestForm.url}
                    onChange={(e) => setSuggestForm({ ...suggestForm, url: e.target.value })}
                  />
                </div>
                <textarea
                  className="suggest-textarea"
                  placeholder="Why should we add this source? (optional)"
                  value={suggestForm.reason}
                  onChange={(e) => setSuggestForm({ ...suggestForm, reason: e.target.value })}
                  rows={3}
                />
                <button
                  className="suggest-btn"
                  disabled={!suggestForm.name.trim() || !suggestForm.url.trim()}
                  onClick={() => {
                    const title = encodeURIComponent(`Source suggestion: ${suggestForm.name}`);
                    const body = encodeURIComponent(
                      `## Suggested Source\n\n**Name:** ${suggestForm.name}\n**URL:** ${suggestForm.url}\n\n**Reason:**\n${suggestForm.reason || "(not provided)"}\n\n---\n_Submitted via the Data Journalism Tracker_`
                    );
                    window.open(
                      `https://github.com/binchen19/data-journalism-tracker/issues/new?title=${title}&body=${body}&labels=source-suggestion`,
                      "_blank"
                    );
                    setSuggestForm({ name: "", url: "", reason: "" });
                  }}
                >
                  Submit via GitHub →
                </button>
                <p className="suggest-note">Opens a pre-filled GitHub Issue in a new tab. You'll need a free GitHub account.</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── About ─── */}
        {tab === "about" && (
          <div className="about-section fade-in">
            <h2 className="about-heading">About This Project</h2>

            <div className="about-content">
              <p>
                <strong>The Data Journalism Tracker</strong> is built by <a href="https://binchen19.github.io/" target="_blank" rel="noreferrer">Bin Chen</a> as
                a companion resource for the course and textbook <a href="https://binchen19.github.io/djr/" target="_blank" rel="noreferrer"><em>Data Journalism with R</em></a>.
              </p>

              <p>
                It was originally designed to help <strong>students</strong> stay on top of the best data-driven reporting from
                world-class newsrooms — giving them real-world examples, methodological inspiration, and open datasets
                to draw on for their final projects and beyond.
              </p>

              <p>
                But this tracker isn't just for the classroom. It's equally useful for <strong>professional journalists</strong> looking
                for inspiration and technique references, and for <strong>anyone curious about data storytelling</strong> — researchers,
                civic technologists, self-taught learners, or anyone who believes the best journalism shows its work.
              </p>

              <h3 className="about-subheading">What You'll Find Here</h3>
              <p>
                A curated, auto-updating feed of data journalism pieces from {SOURCES.length} leading outlets across the US, UK,
                Asia, and global networks — spanning topics from climate and health to criminal justice and technology.
                Where available, we link directly to the underlying datasets so you can explore, replicate, and learn.
              </p>

              <h3 className="about-subheading">Links & Resources</h3>
              <div className="about-links">
                <a href="https://binchen19.github.io/djr/" target="_blank" rel="noreferrer" className="about-link-card">
                  <span className="about-link-icon">📖</span>
                  <div>
                    <strong>Data Journalism with R</strong>
                    <span>Free online textbook</span>
                  </div>
                </a>
                <a href="https://github.com/binchen19/djr/" target="_blank" rel="noreferrer" className="about-link-card">
                  <span className="about-link-icon">💻</span>
                  <div>
                    <strong>GitHub Repository</strong>
                    <span>Source code for the textbook</span>
                  </div>
                </a>
                <a href="https://binchen19.github.io/" target="_blank" rel="noreferrer" className="about-link-card">
                  <span className="about-link-icon">🌐</span>
                  <div>
                    <strong>Bin Chen</strong>
                    <span>Personal website</span>
                  </div>
                </a>
              </div>

              <h3 className="about-subheading">Contribute</h3>
              <p>
                Missing a great source? Head over to the <button className="inline-link" onClick={() => setTab("sources")}>Sources</button> tab
                and use the <em>Suggest a Source</em> form to recommend outlets we should track. Community input makes this resource better for everyone.
              </p>
            </div>
          </div>
        )}

        {/* ─── Footer ─── */}
        <footer className="footer">
          <p>© 2026 Bin Chen · The Data Journalism Tracker</p>
        </footer>
      </div>
    </>
  );
}
