# The SEO Framework - Best Practices & Rules

> Source: [The SEO Framework](https://theseoframework.com/) - Automated, lightweight WordPress SEO plugin.
> Last updated: February 2026

## Table of Contents

- [Philosophy](#philosophy)
- [Development Rules](#development-rules)
- [Automated SEO Features](#automated-seo-features)
- [Title Optimization](#title-optimization)
- [Meta Description Management](#meta-description-management)
- [Canonical URL Management](#canonical-url-management)
- [Structured Data & Schema](#structured-data--schema)
- [Social Meta (Open Graph & Twitter)](#social-meta-open-graph--twitter)
- [Robots & Indexing Controls](#robots--indexing-controls)
- [Automated Protections](#automated-protections)
- [Setup Best Practices](#setup-best-practices)
- [Content Guidelines](#content-guidelines)

---

## Philosophy

The SEO Framework (TSF) positions itself as "the fastest and only feature-complete SEO plugin that follows the guidelines and rules imposed by WordPress and search engines." Its core belief is that **SEO should be automated and effortless** - the plugin does the heavy lifting so users don't need to be SEO experts.

Key principles:
- **Automation first**: Configure once, let the plugin handle the rest
- **Minimal footprint**: Lightning-fast code, even at the cost of readability
- **No feature gating**: Never lock out features or trim functionality for monetization
- **No known bugs shipped**: Considers it unethical to use users' environments as testing facilities
- **Privacy-focused**: No tracking, no ads, no upsell nags

---

## Development Rules

The SEO Framework team follows strict development principles:

1. **Conform to Google's best practices** - first and foremost
2. **Always use the WordPress API** - when storing or retrieving information
3. **Focus on lightning-fast code** - performance is paramount
4. **Set deadlines on features, not on releases** - quality over speed
5. **Never lock out features for monetization** - ethical approach
6. **Never release software with known bugs** - thorough testing required

---

## Automated SEO Features

### What TSF Automates (Out of the Box)
The plugin automatically handles:

| Feature | What It Does |
|---------|-------------|
| **Title generation** | Creates optimized titles based on page content and site settings |
| **Description generation** | Auto-generates meta descriptions from content |
| **Canonical URLs** | Sets correct canonical for every page type |
| **Robots meta tags** | Generates appropriate index/noindex, follow/nofollow directives |
| **Open Graph tags** | Outputs Facebook/social sharing metadata |
| **Twitter Card tags** | Outputs Twitter-specific sharing metadata |
| **Structured data** | Adds Organization/Person schema automatically |
| **XML Sitemap** | Generates and maintains sitemap with automatic notifications |
| **Breadcrumbs** | Schema-enhanced breadcrumb output |

### Pre-Configured on Activation
- All pages automatically optimized for SEO and social networks
- Reads WordPress environment to determine optimal settings
- **Only 4-10 settings** typically need manual attention
- No configuration wizard required - works immediately

---

## Title Optimization

### Automatic Title Generation
- Supports **114+ languages** out of the box
- Automatically generates titles from page/post titles
- Handles title structure (separator, site name position)
- **Title Fix** feature: corrects title output even if the theme does it wrong

### Pixel Counter System
- Uses a **colored pixel counter** (not just character count) to measure title width
- Calculates the actual pixel width as displayed on Google's SERPs
- **Green** = title fits well in Google results
- **Orange/Red** = title may be truncated

### Title Best Practices (per TSF)
- **Brand your titles** - include your site name
- Only use the "blog name removal" option if you plan to reinsert it manually
- Title should **describe the page in a few words**
- Make titles **inviting** but not misleading
- Keep the **pixel counter green** for best Google results
- Focus on pixel width rather than character count alone

---

## Meta Description Management

### Auto-Generation
- Automatically generates descriptions from page content
- Users can override with custom descriptions
- Character counter provided as a guideline

### Pixel vs. Character Counters
| Context | Counter Type | Weight |
|---------|-------------|--------|
| **Meta Title** | Pixel counter | Pixel width is the **rule** (green = good) |
| **Meta Description** | Character counter | Character count is a **guideline** |
| **Social Meta** | Character counter | Character count is the **rule** |

---

## Canonical URL Management

### Automatic Canonical Prevention
TSF prevents canonical errors for:
- **Categories** and archives
- **Pages** and posts
- **Subdomains**
- **WordPress Multisite** domain mapping
- **Pagination** (prevents pagination exploits)

### Real-Time Canonical Preview
- See the canonical URL **in real-time** while editing (not just after saving)
- Displays as a placeholder based on permalink settings
- Stored in memory to avoid redundant lookups

### Canonical URL Scheme
- Users can choose their preferred canonical URL scheme (http/https)
- Link relationship settings to prevent duplicated content
- Handles www vs. non-www correctly

---

## Structured Data & Schema

### Automatic Schema Output
- **Organization** or **Person** schema based on site representation settings
- **WebPage** schema on all pages
- **Article** schema on posts
- **BreadcrumbList** schema for navigation
- **SearchAction** schema for sitelinks

### Configuration Requirements
| Setting | Requirement |
|---------|------------|
| **Site Representation** | Set whether site represents Organization or Person |
| **Name** | Set the organization/person name |
| **Logo** | Must be at least 112x112 pixels; .jpg, .png, or .gif accepted |

---

## Social Meta (Open Graph & Twitter)

### Open Graph Settings
- Toggle output of Open Graph meta tags (on/off)
- Include/exclude site title in social media titles
- Allow multiple images for social sharing
- **Social Image Fallback**: Set a default image used when pages don't have their own
  - Should be "beautiful and inviting, high-resolution"
  - Prevents pages from looking like spam when shared
- Facebook App ID, publisher page, and author fallback settings

### Twitter Card Settings
- Choose default card format:
  - **Summary** (small image)
  - **Summary with Large Image** (large featured image)
- Set site and author Twitter profiles
- Custom per-page Twitter title, description, and image

### Supported Platforms
Open Graph output works across:
- Facebook
- LinkedIn
- Pinterest
- Discord
- WhatsApp
- And other platforms that read OG tags

---

## Robots & Indexing Controls

### Automatic Robot Directives
TSF intelligently manages which pages should and shouldn't be indexed:

| Action | What TSF Does |
|--------|-------------|
| **404 pages** | Automatically discouraged from indexing |
| **Empty categories** | Automatically discouraged from indexing |
| **Feed pages** | Search engines directed away from feeds |
| **Sitemap pages** | Discouraged from being indexed directly |
| **Comment pages** | Redirects search engines back to the parent post |

### Advanced Visibility Settings
- Per-page **noindex**, **nofollow**, **noarchive** controls
- Directives are followed by Googlebot and Bingbot "like law"
- Can "deoptimize" a page to boost another's rankings
- Only modify these if you understand the implications

---

## Automated Protections

TSF includes several behind-the-scenes protections:

### Duplicate Content Prevention
- Enforces strict canonical rules across all page types
- Handles edge cases: categories, subdomains, multisite, pagination

### Anti-SEO Attack Measures
- Stops SEO attacks caused by **pagination exploits**
- Prevents manipulation via query string variations

### Automatic Notifications
- Notifies **Google and Bing** on website updates (when sitemaps enabled)
- Ensures search engines discover new/updated content promptly

### Smart Defaults
- Leaves **little room for SEO mistakes**
- The plugin "already does everything SEO for you"
- Only advanced users should change visibility/indexing settings

---

## Setup Best Practices

### Recommended Setup Steps

1. **Activate and leave defaults** - TSF is pre-configured optimally
2. **Homepage Settings** (General tab):
   - Confirm title contains only your brand name
   - Pixel counter should not be red
3. **Social Image Fallback**:
   - Set a high-resolution, inviting image via "Select Image"
   - This prevents shared pages without images from looking like spam
4. **Schema Settings** (Presence tab):
   - Set Organization or Person
   - Set name
   - Select logo (min 112x112 pixels)
5. **Don't touch what you don't understand** - TSF has already optimized the defaults

### What NOT to Do
- Don't change settings you're unsure about
- Don't remove the blog name from titles without reinserting it
- Don't modify robots/visibility settings unless you know the implications
- Don't install additional SEO plugins alongside TSF

---

## Content Guidelines

### TSF's Approach to Content
Unlike Yoast and Rank Math, TSF does **not** include a content analysis or scoring system. Its philosophy is that:

- Content quality is a **human judgment**, not a plugin's job
- SEO plugins should handle **technical optimization** (meta tags, schema, sitemaps, canonical)
- Writers should focus on **quality writing** without chasing plugin scores
- The plugin handles the technical SEO so you can focus on content

### Recommended Content Practices
While TSF doesn't enforce content rules, the underlying Google best practices still apply:

1. Write clear, helpful, people-first content
2. Use proper heading hierarchy (H1 > H2 > H3)
3. Include relevant images with alt text
4. Link to related internal and external content
5. Make content scannable with short paragraphs and lists
6. Demonstrate E-E-A-T in your writing
7. Match content to search intent

---

## TSF vs. Other SEO Plugins

| Feature | TSF | Yoast | Rank Math | AIOSEO |
|---------|-----|-------|-----------|--------|
| Content scoring | No | Yes | Yes | Yes |
| Auto-configuration | Full | Partial | Wizard | Wizard |
| Schema markup | Basic (auto) | Moderate | Extensive | Extensive |
| Social meta | Full | Full | Full | Full |
| XML sitemap | Yes | Yes | Yes | Yes |
| Redirects | Extension | Premium | Yes | Pro |
| Performance focus | Primary | Secondary | Secondary | Secondary |
| Privacy focus | Primary | Secondary | Secondary | Secondary |
| Price (Pro) | ~$7/mo | $99/yr | $59/yr | $49.60/yr |

---

## Sources

- [The SEO Framework Official Site](https://theseoframework.com/)
- [The SEO Framework WordPress Plugin Page](https://wordpress.org/plugins/autodescription/)
- [First-Time Setup Instructions](https://theseoframework.com/docs/seo-plugin-setup/)
- [How to Improve Your Pages with TSF](https://theseoframework.com/docs/improve-your-pages/)
- [About The SEO Framework](https://theseoframework.com/about-us/)
- [TSF Review - WP Marmite](https://wpmarmite.com/en/the-seo-framework/)
- [TSF Review - Nick Schäferhoff](https://nickschaeferhoff.com/the-seo-framework-review/)
- [TSF Review - FatLab Web Support](https://fatlabwebsupport.com/blog/website-optimization/the-seo-framework-review/)
- [TSF GitHub Repository](https://github.com/sybrew/the-seo-framework)
