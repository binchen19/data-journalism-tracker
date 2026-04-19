import { useState, useEffect, useMemo, useCallback } from "react";

/*
 * ─── SOURCES ───
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

/* ─── Apple-Inspired Styles ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&family=SF+Pro+Text:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #f5f5f7;
    --surface: #ffffff;
    --surface-secondary: #fbfbfd;
    --text-primary: #1d1d1f;
    --text-secondary: #6e6e73;
    --text-tertiary: #86868b;
    --border: rgba(0, 0, 0, 0.06);
    --border-strong: rgba(0, 0, 0, 0.1);
    --accent: #0071e3;
    --accent-hover: #0077ed;
    --accent-soft: rgba(0, 113, 227, 0.08);
    --red: #ff3b30;
    --green: #34c759;
    --orange: #ff9500;
    --purple: #af52de;
    --radius-sm: 10px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --radius-xl: 24px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
    --shadow-xl: 0 16px 48px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.05);
    --blur: saturate(180%) blur(20px);
    --font-display: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
    --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
    --font-serif: 'Source Serif 4', Georgia, serif;
  }

  body {
    font-family: var(--font-body);
    background: var(--bg);
    color: var(--text-primary);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .app {
    max-width: 980px;
    margin: 0 auto;
    padding: 0 20px;
    min-height: 100vh;
  }

  /* ─── Hero / Masthead ─── */
  .masthead {
    text-align: center;
    padding: 64px 0 40px;
  }
  .masthead-eyebrow {
    font-size: 13px;
    font-weight: 600;
    color: var(--accent);
    letter-spacing: 0.02em;
    margin-bottom: 12px;
    text-transform: uppercase;
  }
  .masthead h1 {
    font-family: var(--font-display);
    font-size: clamp(36px, 7vw, 56px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    margin-bottom: 12px;
  }
  .masthead h1 .gradient-text {
    background: linear-gradient(135deg, #0071e3, #6e3adb, #e3478c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .masthead-sub {
    font-size: 17px;
    color: var(--text-secondary);
    font-weight: 400;
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.5;
  }

  /* ─── Navigation ─── */
  .nav-wrapper {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 8px 0;
    margin-bottom: 8px;
  }
  .nav-bar {
    display: flex;
    gap: 4px;
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: var(--blur);
    -webkit-backdrop-filter: var(--blur);
    border-radius: 12px;
    padding: 4px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    width: fit-content;
    margin: 0 auto;
  }
  .nav-tab {
    padding: 8px 20px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    border: none;
    background: none;
    border-radius: 8px;
    white-space: nowrap;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: var(--font-body);
    position: relative;
  }
  .nav-tab:hover {
    color: var(--text-primary);
    background: rgba(0, 0, 0, 0.03);
  }
  .nav-tab.active {
    color: var(--text-primary);
    background: var(--surface);
    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0.5px 1px rgba(0,0,0,0.04);
    font-weight: 600;
  }
  .count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 18px;
    padding: 0 6px;
    border-radius: 100px;
    background: var(--accent);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    margin-left: 6px;
  }

  /* ─── Search & Filters ─── */
  .toolbar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 0;
  }
  .search-row {
    position: relative;
  }
  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    font-size: 15px;
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    padding: 10px 16px 10px 38px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 15px;
    background: var(--surface);
    color: var(--text-primary);
    outline: none;
    transition: all 0.2s;
    box-shadow: var(--shadow-sm);
  }
  .search-input::placeholder { color: var(--text-tertiary); }
  .search-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft), var(--shadow-sm);
  }

  .filter-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    align-items: center;
  }
  .filter-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-right: 4px;
  }
  .chip {
    padding: 6px 14px;
    border-radius: 100px;
    border: 1px solid var(--border-strong);
    background: var(--surface);
    font-size: 13px;
    font-family: var(--font-body);
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .chip:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-soft);
  }
  .chip.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }
  .chip .chip-emoji { font-size: 13px; }

  .feed-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0 12px;
    font-size: 13px;
    color: var(--text-tertiary);
    font-weight: 400;
  }
  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--green);
    position: relative;
  }
  .status-dot::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: var(--green);
    opacity: 0.2;
    animation: statusPulse 2s ease-in-out infinite;
  }
  .status-dot.loading { background: var(--orange); }
  .status-dot.loading::after { background: var(--orange); }
  @keyframes statusPulse { 0%, 100% { transform: scale(1); opacity: 0.2; } 50% { transform: scale(1.5); opacity: 0; } }

  .refresh-btn {
    padding: 4px 12px;
    border-radius: 100px;
    border: 1px solid var(--border-strong);
    background: var(--surface);
    font-size: 12px;
    font-family: var(--font-body);
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
    margin-left: 4px;
  }
  .refresh-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* ─── Browse Grid ─── */
  .browse-section {
    padding-bottom: 16px;
  }
  .section-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 10px;
  }
  .browse-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
  }
  .browse-card {
    display: flex;
    flex-direction: column;
    padding: 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: var(--text-primary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
  }
  .browse-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: transparent;
  }
  .browse-card-top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .browse-card-icon {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .browse-card-name {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
  }
  .browse-card-region {
    font-size: 11px;
    color: var(--text-tertiary);
    font-weight: 500;
  }
  .browse-card p {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.45;
    font-weight: 400;
    flex: 1;
  }
  .browse-card-arrow {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 10px;
    font-size: 13px;
    color: var(--accent);
    font-weight: 500;
  }

  /* ─── Article Cards ─── */
  .article-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 40px;
  }
  .article-card {
    display: flex;
    gap: 16px;
    padding: 18px 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
    align-items: flex-start;
  }
  .article-card:hover {
    box-shadow: var(--shadow-md);
    border-color: transparent;
  }
  .article-date-col {
    flex-shrink: 0;
    width: 52px;
    text-align: center;
    padding-top: 2px;
  }
  .article-date-month {
    font-size: 11px;
    font-weight: 600;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 1;
  }
  .article-date-day {
    font-size: 26px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }
  .article-content { flex: 1; min-width: 0; }
  .article-content h3 {
    font-family: var(--font-serif);
    font-size: 18px;
    font-weight: 600;
    line-height: 1.35;
    margin-bottom: 5px;
    letter-spacing: -0.01em;
  }
  .article-content h3 a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s;
  }
  .article-content h3 a:hover { color: var(--accent); }
  .article-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .source-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: var(--bg);
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
  }
  .article-content p {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.55;
    font-weight: 400;
  }
  .read-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    font-size: 13px;
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
    transition: gap 0.2s;
  }
  .read-link:hover { gap: 6px; }
  .read-link-arrow {
    font-size: 12px;
    transition: transform 0.2s;
  }
  .read-link:hover .read-link-arrow { transform: translateX(2px); }

  @media (max-width: 640px) {
    .article-card { flex-direction: column; gap: 8px; }
    .article-date-col { display: flex; gap: 6px; align-items: baseline; width: auto; text-align: left; }
    .article-date-day { font-size: 16px; }
  }

  /* ─── Sources Tab ─── */
  .sources-section { padding: 24px 0 48px; }
  .sources-header {
    margin-bottom: 24px;
  }
  .sources-header h2 {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }
  .sources-header p {
    font-size: 15px;
    color: var(--text-secondary);
    font-weight: 400;
  }
  .sources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }
  .source-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    text-decoration: none;
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }
  .source-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: transparent;
  }
  .source-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm);
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .source-info { flex: 1; }
  .source-name { font-size: 15px; font-weight: 600; }
  .source-region { font-size: 12px; color: var(--text-tertiary); font-weight: 500; }
  .source-type {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    padding: 3px 8px;
    border-radius: 6px;
  }
  .source-type.rss { color: #1a7d37; background: rgba(52,199,89,0.12); }
  .source-type.browse { color: #0060c7; background: rgba(0,113,227,0.08); }

  /* ─── Suggest Section ─── */
  .suggest-section {
    margin-top: 40px;
    padding: 32px;
    background: var(--surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  .suggest-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-bottom: 4px;
  }
  .suggest-desc {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 20px;
    font-weight: 400;
  }
  .suggest-form { max-width: 560px; }
  .suggest-row { display: flex; gap: 10px; margin-bottom: 10px; }
  @media (max-width: 560px) { .suggest-row { flex-direction: column; } }
  .suggest-input, .suggest-textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 14px;
    background: var(--surface-secondary);
    color: var(--text-primary);
    outline: none;
    transition: all 0.2s;
  }
  .suggest-input:focus, .suggest-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
    background: var(--surface);
  }
  .suggest-input::placeholder, .suggest-textarea::placeholder { color: var(--text-tertiary); }
  .suggest-textarea { resize: vertical; margin-bottom: 12px; min-height: 72px; }
  .suggest-btn {
    padding: 10px 24px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 100px;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .suggest-btn:hover { background: var(--accent-hover); transform: scale(1.02); }
  .suggest-btn:active { transform: scale(0.98); }
  .suggest-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .suggest-note { font-size: 12px; color: var(--text-tertiary); margin-top: 10px; }

  /* ─── About ─── */
  .about-section { padding: 32px 0 48px; max-width: 680px; }
  .about-heading {
    font-family: var(--font-display);
    font-size: 34px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 24px;
  }
  .about-content p {
    font-size: 16px;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 16px;
    font-weight: 400;
  }
  .about-content a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
  }
  .about-content a:hover { text-decoration: underline; }
  .about-subheading {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-top: 32px;
    margin-bottom: 14px;
    color: var(--text-primary);
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
    padding: 16px 18px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    text-decoration: none !important;
    color: var(--text-primary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
  }
  .about-link-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: transparent;
  }
  .about-link-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm);
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .about-link-card div { display: flex; flex-direction: column; }
  .about-link-card strong { font-size: 15px; font-weight: 600; }
  .about-link-card span { font-size: 13px; color: var(--text-secondary); font-weight: 400; }
  .inline-link {
    background: none;
    border: none;
    color: var(--accent);
    font-family: var(--font-body);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    text-decoration: none;
  }
  .inline-link:hover { text-decoration: underline; }

  /* ─── Skeleton ─── */
  .skeleton-card {
    display: flex;
    gap: 16px;
    padding: 18px 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
  }
  .skeleton-bar {
    background: linear-gradient(90deg, var(--bg) 25%, rgba(0,0,0,0.04) 50%, var(--bg) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.8s ease-in-out infinite;
    border-radius: 6px;
  }
  .skeleton-date-block { width: 52px; flex-shrink: 0; }
  .skeleton-date-m { width: 32px; height: 10px; margin-bottom: 4px; }
  .skeleton-date-d { width: 36px; height: 24px; }
  .skeleton-body { flex: 1; }
  .skeleton-title { width: 80%; height: 20px; margin-bottom: 10px; }
  .skeleton-text { width: 100%; height: 14px; margin-bottom: 6px; }
  .skeleton-text.short { width: 55%; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* ─── Empty State ─── */
  .empty-state {
    text-align: center;
    padding: 64px 20px;
    color: var(--text-tertiary);
  }
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    filter: grayscale(0.3);
  }
  .empty-state p {
    font-size: 15px;
    line-height: 1.6;
  }

  /* ─── Footer ─── */
  .footer {
    padding: 24px 0;
    text-align: center;
    margin-top: 20px;
  }
  .footer p {
    font-size: 12px;
    color: var(--text-tertiary);
    font-weight: 400;
  }

  /* ─── Animations ─── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in { animation: fadeUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both; }
  .stagger-1 { animation-delay: 0.04s; }
  .stagger-2 { animation-delay: 0.08s; }
  .stagger-3 { animation-delay: 0.12s; }
  .stagger-4 { animation-delay: 0.16s; }
  .stagger-5 { animation-delay: 0.2s; }
`;

function formatDateParts(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return { month: "", day: "" };
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }),
    day: d.getDate(),
  };
}

function getSource(id) {
  return SOURCES.find((s) => s.id === id);
}

function SkeletonLoader() {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className={`skeleton-card fade-in stagger-${(i % 5) + 1}`}>
      <div className="skeleton-date-block">
        <div className="skeleton-bar skeleton-date-m" />
        <div className="skeleton-bar skeleton-date-d" />
      </div>
      <div className="skeleton-body">
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
        {/* ─── Masthead ─── */}
        <header className="masthead">
          <div className="masthead-eyebrow">{today}</div>
          <h1>The <span className="gradient-text">Data</span> Journalism Tracker</h1>
          <div className="masthead-sub">
            A curated feed of data-driven stories & datasets — for students, journalists & curious minds.
          </div>
        </header>

        {/* ─── Navigation ─── */}
        <div className="nav-wrapper">
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
        </div>

        {/* ─── Articles Tab ─── */}
        {tab === "articles" && (
          <>
            <div className="toolbar">
              {/* Search */}
              <div className="search-row">
                <span className="search-icon">⌕</span>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search articles…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Source filters */}
              <div className="filter-row">
                <span className="filter-label">Feed</span>
                <button className={`chip ${selectedSource === "all" ? "active" : ""}`} onClick={() => setSelectedSource("all")}>All</button>
                {RSS_SOURCES.map((s) => (
                  <button key={s.id} className={`chip ${selectedSource === s.id ? "active" : ""}`} onClick={() => setSelectedSource(s.id)}>
                    <span className="chip-emoji">{s.emoji}</span> {s.name}
                  </button>
                ))}
              </div>

              {/* Browse directly */}
              <div className="filter-row">
                <span className="filter-label">Browse</span>
                {BROWSE_SOURCES.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="chip">
                    <span className="chip-emoji">{s.emoji}</span> {s.name} ↗
                  </a>
                ))}
              </div>
            </div>

            <div className="feed-status">
              <span className={`status-dot ${loading ? "loading" : ""}`} />
              {loading
                ? "Fetching RSS feeds…"
                : `${articles.length} articles from ${RSS_SOURCES.length} RSS feeds`}
              {!loading && (
                <button className="refresh-btn" onClick={fetchFeeds}>↻ Refresh</button>
              )}
            </div>

            {loading && (
              <div className="article-list">
                <SkeletonLoader />
              </div>
            )}

            {!loading && (
              <div className="article-list">
                {filteredArticles.map((a, i) => {
                  const src = getSource(a.source);
                  const { month, day } = formatDateParts(a.date);
                  return (
                    <div key={a.id} className={`article-card fade-in stagger-${(i % 5) + 1}`}>
                      <div className="article-date-col">
                        <div className="article-date-month">{month}</div>
                        <div className="article-date-day">{day}</div>
                      </div>
                      <div className="article-content">
                        <div className="article-meta">
                          <span className="source-badge">{src?.emoji} {src?.name}</span>
                        </div>
                        <h3>
                          {a.url ? (
                            <a href={a.url} target="_blank" rel="noreferrer">{a.title}</a>
                          ) : a.title}
                        </h3>
                        {a.summary && <p>{a.summary}</p>}
                        {a.url && (
                          <a className="read-link" href={a.url} target="_blank" rel="noreferrer">
                            Read article <span className="read-link-arrow">→</span>
                          </a>
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
          </>
        )}

        {/* ─── Sources Tab ─── */}
        {tab === "sources" && (
          <div className="sources-section fade-in">
            <div className="sources-header">
              <h2>Tracked Sources</h2>
              <p>{SOURCES.length} data journalism outlets — {RSS_SOURCES.length} via RSS, {BROWSE_SOURCES.length} browse directly</p>
            </div>
            <div className="sources-grid">
              {SOURCES.map((s, i) => (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className={`source-card fade-in stagger-${(i % 5) + 1}`}>
                  <div className="source-icon">{s.emoji}</div>
                  <div className="source-info">
                    <div className="source-name">{s.name}</div>
                    <div className="source-region">{s.region}</div>
                  </div>
                  <span className={`source-type ${s.type}`}>{s.type === "rss" ? "RSS" : "Browse"}</span>
                </a>
              ))}
            </div>

            <div className="suggest-section">
              <h3 className="suggest-title">Suggest a Source</h3>
              <p className="suggest-desc">
                Know a great data journalism outlet we're missing? Submit your suggestion via GitHub.
              </p>
              <div className="suggest-form">
                <div className="suggest-row">
                  <input className="suggest-input" type="text" placeholder="Source name" value={suggestForm.name} onChange={(e) => setSuggestForm({ ...suggestForm, name: e.target.value })} />
                  <input className="suggest-input" type="url" placeholder="URL" value={suggestForm.url} onChange={(e) => setSuggestForm({ ...suggestForm, url: e.target.value })} />
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
                <p className="suggest-note">Opens a pre-filled GitHub Issue in a new tab.</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── About Tab ─── */}
        {tab === "about" && (
          <div className="about-section fade-in">
            <h2 className="about-heading">About This Project</h2>
            <div className="about-content">
              <p>
                <strong>The Data Journalism Tracker</strong> is built by <a href="https://binchen19.github.io/" target="_blank" rel="noreferrer">Bin Chen</a> as
                a companion resource for the course and textbook <a href="https://binchen19.github.io/djr/" target="_blank" rel="noreferrer"><em>Data Journalism with R</em></a>.
              </p>
              <p>
                It was originally designed to help students stay on top of the best data-driven reporting from
                world-class newsrooms — giving them real-world examples, methodological inspiration, and open datasets
                to draw on for their final projects and beyond.
              </p>
              <p>
                But this tracker isn't just for the classroom. It's equally useful for professional journalists looking
                for inspiration and technique references, and for anyone curious about data storytelling.
              </p>

              <h3 className="about-subheading">What You'll Find Here</h3>
              <p>
                Articles from {RSS_SOURCES.length} sources are fetched live via RSS feeds. Another {BROWSE_SOURCES.length} leading
                outlets are featured as "browse directly" links — these don't offer data-journalism-specific RSS feeds,
                so we link you straight to their data sections.
              </p>

              <h3 className="about-subheading">Links & Resources</h3>
              <div className="about-links">
                <a href="https://binchen19.github.io/djr/" target="_blank" rel="noreferrer" className="about-link-card">
                  <div className="about-link-icon">📖</div>
                  <div><strong>Data Journalism with R</strong><span>Free online textbook</span></div>
                </a>
                <a href="https://github.com/binchen19/djr/" target="_blank" rel="noreferrer" className="about-link-card">
                  <div className="about-link-icon">💻</div>
                  <div><strong>GitHub Repository</strong><span>Source code for the textbook</span></div>
                </a>
                <a href="https://binchen19.github.io/" target="_blank" rel="noreferrer" className="about-link-card">
                  <div className="about-link-icon">🌐</div>
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
