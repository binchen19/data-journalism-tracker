# The Data Journalism Tracker

A live, auto-updating feed of data-driven stories from leading newsrooms around the world — built for students, journalists, and anyone curious about data storytelling.

**Live site →** [data-journalism-tracker.vercel.app](https://data-journalism-tracker.vercel.app)

---

## What is this?

The Data Journalism Tracker aggregates articles from 6 handpicked data journalism outlets, giving you a single place to browse the best data-driven reporting. Each article links directly to the original piece on the source's website.

It was built by [Bin Chen](https://binchen19.github.io/) as a companion resource for the course and open textbook [*Data Journalism with R*](https://binchen19.github.io/djr/).

## Tracked Sources

| Source | Region | Method |
|---|---|---|
| [NYT The Upshot](https://www.nytimes.com/section/upshot) | US | RSS |
| [Our World in Data](https://ourworldindata.org) | Global | RSS |
| [Reuters Data](https://www.reuters.com/data/) | Global | Scrape |
| [FT Visual & Data Journalism](https://www.ft.com/visual-and-data-journalism) | UK | Scrape |
| [Caixin 財新·數字說](https://datanews.caixin.com/) | Asia | Scrape |
| [NBC Data Points](https://www.nbcnews.com/datagraphics) | US | Scrape |

## How it works

- **RSS sources** are fetched via the [rss2json](https://rss2json.com/) API.
- **Scraped sources** are fetched through a CORS proxy ([allorigins.win](https://allorigins.win/)), parsed client-side with `DOMParser`, and filtered with source-specific rules to extract only relevant article links.
- Everything runs in the browser — no backend or database required.

## Tech stack

- **React** (Vite)
- **Vanilla CSS** (no frameworks — newspaper-inspired editorial design)
- **Google Fonts**: DM Serif Display, IBM Plex Sans, IBM Plex Mono
- **Deployed on**: Vercel (auto-deploys on push to `main`)

## Getting started

```bash
# Clone the repo
git clone https://github.com/binchen19/data-journalism-tracker.git
cd data-journalism-tracker

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project structure

```
data-journalism-tracker/
├── src/
│   ├── App.jsx          # Main app — sources, fetching, UI
│   ├── main.jsx         # React entry point
│   └── index.css        # (empty — styles are in App.jsx)
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Features

- **Live article feed** from 6 data journalism outlets
- **Filter by source** with clickable pill buttons
- **Search** across article titles and summaries
- **Refresh button** to re-fetch all sources
- **Sources tab** with links to each outlet and a "Suggest a Source" form
- **About tab** with project background and resource links
- **Responsive design** that works on desktop and mobile
- **Suggest a Source** form that opens a pre-filled GitHub Issue

## Adding or removing a source

All sources are defined in the `SOURCES` array at the top of `src/App.jsx`. Each source has this shape:

```javascript
{
  id: "nyt",                    // Unique ID
  name: "NYT The Upshot",      // Display name
  emoji: "📰",                 // Icon shown in UI
  region: "US",                // US / UK / Asia / Global
  url: "https://...",          // Link to the source's page
  type: "rss",                 // "rss" or "scrape"
  feed: "https://...",         // RSS feed URL or page URL to scrape
}
```

**To add a source:** add an entry to the array. If `type` is `"scrape"`, you'll also need to add a filter rule in the `fetchScrape` function to extract relevant links from that site's HTML.

**To disable a source:** remove or comment out its entry in the array.

## Suggesting a source

Users can suggest new sources via the form on the Sources tab. It opens a pre-filled [GitHub Issue](https://github.com/binchen19/data-journalism-tracker/issues) with the `source-suggestion` label.

To set up the label: go to your repo's **Labels** page and create one called `source-suggestion`.

## Future improvements

- [ ] Server-side scraping via Vercel cron jobs (for sources that block CORS proxies)
- [ ] Topic auto-tagging using article content
- [ ] Student project showcase tab
- [ ] Dataset links per article where available
- [ ] RSS feed output so others can subscribe

## Related resources

- 📖 [Data Journalism with R](https://binchen19.github.io/djr/) — free online textbook
- 💻 [Textbook GitHub repo](https://github.com/binchen19/djr/)
- 🌐 [Bin Chen's website](https://binchen19.github.io/)

## License

MIT
