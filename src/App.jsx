import { useState, useEffect, useMemo, useCallback } from "react";

/*
 * ─── SOURCES ───
 * type: "rss"    → auto-fetched via rss2json API
 * type: "browse" → displayed as "browse directly" cards, no fetching
 */
const SOURCES = [
  { id: "nyt", name: "NYT The Upshot", emoji: "📰", region: "US", url: "https://www.nytimes.com/section/upshot", type: "rss", feed: "https://rss.nytimes.com/services/xml/rss/nyt/Upshot.xml", description: "Data-driven analysis of politics, policy, and everyday life from The New York Times." },
  { id: "owid", name: "Our World in Data", emoji: "🌍", region: "Global", url: "https://ourworldindata.org", type: "rss", feed: "https://ourworldindata.org/atom.xml", description: "Research and interactive visualizations on global issues — poverty, health, climate, and more." },
  { id: "reuters", name: "Reuters Data", emoji: "🌐", region: "Global", url: "https://www.reuters.com/data/", type: "browse", description: "Reuters' data-driven investigations and interactive graphics on global affairs." },
  { id: "ft", name: "FT Visual & Data Journalism", emoji: "🟧", region: "UK", url: "https://www.ft.com/visual-and-data-journalism", type: "browse", description: "The Financial Times' visual storytelling team — charts, maps, and data-driven features." },
  { id: "caixin", name: "Caixin 財新·數字說", emoji: "🟡", region: "Asia", url: "https://datanews.caixin.com/", type: "browse", description: "Caixin's data journalism team covering China's economy, society, and global trends." },
  { id: "nbc", name: "NBC Data Points", emoji: "🔵", region: "US", url: "https://www.nbcnews.com/datagraphics", type: "browse", description: "NBC News' data and graphics team — visualizations and analysis on U.S. politics, economy, and society." },
];

const RSS_SOURCES = SOURCES.filter(s => s.type === "rss");
const BROWSE_SOURCES = SOURCES.filter(s => s.type === "browse");

const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

