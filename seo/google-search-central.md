# Google Search Central - Official SEO Best Practices

> Source: [Google Search Central](https://developers.google.com/search) - The official source for Google's SEO guidelines and documentation.
> Last updated: February 2026

## Table of Contents

- [Overview](#overview)
- [Core Principles](#core-principles)
- [On-Page SEO](#on-page-seo)
- [Technical SEO](#technical-seo)
- [Structured Data](#structured-data)
- [E-E-A-T](#e-e-a-t-experience-expertise-authoritativeness-trustworthiness)
- [Content Quality Guidelines](#content-quality-guidelines)
- [Mobile & Page Experience](#mobile--page-experience)
- [Indexing & Crawling](#indexing--crawling)
- [Local SEO](#local-seo)
- [Spam Policies](#spam-policies)
- [Key Tools](#key-tools)

---

## Overview

Google's SEO Starter Guide provides the **authoritative, official best practices** for making content easier for search engines to crawl, index, and understand. This is the single most important reference for SEO because Google controls ~90% of global search traffic.

**Core mission:** Deliver the most relevant, helpful content to users.

**Important:** Google does not guarantee that structured data, optimization, or any specific technique will result in rankings. SEO is about making content eligible for and competitive in search results.

---

## Core Principles

### 1. Create Content for People, Not Search Engines
Google explicitly states that content should be created primarily for users, not to manipulate search rankings. The "helpful content" system evaluates whether content provides a satisfying experience.

### 2. Make Your Site Discoverable
- Use **sitemaps** and **internal links** for content discovery
- Ensure resources (CSS, JS, images) are accessible to Googlebot
- Don't block important resources in robots.txt

### 3. Communicate What Your Page Is About
- Use **descriptive titles** and **meta descriptions**
- Use **heading hierarchy** to structure content
- Use **descriptive URLs**

### 4. Follow the Guidelines
- Avoid anything that would be considered deceptive or manipulative
- Focus on providing value to users
- Stay within Google's quality guidelines

---

## On-Page SEO

### Title Tags
- Every indexable page should have a unique, descriptive title
- Include primary keyword naturally
- Keep within pixel width limits (approximately 50-60 characters)
- Title should accurately represent the page content
- Don't stuff keywords into titles

### Meta Descriptions
- Write unique, compelling descriptions for each page
- Summarize the page content accurately
- Include target keyword naturally
- ~155 characters recommended
- Google may override your meta description with its own snippet
- Meta descriptions are **not a ranking factor** but affect click-through rate

### Heading Structure
- Use a single **H1** per page for the main topic
- Use **H2** for major sections
- Use **H3-H6** for subsections
- Headings should create a logical content outline
- Don't use headings solely for visual styling

### URL Structure
- Use **descriptive, readable URLs**
- Include relevant keywords
- Use hyphens to separate words
- Keep URLs short and clean
- Avoid long query strings and session IDs

### Content Optimization
- Place primary keyword naturally in the content
- Write comprehensive, in-depth content that fully answers the query
- Use related terms and synonyms naturally
- Include relevant images with **descriptive alt text**
- Link to related content (internal and external)

### Image Optimization
- Use **descriptive file names** (not IMG_001.jpg)
- Add **alt text** to all images
- Use appropriate image formats (WebP, JPEG, PNG)
- Compress images for faster loading
- Consider using responsive images (srcset)
- Use image sitemaps for important images

---

## Technical SEO

### Crawlability
- Submit an **XML sitemap** to Google Search Console
- Use **internal linking** to help crawlers discover pages
- Fix **crawl errors** promptly
- Monitor crawl stats in Search Console
- Don't block important resources in robots.txt

### Robots.txt
- Use robots.txt to manage crawler access
- Don't use robots.txt to hide pages from Google (use noindex instead)
- Test robots.txt with Search Console's tester tool
- Be careful not to accidentally block CSS/JS files

### Canonical URLs
- Set canonical URLs to prevent duplicate content issues
- Use `<link rel="canonical">` on every page
- Choose one version of each URL (www vs non-www, http vs https)
- Self-referencing canonicals are recommended

### HTTPS/Security
- Use **HTTPS** everywhere (ranking signal since 2014)
- Obtain a proper SSL/TLS certificate
- Redirect HTTP to HTTPS
- Avoid mixed content (HTTP resources on HTTPS pages)

### Page Speed
- Fast-loading pages improve user experience
- Core Web Vitals are ranking signals:
  - **LCP** (Largest Contentful Paint): < 2.5 seconds
  - **INP** (Interaction to Next Paint): < 200 milliseconds
  - **CLS** (Cumulative Layout Shift): < 0.1
- Optimize images, minify CSS/JS, use caching
- Use a CDN for global delivery

### Mobile-First Indexing
- Google primarily uses the **mobile version** of content for indexing and ranking
- Ensure your site is **responsive** and works well on all screen sizes
- Don't hide content on mobile that exists on desktop
- Test with Google's Mobile-Friendly Test tool

### International SEO
- Use **hreflang tags** for multilingual/multi-regional content
- Choose between ccTLDs, subdomains, or subdirectories for international targeting
- Set geographic target in Search Console if applicable

---

## Structured Data

### Recommended Format
- **JSON-LD** is Google's recommended format (over Microdata and RDFa)
- Easiest to implement and maintain at scale
- Can be injected in the `<head>` or `<body>`

### Supported Rich Result Types

| Type | Required Properties | Key Recommended Properties |
|------|-------------------|--------------------------|
| **Article** | None required | author, datePublished, dateModified, headline, image |
| **FAQ** | FAQPage type, Question/Answer pairs | All questions must have answers |
| **How-To** | HowTo type, step list | name, image, totalTime, estimatedCost |
| **Local Business** | @type, name, address | telephone, openingHours, geo, url, logo |
| **Product** | name | offers (price, availability), review, aggregateRating |
| **Organization** | None required | name, url, logo, address, telephone |
| **Breadcrumb** | itemListElement | name, item (URL) |
| **Video** | name, uploadDate, thumbnailUrl | description, contentUrl, duration |
| **Recipe** | name | image, author, prepTime, cookTime, nutrition |
| **Event** | name, startDate, location | description, image, offers, performer |
| **Review** | itemReviewed, author, reviewRating | datePublished, reviewBody |
| **Course** | name, provider | description, offers |
| **Job Posting** | title, description, datePosted, hiringOrganization, jobLocation | salary, employmentType |
| **Software App** | name | offers, aggregateRating, operatingSystem |

### Structured Data Guidelines
- Only mark up content that is **visible on the page**
- Don't mark up **irrelevant or misleading** content
- Content must comply with Google's **content policies**
- Use the **Rich Results Test** to validate markup
- Structured data **does not guarantee** rich results display
- Keep structured data **up to date** (especially for events, products, job postings)

### Validation & Testing
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- Google Search Console **Enhancements** reports

---

## E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

### What E-E-A-T Means
Google's Search Quality Rater Guidelines evaluate content based on:

| Signal | Definition | How to Demonstrate |
|--------|-----------|-------------------|
| **Experience** | First-hand or life experience with the topic | Share personal experience, include original photos/data, show real-world usage |
| **Expertise** | Knowledge and skill in the topic area | Author credentials, accurate information, depth of coverage |
| **Authoritativeness** | Reputation as a go-to source | Industry recognition, citations from other authoritative sources, strong backlink profile |
| **Trustworthiness** | Accuracy, honesty, and safety of the page | HTTPS, clear sourcing, transparent authorship, accurate information |

### E-E-A-T Best Practices
1. **Show author information** - name, bio, credentials, links to profiles
2. **Cite authoritative sources** - link to studies, official documentation, expert analysis
3. **Demonstrate first-hand experience** - original research, personal testing, real photographs
4. **Keep content accurate and updated** - regularly review and update published content
5. **Build brand reputation** - earn mentions, reviews, and citations from reputable sources
6. **Be transparent** - clear about who you are, what you do, and how to contact you

### YMYL (Your Money or Your Life)
Content about topics that could impact health, finances, safety, or well-being is held to **higher E-E-A-T standards**. Examples:
- Medical/health advice
- Financial advice
- Legal information
- News and current events
- Safety information

---

## Content Quality Guidelines

### Helpful Content System
Google's helpful content system generates a **site-wide signal** that affects rankings. It evaluates:

1. **Is the content created for people?** (Not primarily for search engine manipulation)
2. **Does the content demonstrate expertise?** (Written by someone knowledgeable)
3. **Does the site have a primary purpose or focus?** (Topical authority)
4. **Will someone leave feeling they've learned enough?** (Satisfying experience)
5. **Is the content original?** (Not rehashed from other sources)

### Content Quality Checklist
- [ ] Content provides substantial, complete, and comprehensive information
- [ ] Content contains insightful analysis or original information
- [ ] Content goes beyond the obvious and provides real value
- [ ] If sourcing from others, content adds substantial value rather than copying
- [ ] Main heading/title is descriptive and not exaggerated or shocking
- [ ] Content is something you'd bookmark, share, or recommend
- [ ] Content wouldn't look out of place in a printed magazine or encyclopedia
- [ ] Content is well-produced with attention to detail
- [ ] Content isn't mass-produced or outsourced to a large number of creators

### Content Freshness
- Update content regularly to keep it accurate
- Add publication dates and last-updated dates
- Remove or update outdated information
- Google values fresh content for time-sensitive queries

---

## Mobile & Page Experience

### Core Web Vitals (2024+)

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5s - 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | < 200ms | 200ms - 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |

**Note:** INP replaced FID (First Input Delay) as of March 2024.

### Page Experience Signals
- HTTPS security
- No intrusive interstitials (pop-ups)
- Mobile-friendly design
- Core Web Vitals passing
- Safe browsing (no malware/deceptive content)

---

## Indexing & Crawling

### How Google Discovers Content
1. **Crawling** - Googlebot discovers pages via links and sitemaps
2. **Rendering** - Google renders JavaScript to see the full page
3. **Indexing** - Content is analyzed and stored in Google's index
4. **Serving** - Relevant pages are returned for search queries

### Sitemaps
- Submit XML sitemaps via **Google Search Console**
- Include all important, indexable pages
- Keep sitemaps updated as content changes
- Maximum 50,000 URLs per sitemap file
- Use sitemap index files for larger sites

### Robots Meta Tags
| Directive | Effect |
|-----------|--------|
| `index` | Allow indexing (default) |
| `noindex` | Prevent indexing |
| `follow` | Follow links on the page (default) |
| `nofollow` | Don't follow links |
| `noarchive` | Don't show cached version |
| `nosnippet` | Don't show text snippet |
| `max-snippet:[number]` | Limit snippet length |
| `max-image-preview:[setting]` | Control image preview size |
| `max-video-preview:[number]` | Limit video snippet length |

---

## Local SEO

### Google Business Profile
- **Most important factor** for local SEO
- Complete all business information (name, address, phone, hours, category)
- Add photos and respond to reviews
- Keep information consistent across all platforms (NAP consistency)

### Local SEO Best Practices
- 46% of all Google searches have **local intent**
- Optimize for "near me" searches
- Get listed in relevant local directories
- Encourage and respond to customer reviews
- Create locally relevant content
- Use Local Business schema markup

---

## Spam Policies

### What Google Considers Spam
- **Cloaking** - showing different content to users vs. Googlebot
- **Doorway pages** - pages created solely for search engines
- **Hidden text and links** - invisible to users but visible to crawlers
- **Keyword stuffing** - unnatural repetition of keywords
- **Link spam** - buying/selling links, excessive link exchanges
- **Machine-generated traffic** - automated queries to Google
- **Scraped content** - copying content from other sites
- **Sneaky redirects** - redirecting users to unexpected pages
- **Automatically generated content** - used to manipulate rankings (not all AI content)
- **Thin affiliate content** - pages that exist only for affiliate links

### Penalties
- **Manual actions** - applied by human reviewers, visible in Search Console
- **Algorithmic demotion** - automatic ranking decrease
- **Deindexing** - complete removal from search results

---

## Key Tools

### Google Search Console (Free)
- Monitor search performance (clicks, impressions, CTR, position)
- Submit sitemaps
- Identify and fix indexing issues
- Monitor Core Web Vitals
- Review structured data errors
- Check mobile usability
- Receive manual action notifications

### Google PageSpeed Insights (Free)
- Analyze page speed for mobile and desktop
- Core Web Vitals assessment
- Specific optimization recommendations
- Lighthouse performance score

### Rich Results Test (Free)
- Validate structured data markup
- Preview how rich results will appear
- Identify errors in schema implementation

### Google Trends (Free)
- Research keyword popularity over time
- Compare search terms
- Discover trending topics
- Regional search interest data

---

## Sources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central Documentation](https://developers.google.com/search/docs)
- [Structured Data Markup Guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Introduction to Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Structured Data Search Gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
- [Google Search Quality Rater Guidelines](https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf)
- [Google Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies)
- [Core Web Vitals Documentation](https://web.dev/vitals/)
- [Google Business Profile Help](https://support.google.com/business)
- [Google Refreshes Its SEO Starter Guide - Brafton](https://www.brafton.com/blog/seo/google-refreshes-seo-starter-guide/)
