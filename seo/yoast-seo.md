# Yoast SEO - Best Practices & Rules

> Source: [Yoast](https://yoast.com/) - The most widely used WordPress SEO plugin (13M+ active installations).
> Last updated: February 2026

## Table of Contents

- [Philosophy](#philosophy)
- [SEO Analysis Checks](#seo-analysis-checks)
- [Readability Analysis Checks](#readability-analysis-checks)
- [Technical SEO Features](#technical-seo-features)
- [Structured Data & Schema](#structured-data--schema)
- [Content SEO Best Practices](#content-seo-best-practices)
- [2026 SEO Predictions from Yoast](#2026-seo-predictions-from-yoast)

---

## Philosophy

Yoast SEO operates on two core principles:

1. **Write for humans, structure for machines** - Content should be clear, helpful, and people-first while being structured so search engines and AI systems can parse it.
2. **Traffic light scoring system** - Green, orange, and red bullets indicate optimization levels. Not every light needs to be green; the overall score is what matters.

---

## SEO Analysis Checks

Yoast performs **15+ real-time checks** based on a focus keyphrase. Each receives a green/orange/red score.

### Keyphrase Placement Checks

| Check | What It Does | Green Criteria |
|-------|-------------|----------------|
| **Keyphrase in Title** | Checks if the keyphrase appears in the SEO title | Keyphrase found in title |
| **Keyphrase in Introduction** | Checks first paragraph for keyphrase words | All keyphrase words appear within one sentence in paragraph 1 |
| **Keyphrase in Meta Description** | Checks if keyphrase appears in meta description | Keyphrase or synonym found; max 2 occurrences |
| **Keyphrase in Slug (URL)** | Checks if the keyphrase is used in the URL | Keyphrase found in slug |
| **Keyphrase in Subheadings** | Checks if subheadings reflect the topic | At least one content word from keyphrase appears in a subheading |
| **Keyphrase in Image Alt Text** | Checks image alt attributes for keyphrase | Keyphrase or synonyms found in alt text |
| **Keyphrase Density** | Checks if keyphrase is used enough (but not too much) | Appropriate density without over-optimization |
| **Keyphrase Distribution** *(Premium)* | Checks how well keyphrase is spread through the text | Even distribution across the content |
| **Previously Used Keyphrase** | Warns if the keyphrase was used in another post | Keyphrase not used elsewhere |

### Content Quality Checks

| Check | What It Does | Green Criteria |
|-------|-------------|----------------|
| **Text Length** | Checks if content meets minimum word count | Minimum 300 words (cornerstone: 900 words) |
| **SEO Title Width** | Checks if the title has an appropriate pixel width | Title fits within Google's display limit |
| **Meta Description Length** | Checks if the description is the right length | ~155 characters (within pixel limits) |
| **Single H1** | Checks for multiple H1 headings | Only one H1 on the page |
| **Outbound Links** | Checks for links to external sites | At least one followed outbound link |
| **Internal Links** | Checks for links to other site pages | At least one internal link present |
| **Link Keyphrase** | Checks if any link text contains the keyphrase | No exact keyphrase used as anchor text (to avoid over-optimization) |

### Scoring Details

**Meta Description Feedback Levels:**
- **Red:** No meta description, or description present but keyphrase missing
- **Orange:** Keyphrase appears more than 2 times (over-optimization)
- **Green:** Keyphrase or synonym appears 1-2 times

**Text Length Thresholds:**
- Standard posts: minimum 300 words
- Cornerstone content: minimum 900 words
- Japanese content: 600 characters (cornerstone: 1,800 characters)

---

## Readability Analysis Checks

Yoast provides a separate readability analysis that evaluates how easy the content is to read.

### Readability Assessments

| Check | What It Does | Green Criteria |
|-------|-------------|----------------|
| **Flesch Reading Ease** | Scores text readability 0-100 | Score of 60 or higher |
| **Passive Voice** | Tracks percentage of passive voice sentences | Less than 10% passive voice |
| **Transition Words** | Checks if enough sentences use transition words | At least 30% of sentences use transition words |
| **Sentence Length** | Checks for overly long sentences | No more than 25% of sentences exceed 20 words |
| **Paragraph Length** | Checks for overly long paragraphs | No paragraphs exceed 150 words |
| **Subheading Distribution** | Checks if long text is broken by subheadings | No text sections longer than 300 words without a subheading |
| **Consecutive Sentences** | Checks for sentences starting with the same word | No more than 3 consecutive sentences starting with the same word |
| **Text Presence** | Checks if there is actually text on the page | Text is present |

### Flesch Reading Ease Scale

| Score | Difficulty | Notes |
|-------|-----------|-------|
| 90-100 | Very easy | 5th grade level |
| 80-89 | Easy | 6th grade level |
| 70-79 | Fairly easy | 7th grade level |
| **60-69** | **Standard** | **Target for web copy** |
| 50-59 | Fairly difficult | College level |
| 30-49 | Difficult | Graduate level |
| 0-29 | Very difficult | Professional/academic |

### Readability Tips

- **Transition words** include: "most importantly", "because", "therefore", "besides that", "however", "furthermore", "in addition", "consequently", "as a result"
- **Active voice** is preferred: "The team completed the project" vs. "The project was completed by the team"
- Use the **inverted pyramid** writing style: key information first, details later
- **Language support:** Passive voice, transition words, and Flesch reading ease checks are available in 15+ languages (English, Spanish, French, German, Italian, Dutch, Portuguese, Russian, Arabic, Japanese, etc.)

---

## Technical SEO Features

### XML Sitemaps
- Automatically generates and updates XML sitemaps at `/sitemap_index.xml`
- Post types marked as `noindex` are excluded
- Pages with custom canonical URLs different from their default are excluded
- WooCommerce-specific sitemaps available (Premium)
- Image sitemaps supported (Premium)

### Canonical URLs
- Automatically generates canonical URLs for every page
- Prevents duplicate content by enforcing strict canonical rules
- Single absolute canonical per page
- Handles categories, pagination, subdomains, and multisite

### Robots & Indexing
- Robots.txt editor (Premium)
- Per-page indexing controls (noindex, nofollow)
- Crawl settings to manage bot access
- Bot Blocker for AI crawlers: GPTBot, CCBot, Google-Extended (Premium)

### Redirects
- Redirect manager for handling URL changes (Premium)
- Automatic redirect suggestions when URLs change

---

## Structured Data & Schema

### Automatic Schema Implementation
- **WebPage** schema on all pages
- **Article** schema on all posts
- Builds a **connected schema graph** for the entire site
- Organization/Person schema based on site representation settings

### Supported Schema Types
- Article / BlogPosting / NewsArticle
- WebPage
- Organization / Person
- FAQ (via Gutenberg block)
- HowTo (via Gutenberg block)
- Breadcrumbs
- SearchAction (sitelinks searchbox)

### Schema Best Practices (per Yoast)
- Schema doesn't directly boost rankings but increases click-through rates via rich snippets
- Use JSON-LD format (recommended by both Yoast and Google)
- Set site representation (Organization vs. Person) in Yoast settings
- Logo must be provided for Organization schema
- Extensible platform allows developers to add custom schema types

---

## Content SEO Best Practices

### Keyword Research
- Use the same words your audience uses (don't assume terminology)
- Consider **search intent**: informational, navigational, transactional, commercial
- Use **long-tail keywords** for less competitive, more targeted traffic
- Yoast Premium supports **related keyphrases** and **synonyms** for diversified optimization
- Premium recognizes **word forms** (singular/plural, verb conjugations)

### Content Structure
- Use the **inverted pyramid**: key information first, then supporting detail
- Structure content with clear **heading hierarchy** (H1 > H2 > H3)
- Keep paragraphs short and scannable
- Use **lists, tables, and highlighted snippets** for featured snippet eligibility
- Write **concise, unique, value-packed content** - trim fluff

### Optimize for AI & Featured Snippets
- Provide **clear, concise definitions** at the top of articles
- Use **structured formatting** (lists, bullet points, tables)
- Write content that is easy for AI systems to extract and summarize
- Audit content for **AI retrieval** (how well can AI systems cite your content)

### Content Formats
- Diversify beyond text: add **videos, graphics, podcasts, downloadable checklists**
- Repurpose content across formats
- Video and multimedia improve engagement and time on page

### E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
- Build genuine **brand authority**
- Demonstrate **first-hand experience** with topics
- Ensure content comes from **credible, knowledgeable sources**
- A strong human brand is one of the best ways to stand out

---

## 2026 SEO Predictions from Yoast

### Key Shifts

1. **Visibility beyond rankings** - SEO is now about being understood by AI-driven systems, not just ranking in traditional SERPs
2. **Structure for machine readability** - Well-structured, semantically clear content is easier for AI to extract, summarize, and reuse
3. **Rankings still matter** - AI agents and search systems still rely on top-ranked, trusted pages to determine authority and relevance
4. **Structured data is essential** - Required for eligibility in AI-driven search and shopping experiences
5. **Editorial quality meets machine readability** - AI evaluates content based on structure and clarity
6. **Concise writing wins** - Shorter, focused content works best for AI synthesis
7. **Audit for AI retrieval** - Use tools like Yoast's Brand Insights to track AI citations

### What Hasn't Changed
- Technical health remains non-negotiable
- Helpful content is still the foundation
- Strong SEO fundamentals are required
- Content quality, uniqueness, and value remain the primary ranking factors

---

## Sources

- [Yoast SEO Analysis Features](https://yoast.com/features/seo-analysis/)
- [Yoast Readability Analysis Features](https://yoast.com/features/readability-analysis/)
- [How to Use Yoast SEO Content Analysis](https://yoast.com/use-content-analysis-yoast-seo/)
- [Yoast Structured Data Guide](https://yoast.com/structured-data-schema-ultimate-guide/)
- [Yoast Meta Descriptions Guide](https://yoast.com/meta-descriptions/)
- [Yoast Content SEO Ultimate Guide](https://yoast.com/ultimate-guide-content-seo/)
- [Yoast 2026 SEO Predictions](https://yoast.com/2026-seo-predictions-by-yoast-experts/)
- [Yoast 15 SEO Tips](https://yoast.com/15-years-yoast-seo-tips/)
- [Yoast SEO Scoring Documentation (GitHub)](https://github.com/Yoast/wordpress-seo/blob/trunk/packages/yoastseo/src/scoring/assessments/SCORING%20SEO.md)
- [Yoast Readability Scoring Documentation (GitHub)](https://github.com/Yoast/wordpress-seo/blob/trunk/packages/yoastseo/src/scoring/assessments/SCORING%20READABILITY.md)