function stripHtml(html) {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function truncate(str, max = 200) {
  if (!str) return "";
  const clean = stripHtml(str).trim();
  return clean.length > max ? clean.slice(0, max).trim() + "…" : clean;
}

async function fetchRSS(source) {
  const res = await fetch(`${RSS2JSON}${encodeURIComponent(source.feed)}`);
  const data = await res.json();
  if (data.status !== "ok" || !data.items) return [];
  return data.items.slice(0, 15).map((item, idx) => ({
    id: `${source.id}-${idx}-${Date.now()}`,
    title: stripHtml(item.title),
    source: source.id,
    date: item.pubDate ? item.pubDate.split(" ")[0] : new Date().toISOString().split("T")[0],
    url: item.link || null,
    summary: truncate(item.description || item.content, 220),
  }));
}

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

  body { font-family: 'IBM Plex Sans', sans-serif; background: var(--paper); color: var(--ink); line-height: 1.6; -webkit-font-smoothing: antialiased; }
  .app { max-width: 1120px; margin: 0 auto; padding: 0 24px; }

  .masthead { text-align: center; padding: 48px 0 24px; border-bottom: 3px double var(--ink); }
  .masthead-date { font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--warm-gray); margin-bottom: 12px; }
  .masthead h1 { font-family: 'DM Serif Display', serif; font-size: clamp(32px, 6vw, 56px); font-weight: 400; line-height: 1.1; letter-spacing: -0.5px; }
  .masthead h1 .accent { color: var(--accent); }
  .masthead-sub { font-size: 14px; color: var(--warm-gray); margin-top: 10px; font-weight: 300; letter-spacing: 0.3px; }

  .nav-bar { display: flex; gap: 0; border-bottom: 1px solid var(--rule); overflow-x: auto; scrollbar-width: none; }
  .nav-bar::-webkit-scrollbar { display: none; }
  .nav-tab { padding: 14px 20px; font-size: 13px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; color: var(--warm-gray); cursor: pointer; border: none; background: none; white-space: nowrap; position: relative; transition: color 0.2s; font-family: 'IBM Plex Sans', sans-serif; }
  .nav-tab:hover { color: var(--ink); }
  .nav-tab.active { color: var(--ink); }
  .nav-tab.active::after { content: ''; position: absolute; bottom: -1px; left: 16px; right: 16px; height: 2px; background: var(--accent); }

  .filter-bar { display: flex; gap: 8px; padding: 16px 0; flex-wrap: wrap; align-items: center; border-bottom: 1px solid var(--rule); }
  .filter-label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--warm-gray); margin-right: 4px; }
  .filter-pill { padding: 5px 14px; border-radius: 100px; border: 1px solid var(--rule); background: transparent; font-size: 12.5px; font-family: 'IBM Plex Sans', sans-serif; color: var(--warm-gray); cursor: pointer; transition: all 0.2s; }
  .filter-pill:hover { border-color: var(--ink); color: var(--ink); }
  .filter-pill.active { background: var(--ink); border-color: var(--ink); color: var(--paper); }
  .search-input { margin-left: auto; padding: 6px 14px; border: 1px solid var(--rule); border-radius: 100px; font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; background: transparent; color: var(--ink); width: 200px; transition: border-color 0.2s; outline: none; }
  .search-input::placeholder { color: var(--warm-gray); opacity: 0.6; }
  .search-input:focus { border-color: var(--ink); }

  .source-pill { font-size: 11.5px; padding: 4px 10px; }
  .source-pill-emoji { font-size: 12px; margin-right: 1px; }

  /* ─── Browse cards ─── */
  .browse-section { padding: 28px 0; border-bottom: 1px solid var(--rule); }
  .browse-section-title { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--warm-gray); margin-bottom: 14px; }
  .browse-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; }
  .browse-card { display: block; padding: 16px 18px; border: 1px solid var(--rule); border-radius: 6px; text-decoration: none; color: var(--ink); transition: all 0.25s; }
  .browse-card:hover { border-color: var(--ink); background: var(--cream); transform: translateY(-1px); box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
  .browse-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .browse-card-emoji { font-size: 18px; }
  .browse-card-name { font-size: 14px; font-weight: 500; }
  .browse-card-region { font-size: 10px; color: var(--warm-gray); text-transform: uppercase; letter-spacing: 1px; margin-left: auto; }
  .browse-card p { font-size: 12.5px; color: #777; line-height: 1.5; font-weight: 300; }
  .browse-card-cta { display: inline-block; margin-top: 8px; font-size: 11.5px; color: var(--blue); font-weight: 500; }
  .browse-card-cta::after { content: ' ↗'; }

  /* ─── Article list ─── */
  .article-list { padding: 8px 0 40px; }
  .article-item { display: grid; grid-template-columns: 80px 1fr; gap: 16px; padding: 20px 0; border-bottom: 1px solid var(--rule); align-items: start; }
  @media (max-width: 640px) { .article-item { grid-template-columns: 1fr; gap: 4px; } .article-date { order: -1; } }
  .article-date { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--warm-gray); padding-top: 3px; }
  .article-main h3 { font-family: 'DM Serif Display', serif; font-size: 18px; font-weight: 400; line-height: 1.35; margin-bottom: 4px; }
  .article-main h3 a { color: inherit; text-decoration: none; }
  .article-main h3 a:hover { color: var(--accent); }
  .source-tag { display: inline-block; font-size: 11px; font-weight: 500; color: var(--warm-gray); margin-right: 8px; }
  .article-main p { font-size: 13.5px; color: #666; margin-top: 6px; line-height: 1.55; font-weight: 300; }
  .read-link { display: inline-block; margin-top: 8px; font-size: 12.5px; color: var(--blue); text-decoration: none; font-weight: 500; }
  .read-link:hover { text-decoration: underline; }
  .read-link::after { content: ' ↗'; font-size: 0.9em; }

  /* ─── Sources tab ─── */
  .sources-section { padding: 32px 0 48px; }
  .sources-section h2 { font-family: 'DM Serif Display', serif; font-size: 24px; font-weight: 400; margin-bottom: 20px; }
  .sources-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
  .source-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 1px solid var(--rule); border-radius: 4px; transition: all 0.2s; cursor: pointer; text-decoration: none; color: var(--ink); }
  .source-card:hover { border-color: var(--ink); background: var(--cream); }
  .s-emoji { font-size: 20px; }
  .s-info { flex: 1; }
  .s-name { font-size: 14px; font-weight: 500; }
  .s-region { font-size: 11px; color: var(--warm-gray); text-transform: uppercase; letter-spacing: 1px; }
  .s-method { font-size: 10px; font-weight: 500; letter-spacing: 0.5px; }
  .s-method.rss { color: var(--green); }
  .s-method.browse { color: var(--blue); }
  .s-status { width: 8px; height: 8px; border-radius: 50%; opacity: 0.7; }
  .s-status.rss { background: var(--green); }
  .s-status.browse { background: var(--blue); }

  .feed-status { display: flex; align-items: center; gap: 8px; padding: 16px 0 8px; font-size: 12px; color: var(--warm-gray); }
  .feed-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; }
  .feed-dot.loading { background: var(--accent); }
  @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

  .empty-state { text-align: center; padding: 60px 20px; color: var(--warm-gray); }
  .empty-state .empty-icon { font-size: 40px; margin-bottom: 12px; }

  .footer { border-top: 3px double var(--ink); padding: 24px 0; text-align: center; margin-top: 20px; }
  .footer p { font-size: 12px; color: var(--warm-gray); line-height: 1.8; }

  .count-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 18px; padding: 0 5px; border-radius: 100px; background: var(--accent-soft); color: var(--accent); font-size: 11px; font-weight: 600; margin-left: 6px; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeUp 0.4s ease-out both; }
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.1s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.2s; }

  .skeleton-row { display: grid; grid-template-columns: 80px 1fr; gap: 16px; padding: 20px 0; border-bottom: 1px solid var(--rule); }
  .skeleton-bar { background: linear-gradient(90deg, var(--cream) 25%, var(--rule) 50%, var(--cream) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
  .skeleton-date { width: 60px; height: 14px; }
  .skeleton-title { width: 80%; height: 20px; margin-bottom: 8px; }
  .skeleton-text { width: 100%; height: 14px; margin-bottom: 6px; }
  .skeleton-text.short { width: 60%; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .suggest-section { margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--rule); }
  .suggest-title { font-family: 'DM Serif Display', serif; font-size: 20px; font-weight: 400; margin-bottom: 6px; }
  .suggest-desc { font-size: 13.5px; color: var(--warm-gray); font-weight: 300; margin-bottom: 16px; }
  .suggest-form { max-width: 560px; }
  .suggest-row { display: flex; gap: 12px; margin-bottom: 12px; }
  @media (max-width: 560px) { .suggest-row { flex-direction: column; } }
  .suggest-input, .suggest-textarea { width: 100%; padding: 10px 14px; border: 1px solid var(--rule); border-radius: 4px; font-family: 'IBM Plex Sans', sans-serif; font-size: 13.5px; background: transparent; color: var(--ink); outline: none; transition: border-color 0.2s; }
  .suggest-input:focus, .suggest-textarea:focus { border-color: var(--ink); }
  .suggest-input::placeholder, .suggest-textarea::placeholder { color: var(--warm-gray); opacity: 0.5; }
  .suggest-textarea { resize: vertical; margin-bottom: 12px; min-height: 72px; }
  .suggest-btn { padding: 9px 24px; background: var(--ink); color: var(--paper); border: none; border-radius: 4px; font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: opacity 0.2s; }
  .suggest-btn:hover { opacity: 0.85; }
  .suggest-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .suggest-note { font-size: 11.5px; color: var(--warm-gray); margin-top: 8px; font-weight: 300; }

  .about-section { padding: 36px 0 48px; max-width: 680px; }
  .about-heading { font-family: 'DM Serif Display', serif; font-size: 28px; font-weight: 400; margin-bottom: 24px; }
  .about-content p { font-size: 15px; line-height: 1.75; color: #444; margin-bottom: 16px; font-weight: 300; }
  .about-content a { color: var(--ink); text-decoration: underline; text-underline-offset: 2px; font-weight: 400; }
  .about-content a:hover { color: var(--accent); }
  .about-subheading { font-family: 'DM Serif Display', serif; font-size: 19px; font-weight: 400; margin-top: 28px; margin-bottom: 12px; color: var(--ink); }
  .about-links { display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px; }
  .about-link-card { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border: 1px solid var(--rule); border-radius: 6px; text-decoration: none !important; color: var(--ink); transition: all 0.2s; }
  .about-link-card:hover { border-color: var(--ink); background: var(--cream); }
  .about-link-icon { font-size: 22px; flex-shrink: 0; }
  .about-link-card div { display: flex; flex-direction: column; }
  .about-link-card strong { font-size: 14px; font-weight: 600; }
  .about-link-card span { font-size: 12.5px; color: var(--warm-gray); font-weight: 300; }
  .inline-link { background: none; border: none; color: var(--ink); text-decoration: underline; text-underline-offset: 2px; font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; font-weight: 400; cursor: pointer; padding: 0; }
  .inline-link:hover { color: var(--accent); }
`;

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getSource(id) {
  return SOURCES.find((s) => s.id === id);
}

function SkeletonLoader() {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="skeleton-row">
      <div><div className="skeleton-bar skeleton-date" /></div>
      <div>
        <div className="skeleton-bar skeleton-title" />
        <div className="skeleton-bar skeleton-text" />
        <div className="skeleton-bar skeleton-text short" />
      </div>
    </div>
  ));
}

export default function App() {
  const [tab, setTab] = useState("articles");
  const [search, setSearch] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [suggestForm, setSuggestForm] = useState({ name: "", url: "", reason: "" });
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = useCallback(async () => {
    setLoading(true);
    const allArticles = [];

    const promises = RSS_SOURCES.map(async (source) => {
      try {
        const items = await fetchRSS(source);
        allArticles.push(...items);
      } catch (err) {
        console.warn(`Failed: ${source.name}`, err.message);
      }
    });

    await Promise.allSettled(promises);
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    setArticles(allArticles);
    setLoading(false);
  }, []);

  useEffect(() => { fetchFeeds(); }, [fetchFeeds]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      if (selectedSource !== "all" && a.source !== selectedSource) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !(a.summary || "").toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [articles, selectedSource, search]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="masthead">
          <div className="masthead-date">{today}</div>
          <h1>The <span className="accent">Data</span> Journalism Tracker</h1>
          <div className="masthead-sub">
            A curated feed of data-driven stories &amp; datasets — for students, journalists &amp; curious minds.
          </div>
        </header>

        <nav className="nav-bar">
          {[
            { key: "articles", label: "Articles" },
            { key: "sources", label: "Sources" },
            { key: "about", label: "About" },
          ].map((t) => (
            <button key={t.key} className={`nav-tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
              {t.label}
              {t.key === "articles" && !loading && <span className="count-badge">{filteredArticles.length}</span>}
            </button>
          ))}
        </nav>

        {/* ─── Articles ─── */}
        {tab === "articles" && (
          <>
            {/* Source filter */}
            <div className="filter-bar" style={{ paddingTop: 14, paddingBottom: 14 }}>
              <span className="filter-label">Feed</span>
              <button className={`filter-pill ${selectedSource === "all" ? "active" : ""}`} onClick={() => setSelectedSource("all")}>All</button>
              {RSS_SOURCES.map((s) => (
                <button key={s.id} className={`filter-pill source-pill ${selectedSource === s.id ? "active" : ""}`} onClick={() => setSelectedSource(s.id)}>
                  <span className="source-pill-emoji">{s.emoji}</span> {s.name}
                </button>
              ))}
              <input className="search-input" type="text" placeholder="Search articles…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="feed-status">
              <span className={`feed-dot ${loading ? "loading" : ""}`} />
              {loading
                ? "Fetching RSS feeds…"
                : `${articles.length} articles from ${RSS_SOURCES.length} RSS feeds`
              }
              {!loading && (
                <button className="filter-pill" onClick={fetchFeeds} style={{ marginLeft: 8, padding: "2px 10px", fontSize: 11 }}>↻ Refresh</button>
              )}
            </div>

            {loading && <SkeletonLoader />}

            {!loading && (
              <div className="article-list">
                {filteredArticles.map((a, i) => {
                  const src = getSource(a.source);
                  return (
                    <div key={a.id} className={`article-item fade-in stagger-${(i % 4) + 1}`}>
                      <div className="article-date">{formatDate(a.date)}</div>
                      <div className="article-main">
                        <h3>
                          {a.url ? (
                            <a href={a.url} target="_blank" rel="noreferrer">{a.title}</a>
                          ) : a.title}
                        </h3>
                        <span className="source-tag">{src?.emoji} {src?.name}</span>
                        {a.summary && <p>{a.summary}</p>}
                        {a.url && (
                          <a className="read-link" href={a.url} target="_blank" rel="noreferrer">Read original</a>
                        )}
                      </div>
                    </div>
                  );
                })}
                {filteredArticles.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <p>No articles match your filters.<br />Try adjusting your source or search query.</p>
                  </div>
                )}
              </div>
            )}

            {/* Browse directly section */}
            <div className="browse-section">
              <div className="browse-section-title">Browse Directly</div>
              <div className="browse-grid">
                {BROWSE_SOURCES.map((s, i) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className={`browse-card fade-in stagger-${(i % 4) + 1}`}>
                    <div className="browse-card-header">
                      <span className="browse-card-emoji">{s.emoji}</span>
                      <span className="browse-card-name">{s.name}</span>
                      <span className="browse-card-region">{s.region}</span>
                    </div>
                    <p>{s.description}</p>
                    <span className="browse-card-cta">Visit site</span>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── Sources ─── */}
        {tab === "sources" && (
          <div className="sources-section">
            <h2>Tracked Sources</h2>
            <p style={{ fontSize: 14, color: "#8c8578", fontWeight: 300, marginBottom: 20 }}>
              {SOURCES.length} data journalism outlets — {RSS_SOURCES.length} via RSS, {BROWSE_SOURCES.length} browse directly
            </p>
            <div className="sources-grid">
              {SOURCES.map((s, i) => (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className={`source-card fade-in stagger-${(i % 4) + 1}`}>
                  <span className="s-emoji">{s.emoji}</span>
                  <div className="s-info">
                    <div className="s-name">{s.name}</div>
                    <div className="s-region">{s.region}</div>
                    <div className={`s-method ${s.type}`}>{s.type === "rss" ? "RSS feed" : "Browse directly"}</div>
                  </div>
                  <span className={`s-status ${s.type}`} />
                </a>
              ))}
            </div>

            <div className="suggest-section">
              <h3 className="suggest-title">Suggest a Source</h3>
              <p className="suggest-desc">
                Know a great data journalism outlet we're missing? Fill in the form below — it will open a GitHub Issue so we can review your suggestion.
              </p>
              <div className="suggest-form">
                <div className="suggest-row">
                  <input className="suggest-input" type="text" placeholder="Source name (e.g., The Pudding)" value={suggestForm.name} onChange={(e) => setSuggestForm({ ...suggestForm, name: e.target.value })} />
                  <input className="suggest-input" type="url" placeholder="URL (e.g., https://pudding.cool)" value={suggestForm.url} onChange={(e) => setSuggestForm({ ...suggestForm, url: e.target.value })} />
                </div>
                <textarea className="suggest-textarea" placeholder="Why should we add this source? (optional)" value={suggestForm.reason} onChange={(e) => setSuggestForm({ ...suggestForm, reason: e.target.value })} rows={3} />
                <button
                  className="suggest-btn"
                  disabled={!suggestForm.name.trim() || !suggestForm.url.trim()}
                  onClick={() => {
                    const title = encodeURIComponent(`Source suggestion: ${suggestForm.name}`);
                    const body = encodeURIComponent(`## Suggested Source\n\n**Name:** ${suggestForm.name}\n**URL:** ${suggestForm.url}\n\n**Reason:**\n${suggestForm.reason || "(not provided)"}\n\n---\n_Submitted via the Data Journalism Tracker_`);
                    window.open(`https://github.com/binchen19/data-journalism-tracker/issues/new?title=${title}&body=${body}&labels=source-suggestion`, "_blank");
                    setSuggestForm({ name: "", url: "", reason: "" });
                  }}
                >Submit via GitHub →</button>
                <p className="suggest-note">Opens a pre-filled GitHub Issue in a new tab. Requires a GitHub account.</p>
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
                Articles from {RSS_SOURCES.length} sources are fetched live via RSS feeds. Another {BROWSE_SOURCES.length} leading
                outlets are featured as "browse directly" links — these don't offer data-journalism-specific RSS feeds,
                so we link you straight to their data sections instead of pulling in irrelevant general news.
              </p>

              <h3 className="about-subheading">Links &amp; Resources</h3>
              <div className="about-links">
                <a href="https://binchen19.github.io/djr/" target="_blank" rel="noreferrer" className="about-link-card">
                  <span className="about-link-icon">📖</span>
                  <div><strong>Data Journalism with R</strong><span>Free online textbook</span></div>
                </a>
                <a href="https://github.com/binchen19/djr/" target="_blank" rel="noreferrer" className="about-link-card">
                  <span className="about-link-icon">💻</span>
                  <div><strong>GitHub Repository</strong><span>Source code for the textbook</span></div>
                </a>
                <a href="https://binchen19.github.io/" target="_blank" rel="noreferrer" className="about-link-card">
                  <span className="about-link-icon">🌐</span>
                  <div><strong>Bin Chen</strong><span>Personal website</span></div>
                </a>
              </div>

              <h3 className="about-subheading">Contribute</h3>
              <p>
                Missing a great source? Head over to the <button className="inline-link" onClick={() => setTab("sources")}>Sources</button> tab
                and use the <em>Suggest a Source</em> form to recommend outlets we should track.
              </p>
            </div>
          </div>
        )}

        <footer className="footer">
          <p>© 2026 Bin Chen · The Data Journalism Tracker</p>
        </footer>
      </div>
    </>
  );
}