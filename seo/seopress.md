# SEOPress - Best Practices & Rules

> Source: [SEOPress](https://www.seopress.org/) - Privacy-friendly WordPress SEO plugin (450K+ active installations, 4.8/5 rating).
> Last updated: February 2026

## Table of Contents

- [Philosophy](#philosophy)
- [Content Analysis](#content-analysis)
- [Meta Tags Management](#meta-tags-management)
- [Site Audit (13 Checks)](#site-audit-13-checks)
- [Schema & Structured Data](#schema--structured-data)
- [XML & HTML Sitemaps](#xml--html-sitemaps)
- [Redirects & 404 Management](#redirects--404-management)
- [Image SEO](#image-seo)
- [Local SEO](#local-seo)
- [WooCommerce Integration](#woocommerce-integration)
- [Technical SEO Features](#technical-seo-features)
- [Content Best Practices](#content-best-practices)

---

## Philosophy

SEOPress positions itself as a **privacy-friendly, ad-free, white-label ready** SEO plugin. It focuses on providing all essential SEO features without bloat, at a significantly lower price point than competitors. The plugin is freemium: SEOPress Free provides core functionality, and SEOPress PRO adds advanced features as an add-on.

Key differentiators:
- **No ads** in the WordPress dashboard
- **White-label ready** for agencies
- **No data collection** - fully GDPR compliant
- **Affordable**: $49/year for 5 sites (Pro), $149/year unlimited

---

## Content Analysis

### How It Works
- Analyze content with **unlimited target keywords** (no restrictions on keyword count)
- Real-time content analysis checks keyword placement, headings, and readability
- **Google Suggestions** integration: find top 10 Google suggestions instantly for long-tail optimization
- AI-powered suggestions available in Pro for faster optimization

### Content Analysis Checks
| Check | What It Evaluates |
|-------|------------------|
| **Keyword in Title** | Focus keyword appears in the SEO title |
| **Keyword in Meta Description** | Focus keyword appears in the meta description |
| **Keyword in Content** | Focus keyword appears in the body text |
| **Keyword in H1** | Focus keyword appears in the H1 heading |
| **Keyword in H2/H3** | Focus keyword appears in subheadings |
| **Keyword Density** | Appropriate keyword frequency |
| **Content Length** | Sufficient word count |
| **Image Alt Text** | Images have alt attributes |
| **Internal Links** | Links to other pages on the site |
| **External Links** | Links to external resources |
| **Meta Title Length** | Title within recommended character count |
| **Meta Description Length** | Description within recommended character count |

### Note on Real-Time Analysis
Some users report that the analysis is **not fully real-time** - you may need to save the draft before the score and recommendations recalculate. This differs from Yoast and Rank Math, which update scores as you type.

---

## Meta Tags Management

### SEO Title & Meta Description
- Manual input for title tags and meta descriptions on every page/post/custom post type
- **Preset tags** available for automated generation (e.g., `%%title%%`, `%%sitename%%`)
- **AI-powered generation** via ChatGPT integration (Pro): automatically generates optimized titles and descriptions based on focus keyword
- CSV import/export for bulk metadata management

### Advanced Meta Controls
- **Canonical URL** - Set custom canonical per page
- **Noindex** - Prevent search engine indexing
- **Nofollow** - Prevent link juice passing
- **Nosnippet** - Prevent snippet display
- **Noimageindex** - Prevent image indexing
- **Noarchive** - Prevent cached version display

### Social Meta Tags
- **Open Graph** tags for Facebook, LinkedIn, Pinterest, Discord, WhatsApp
- **Twitter Cards** metadata
- Custom social images and descriptions per page
- Fallback settings for pages without specific social meta

---

## Site Audit (13 Checks)

SEOPress PRO runs an automatic audit every time you update a post or page. It checks **13 specific SEO issues**:

| # | Check | What It Does |
|---|-------|-------------|
| 1 | **Canonical URL** | Ensures correct canonical tag is present, telling search engines which URL version to index |
| 2 | **Meta Robots** | Verifies meta robots tag is present and correctly configured (index/follow) |
| 3 | **Alt Text for Images** | Checks all images have descriptive alt text for accessibility and image SEO |
| 4 | **Internal Links** | Analyzes internal link structure and connectivity between pages |
| 5 | **Outbound Links** | Reviews external links for quality and broken link detection |
| 6 | **Meta Title** | Checks title tag is present and optimized |
| 7 | **Meta Description** | Checks description tag is present and optimized |
| 8 | **H1 Heading** | Verifies a single, optimized H1 is present |
| 9 | **H2 Headings** | Checks for proper subheading structure |
| 10 | **Keywords in Content** | Validates keyword usage in body text |
| 11 | **Content Length** | Checks minimum word count |
| 12 | **Noindex Check** | Warns if page is accidentally set to noindex |
| 13 | **Broken Links** | Detects broken internal and external links (via SEOPress BOT) |

### Broken Link Detection
- **SEOPress BOT** (Pro) automatically crawls and detects broken links across the entire site
- Provides a dashboard report of all broken links
- Suggests fixes or removal

---

## Schema & Structured Data

### Supported Schema Types
- Article / BlogPosting / NewsArticle
- FAQ
- How-To
- Product (with WooCommerce integration)
- Local Business
- Event
- Course
- Recipe
- Review
- Service
- Video
- Software Application
- Organization / Person
- Breadcrumbs

### Implementation
- Add schema to individual posts/pages via the editor
- Automatic schema based on post type
- Custom schema with JSON-LD support
- Schema validation built-in
- Advanced schema markup (Pro)

---

## XML & HTML Sitemaps

### XML Sitemaps
- **One-click** automatic XML sitemap generation
- Image sitemap support (including WooCommerce products)
- **Video XML sitemap** (Pro)
- **Google News XML sitemap** (Pro)
- Author sitemap support
- Automatically disables native WordPress sitemaps to avoid conflicts
- Control which post types, taxonomies appear in sitemaps

### HTML Sitemaps
- Generate human-readable HTML sitemaps
- Customizable display options
- Useful for both users and search engines

### Instant Indexing
- **Google Indexing API** integration: 200 free queries/day
- **IndexNow API** for Bing and Yandex: up to 10,000 requests/day
- Submit URLs for near-instant indexing

---

## Redirects & 404 Management

### 404 Monitoring
- Log all 404 errors automatically
- Dashboard view of all 404 occurrences
- Redirect 404 errors to homepage or custom URL

### Redirect Manager
- Create **unlimited redirections**
- Supported status codes: **301, 302, 307, 410, 451**
- **Regular expression** support for pattern-based redirects
- Import/export redirections via **CSV** or **.htaccess** file
- Import redirects from Yoast and other plugins
- Automatic redirect suggestion when URL slugs change

---

## Image SEO

### Best Practices (from SEOPress)
1. **Use original images** whenever possible - indicates content originality
2. **Optimize file names** - descriptive, lowercase, no spaces (use hyphens)
   - Good: `red-running-shoes.jpg`
   - Bad: `IMG_5497.jpg` or `Red Running Shoes.JPG`
3. **Always add alt text** - important for accessibility, image SEO, and screen readers
4. **Compress images** - large images slow page speed, hurting SEO
5. **Use appropriate formats** - WebP for web, SVG for logos/icons
6. **Lazy load images** - improve initial page load time

### Why Image SEO Matters
- Large unoptimized images slow site speed (negative ranking factor)
- Low-quality images reduce user experience
- Generic/unnamed images confuse search engine crawlers
- Images without alt text miss accessibility and SEO opportunities

---

## Local SEO

### Local Business Schema
- Add detailed business information (name, address, phone, hours)
- Multiple location support
- Google Business Profile optimization guidance
- Local structured data for Google Maps integration

---

## WooCommerce Integration

### Product SEO Features
- **Product Global Identifiers** (barcode, GTIN, MPN) for product schema
- **OG Price / OG Currency** for social sharing of products
- Disable crawling on cart, checkout, and account pages
- **Google Enhanced Ecommerce** tracking for purchase events
- Product schema automatically populated from WooCommerce data

### WooCommerce Sitemaps
- Products automatically included in XML sitemaps
- Product image sitemaps
- Category sitemaps

---

## Technical SEO Features

### Breadcrumbs
- Optimized with **Schema.org** markup
- **Accessibility-ready** implementation
- Customizable display and structure

### Analytics Integration
- **Google Analytics** integration (Free)
- **Matomo** integration
- **Google Tag Manager** support
- Cookie consent bar for GDPR compliance

### Performance
- Lightweight codebase
- No external API calls for basic features
- Minimal impact on page load times

---

## Content Best Practices

### From SEOPress's Guidelines

1. **Write for humans first** - The most effective SEO content reads naturally, with optimization as a secondary consideration
2. **Target search intent** - Understand whether users want information, to navigate, or to buy
3. **Use keywords naturally** - Include keyword early in content, but avoid stuffing
4. **Use keywords in URLs** - Keep folder/page names to 1-2 keywords, lowercase, separated by hyphens
5. **Avoid duplicate content** - Google explicitly warns against "duplicate or near-duplicate versions of content"
6. **Demonstrate E-E-A-T** - Experience, Expertise, Authoritativeness, Trustworthiness
7. **Comply with Google guidelines** - No spam tactics (link buying, cloaking, PBNs, auto-generated content)
8. **Optimize meta titles and descriptions** - Convey content relevance clearly
9. **Consider mobile and speed** - Mobile responsiveness, page speed, and structured data are fundamental
10. **Organize around content pillars** - Target 4-6 topical pillars, build topic clusters

---

## Sources

- [SEOPress Official Website](https://www.seopress.org/)
- [SEOPress Features](https://www.seopress.org/features/)
- [SEOPress PRO Features](https://www.seopress.org/wordpress-seo-plugins/pro/)
- [SEOPress WordPress Plugin Page](https://wordpress.org/plugins/wp-seopress/)
- [SEOPress Image SEO Guide](https://www.seopress.org/newsroom/featured-stories/wordpress-image-seo/)
- [SEOPress Review - BlogVault](https://blogvault.net/seopress-review/)
- [SEOPress Review - SiteSaga](https://www.sitesaga.com/seopress-review/)
- [SEOPress Review - WPMarmite](https://wpmarmite.com/en/compare/best-wordpress-seo-plugins/seopress/)
