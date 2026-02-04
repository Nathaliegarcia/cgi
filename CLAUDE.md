# CGI Tools Project

A collection of browser-based web tools that run via CGI on a web server.

## Project Structure

```
cgi/
├── list/           # Directory index generator (Python CGI)
├── markdown/       # Website to Markdown converter (HTML + JS)
├── sitemap/        # Website crawler / sitemap generator (HTML + JS)
├── spidermap/      # Website link graph visualizer (HTML + JS)
├── proxy/          # CORS proxy script (Python CGI)
├── screenshot/     # Website screenshot capture (Python CGI)
├── omnitools/      # External project - DO NOT MODIFY (see warning below)
└── .github/        # GitHub Actions workflows (FTP deployment)
```

## Technology Stack

- **Python 3.13** - Used for CGI scripts
- **Vanilla HTML/CSS/JS** - No frameworks, no build tools, no imports
- **No external dependencies** - No npm, no pip packages beyond standard library
- **No cgilib** - Plain CGI using print statements for HTTP responses

## Development Guidelines

### Python Scripts
- Use Python 3.13
- Only use standard library modules (no pip installs)
- No cgilib - use plain `print()` for HTTP headers and body
- Keep imports minimal and only what's absolutely necessary

### Frontend Code
- Vanilla JavaScript only - no frameworks (React, Vue, etc.)
- Vanilla CSS only - no preprocessors (SASS, LESS, etc.)
- No module imports or bundlers
- All code inline in HTML or in separate `.js`/`.css` files

## CORS Proxy Pattern

For fetching external websites (to bypass CORS restrictions), the project uses a dual-proxy approach with a toggle:

### Option 1: Local Proxy (proxy.py)
- Path: `../proxy/proxy.py?url=<encoded_url>`
- Returns JSON: `{ "html": "...", "success": true, "url": "..." }`
- Used when "local proxy" checkbox is checked

### Option 2: External Proxy (codetabs.com)
- URL: `https://api.codetabs.com/v1/proxy/?quest=<encoded_url>`
- Returns raw HTML
- Used when "local proxy" checkbox is unchecked (default)

This pattern is implemented in:
- `sitemap/index.html` - Website crawler
- `spidermap/index.html` - Website link graph
- `markdown/converter.js` - Markdown converter

Each tool includes a checkbox labeled "local proxy" to toggle between the two options.

## Tools Overview

### /list - Directory Index
Python CGI script that generates an HTML page listing all subdirectories in the project root.

### /markdown - Website to Markdown Converter
Converts HTML content from websites to clean Markdown format.
- Supports single URL or batch processing (multiple URLs)
- Extracts SEO meta tags as YAML frontmatter (title, description, og:*, twitter:*, etc.)
- Removes navigation, ads, scripts, and other non-content elements
- Downloads results as `.md` files

### /sitemap - Website Crawler
Crawls a website and discovers all internal URLs.
- Removes tracking parameters (utm_*, fbclid, gclid, etc.)
- Skips non-HTML resources (images, PDFs, etc.)
- Exports discovered URLs as text file

### /spidermap - Website Link Graph
Crawls a website and visualizes page connections as an interactive graph.
- Force-directed graph showing pages as nodes and links as directed edges
- Tracks which page links to which other pages
- Configurable crawl depth and max pages limits
- Pan, zoom, and click nodes to open pages
- Exports graph data as JSON (nodes + edges)

### /proxy - CORS Proxy
Python CGI script that fetches external URLs and returns content with CORS headers.
- Accepts URL via query parameter: `?url=<encoded_url>`
- Returns JSON with HTML content
- Adds proper CORS headers for cross-origin requests

### /screenshot - Website Screenshot Capture
Python CGI script that captures screenshots of websites using wkhtmltoimage/wkhtmltopdf.
- Accepts URL via query parameter: `?url=<encoded_url>`
- Optional `proxy` parameter: `local` (default) or `external`
- Optional `pdf` parameter: `true` to generate PDF instead of PNG (default: `false`)
- Returns PNG image (or PDF) with filename based on domain and timestamp
- Standard viewport: 1280×800 pixels

## Deployment

The project deploys via FTP using GitHub Actions (`.github/workflows/ftp-deploy.yml`):

- **Push to main**: Deploys to production (`./www/`)
- **Pull request**: Deploys to staging (`./www/staging/`)
- **Manual trigger**: Deploys to production (`./www/`)

Required GitHub Secrets:
- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`

## Pull request
keep the commit synthetic, no need to go into too much details
Never commit or create pull request with reference to or links to claude code or ai
update this claude.md with reference to new projects and updates as they are implemented to keep documentation fresh and relevent
pull source branch at each user interaction to make sure no conflict arise during pr

## Warning: omnitools Folder

**DO NOT MODIFY the `omnitools/` folder.**

This is an external project that was built and deployed separately. Never touch it unless:
1. Explicitly asked to modify it
2. You have confirmed with the user that they want changes to omnitools

Even if a request seems related to omnitools, always confirm before making any changes.
