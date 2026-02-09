# SEO Documentation

A comprehensive collection of state-of-the-art SEO best practices, rules, and guidelines from the most authoritative sources in the industry. Each source is documented in a separate file to allow comparison and traceability, especially when rules conflict.

## Sources

### WordPress SEO Plugins

| File | Source | Focus |
|------|--------|-------|
| [yoast-seo.md](yoast-seo.md) | **Yoast SEO** | 15+ on-page checks, readability analysis, Flesch score, schema, 2026 predictions |
| [aioseo.md](aioseo.md) | **All in One SEO** | TruSEO 70+ factor scoring, site audit, Link Assistant, E-E-A-T features |
| [rank-math.md](rank-math.md) | **Rank Math** | 21 SEO tests, 100-point scoring, Content AI, 23+ schema types, smart linking |
| [seopress.md](seopress.md) | **SEOPress** | 13-point site audit, instant indexing, privacy-focused, image SEO |
| [the-seo-framework.md](the-seo-framework.md) | **The SEO Framework** | Automation-first approach, pixel-based title measurement, zero-config setup |

### Industry Authority Sources

| File | Source | Focus |
|------|--------|-------|
| [google-search-central.md](google-search-central.md) | **Google Search Central** | Official Google guidelines, E-E-A-T, structured data, Core Web Vitals, spam policies |
| [moz.md](moz.md) | **Moz** | Domain Authority, link building, keyword research, technical SEO fundamentals |
| [ahrefs.md](ahrefs.md) | **Ahrefs** | On-page checklist, 82-point AI+SEO checklist, content optimization, backlink analysis |

## Quick Comparison: Key Rules Across Sources

### Title Tag

| Source | Max Length | Keyword Position | Other Rules |
|--------|----------|-----------------|-------------|
| Yoast | Pixel-based (green bar) | Should be present | Single H1 check |
| AIOSEO | 40-60 characters | At the beginning | Exact match required |
| Rank Math | Not specified | At the beginning (test #2) | Include power/sentiment words and numbers |
| SEOPress | Character-based | Should be present | AI generation available |
| TSF | Pixel counter (green = good) | Auto-generated | Brand name recommended |
| Google | ~50-60 characters | Near the beginning | Must be unique per page |
| Moz | Under 60 characters | Near the beginning | Include brand when space allows |
| Ahrefs | Not strict | Present in title | Use Site Audit to find issues |

### Meta Description

| Source | Length | Keyword Requirement | Notes |
|--------|--------|-------------------|-------|
| Yoast | ~155 characters (pixel-based) | 1-2 occurrences max | Red if missing or no keyword |
| AIOSEO | Not specified | Exact match required | Part of Basic SEO checks |
| Rank Math | Under 160 characters | Must be present | Part of the 21 tests |
| SEOPress | Character-based | Should be present | AI generation available (Pro) |
| TSF | Character counter (guideline) | Auto-generated | Pixel counter for titles, character for descriptions |
| Google | ~155 characters | Not required | Not a ranking factor; affects CTR |
| Moz | Under 155 characters | Include naturally | Include call to action |
| Ahrefs | ~155 characters | Include for bold in SERP | Google uses it 37.22% of the time |

### Minimum Content Length

| Source | Standard Content | Cornerstone/Long-form | Notes |
|--------|-----------------|----------------------|-------|
| Yoast | 300 words | 900 words | Japanese: 600/1800 characters |
| AIOSEO | 300 words | Not specified | Minimum for check to pass |
| Rank Math | 600 words | 2,500+ words | Higher word count = higher score |
| SEOPress | Not enforced | Not specified | Content analysis check |
| TSF | No minimum | No minimum | Does not include content scoring |
| Google | No minimum | No minimum | Quality over quantity |
| Moz | No minimum | Comprehensive coverage | Match competitor depth |
| Ahrefs | No minimum | Cover topic fully | Don't add fluff for length |

### Readability Analysis

| Source | Flesch Score Target | Passive Voice Limit | Transition Words Min | Sentence Length |
|--------|-------------------|--------------------|--------------------|----------------|
| Yoast | 60+ (green) | < 10% | 30%+ of sentences | Max 25% over 20 words |
| AIOSEO | Flesch-Kincaid test | Minimize | Use recommended | Short sentences preferred |
| Rank Math | Not scored | Not tested | Not tested | Short paragraphs (test #21) |
| SEOPress | Not scored | Not tested | Not tested | Not tested |
| TSF | Not scored | Not tested | Not tested | Not tested |

### Schema/Structured Data

| Source | Auto Schema | Schema Types | Builder |
|--------|-----------|-------------|---------|
| Yoast | WebPage, Article | ~8 types | Via Gutenberg blocks |
| AIOSEO | Based on content type | 20+ types | Custom builder (Pro) |
| Rank Math | Based on content type | 23+ types (free) | Advanced Schema Builder (Pro) |
| SEOPress | Based on post type | 14+ types | JSON-LD support |
| TSF | Organization/Person, WebPage | Basic (auto) | No manual builder |
| Google | N/A (documentation) | 30+ rich result types | JSON-LD recommended |

## Notable Conflicts Between Sources

### Content Length
- **Rank Math** strongly pushes for 2,500+ words for maximum score
- **Google** and **Ahrefs** say there is no minimum; focus on answering the query
- **Yoast** has a modest 300-word minimum (900 for cornerstone)

### Content Scoring
- **TSF** explicitly does not score content, believing it's a human judgment
- **Yoast**, **AIOSEO**, and **Rank Math** all provide numerical scores
- **Google** warns against optimizing for plugin scores rather than users

### Keyword Density
- **Rank Math** includes a keyword density test
- **Google** explicitly warns against keyword stuffing
- **Ahrefs** recommends natural usage without specific density targets

### Title Measurement
- **Yoast** and **TSF** use pixel-based measurement (more accurate for Google display)
- **AIOSEO** and **Rank Math** use character count
- **Google's actual limit** is pixel-based, not character-based

### SEO Score Philosophy
- **Rank Math**: "Treat it only as a to-do list, nothing more"
- **AIOSEO**: "Recommendations only, based on best practices"
- **Yoast**: "Not every light needs to be green"
- **TSF**: No score at all - automation handles technical SEO
