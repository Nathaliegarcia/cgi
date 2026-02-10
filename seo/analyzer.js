/**
 * SEO Analyzer
 * Audits webpages against 40+ SEO best practices from industry-leading sources.
 */

(function() {
    'use strict';

    // DOM Elements
    var urlInput = document.getElementById('url-input');
    var analyzeBtn = document.getElementById('analyze-btn');
    var clearBtn = document.getElementById('clear-btn');
    var progressSection = document.getElementById('progress-section');
    var progressFill = document.getElementById('progress-fill');
    var progressText = document.getElementById('progress-text');
    var resultsSection = document.getElementById('results-section');
    var singleResult = document.getElementById('single-result');
    var resultsTable = document.getElementById('results-table');
    var resultsTbody = document.getElementById('results-tbody');
    var downloadAllBtn = document.getElementById('download-all-btn');
    var errorSection = document.getElementById('error-section');
    var errorMessage = document.getElementById('error-message');
    var modal = document.getElementById('modal');
    var modalTitle = document.getElementById('modal-title');
    var modalBody = document.getElementById('modal-body');
    var modalClose = document.getElementById('modal-close');

    var analysisResults = [];

    // ========================================================
    // RULES DEFINITIONS
    // Each rule has: id, name, category, source, weight,
    //   check(doc, url, html, meta) -> { pass, value, message, fix }
    // ========================================================

    var SEO_RULES = [
        // ---- META & TITLE ----
        {
            id: 'title-present',
            name: 'Page has a title tag',
            category: 'Meta & Title',
            source: 'Google, Yoast, AIOSEO, Rank Math',
            weight: 10,
            check: function(doc) {
                var el = doc.querySelector('title');
                var title = el ? el.textContent.trim() : '';
                if (!title) return { pass: false, value: 'Missing', message: 'No <title> tag found on the page.', fix: 'Add a unique, descriptive <title> tag inside <head>.' };
                return { pass: true, value: title, message: 'Title tag is present.' };
            }
        },
        {
            id: 'title-length',
            name: 'Title length is optimal (30-60 characters)',
            category: 'Meta & Title',
            source: 'Yoast, Moz, AIOSEO',
            weight: 7,
            check: function(doc) {
                var el = doc.querySelector('title');
                var title = el ? el.textContent.trim() : '';
                if (!title) return { pass: false, value: '0 chars', message: 'No title to measure.', fix: 'Add a title tag with 30-60 characters.' };
                var len = title.length;
                if (len < 30) return { pass: false, value: len + ' chars', message: 'Title is too short (' + len + ' chars). Titles under 30 characters may not be descriptive enough.', fix: 'Expand the title to at least 30 characters. Include your primary keyword and brand.' };
                if (len > 60) return { pass: false, value: len + ' chars', message: 'Title is too long (' + len + ' chars). Google will truncate titles over ~60 characters.', fix: 'Shorten the title to 60 characters or less. Focus on the most important keywords first.' };
                return { pass: true, value: len + ' chars', message: 'Title length is within the recommended range.' };
            }
        },
        {
            id: 'meta-description-present',
            name: 'Meta description is present',
            category: 'Meta & Title',
            source: 'Google, Yoast, AIOSEO, Rank Math, SEOPress',
            weight: 8,
            check: function(doc) {
                var el = doc.querySelector('meta[name="description"]');
                var desc = el ? el.getAttribute('content') : '';
                if (!desc || !desc.trim()) return { pass: false, value: 'Missing', message: 'No meta description found.', fix: 'Add <meta name="description" content="..."> in the <head>. Write a compelling 120-155 character summary that includes your target keyword.' };
                return { pass: true, value: desc.trim(), message: 'Meta description is present.' };
            }
        },
        {
            id: 'meta-description-length',
            name: 'Meta description length is optimal (120-160 characters)',
            category: 'Meta & Title',
            source: 'Yoast, Moz, Rank Math, AIOSEO',
            weight: 5,
            check: function(doc) {
                var el = doc.querySelector('meta[name="description"]');
                var desc = el ? (el.getAttribute('content') || '').trim() : '';
                if (!desc) return { pass: false, value: '0 chars', message: 'No meta description to measure.', fix: 'Add a meta description of 120-160 characters.' };
                var len = desc.length;
                if (len < 120) return { pass: false, value: len + ' chars', message: 'Meta description is short (' + len + ' chars). It may not provide enough context for searchers.', fix: 'Expand the description to at least 120 characters. Include a call to action and target keyword.' };
                if (len > 160) return { pass: false, value: len + ' chars', message: 'Meta description is too long (' + len + ' chars). Google will truncate it.', fix: 'Shorten to 160 characters or fewer. Put the most compelling information first.' };
                return { pass: true, value: len + ' chars', message: 'Meta description length is optimal.' };
            }
        },
        {
            id: 'meta-viewport',
            name: 'Viewport meta tag is set',
            category: 'Meta & Title',
            source: 'Google, Moz',
            weight: 8,
            check: function(doc) {
                var el = doc.querySelector('meta[name="viewport"]');
                if (!el) return { pass: false, value: 'Missing', message: 'No viewport meta tag found. Page may not display correctly on mobile.', fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> in the <head>.' };
                return { pass: true, value: el.getAttribute('content'), message: 'Viewport meta tag is set.' };
            }
        },
        {
            id: 'charset-declared',
            name: 'Character encoding is declared',
            category: 'Meta & Title',
            source: 'Google',
            weight: 4,
            check: function(doc, url, html) {
                var el = doc.querySelector('meta[charset]');
                var httpEquiv = doc.querySelector('meta[http-equiv="Content-Type"]');
                if (el || httpEquiv) return { pass: true, value: el ? el.getAttribute('charset') : 'via http-equiv', message: 'Character encoding is declared.' };
                return { pass: false, value: 'Missing', message: 'No character encoding declaration found.', fix: 'Add <meta charset="UTF-8"> as the first element in <head>.' };
            }
        },
        {
            id: 'canonical-url',
            name: 'Canonical URL is set',
            category: 'Meta & Title',
            source: 'Google, Yoast, The SEO Framework, Ahrefs',
            weight: 7,
            check: function(doc) {
                var el = doc.querySelector('link[rel="canonical"]');
                if (!el || !el.getAttribute('href')) return { pass: false, value: 'Missing', message: 'No canonical URL found. This can lead to duplicate content issues.', fix: 'Add <link rel="canonical" href="https://yoursite.com/this-page"> in the <head>. Every indexable page should have a self-referencing canonical.' };
                return { pass: true, value: el.getAttribute('href'), message: 'Canonical URL is set.' };
            }
        },
        {
            id: 'lang-attribute',
            name: 'HTML lang attribute is set',
            category: 'Meta & Title',
            source: 'Google, Moz',
            weight: 4,
            check: function(doc) {
                var html = doc.querySelector('html');
                var lang = html ? html.getAttribute('lang') : '';
                if (!lang) return { pass: false, value: 'Missing', message: 'No lang attribute on <html>. This helps search engines understand the page language.', fix: 'Add lang="en" (or appropriate language code) to the <html> tag.' };
                return { pass: true, value: lang, message: 'Language attribute is set.' };
            }
        },

        // ---- HEADINGS ----
        {
            id: 'h1-present',
            name: 'Page has an H1 heading',
            category: 'Headings',
            source: 'Yoast, Rank Math, AIOSEO, SEOPress, Google',
            weight: 9,
            check: function(doc) {
                var h1s = doc.querySelectorAll('h1');
                if (h1s.length === 0) return { pass: false, value: '0 found', message: 'No H1 heading found. The H1 is the primary heading and tells search engines the main topic.', fix: 'Add a single H1 heading that clearly describes the page topic. Include your primary keyword.' };
                return { pass: true, value: h1s[0].textContent.trim().substring(0, 80), message: 'H1 heading is present.' };
            }
        },
        {
            id: 'single-h1',
            name: 'Only one H1 heading on the page',
            category: 'Headings',
            source: 'Yoast, Rank Math, SEOPress',
            weight: 5,
            check: function(doc) {
                var h1s = doc.querySelectorAll('h1');
                if (h1s.length === 0) return { pass: false, value: '0 H1s', message: 'No H1 found.', fix: 'Add exactly one H1 heading.' };
                if (h1s.length > 1) return { pass: false, value: h1s.length + ' H1s', message: 'Multiple H1 tags found (' + h1s.length + '). Best practice is a single H1 per page.', fix: 'Keep only one H1 tag. Convert others to H2 or H3.' };
                return { pass: true, value: '1 H1', message: 'Single H1 heading present.' };
            }
        },
        {
            id: 'heading-hierarchy',
            name: 'Heading hierarchy is logical (no skipped levels)',
            category: 'Headings',
            source: 'Google, Yoast, Moz',
            weight: 4,
            check: function(doc) {
                var headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
                if (headings.length === 0) return { pass: false, value: 'No headings', message: 'No headings found at all.', fix: 'Add headings to structure your content. Start with H1, then H2 for sections, H3 for subsections.' };
                var levels = [];
                for (var i = 0; i < headings.length; i++) {
                    levels.push(parseInt(headings[i].tagName.charAt(1)));
                }
                var skips = [];
                for (var j = 1; j < levels.length; j++) {
                    if (levels[j] > levels[j - 1] + 1) {
                        skips.push('H' + levels[j - 1] + ' -> H' + levels[j]);
                    }
                }
                if (skips.length > 0) return { pass: false, value: skips.join(', '), message: 'Heading hierarchy skips levels: ' + skips.join(', ') + '. This confuses search engines about content structure.', fix: 'Ensure headings follow a logical order: H1 > H2 > H3 > H4. Do not skip from H2 directly to H4.' };
                return { pass: true, value: levels.length + ' headings, logical order', message: 'Heading hierarchy is logical.' };
            }
        },
        {
            id: 'subheadings-present',
            name: 'Content uses subheadings (H2/H3)',
            category: 'Headings',
            source: 'Yoast, Rank Math',
            weight: 5,
            check: function(doc) {
                var h2s = doc.querySelectorAll('h2');
                var h3s = doc.querySelectorAll('h3');
                var total = h2s.length + h3s.length;
                if (total === 0) return { pass: false, value: '0 subheadings', message: 'No H2/H3 subheadings found. Long content without subheadings is hard to scan.', fix: 'Break content into sections using H2 headings. Use H3 for sub-sections within each H2 section.' };
                return { pass: true, value: h2s.length + ' H2, ' + h3s.length + ' H3', message: 'Subheadings are used to structure content.' };
            }
        },

        // ---- CONTENT ----
        {
            id: 'content-length',
            name: 'Content has sufficient word count (300+ words)',
            category: 'Content',
            source: 'Yoast, AIOSEO, Rank Math',
            weight: 7,
            check: function(doc) {
                var body = doc.querySelector('main, article, [role="main"], .content') || doc.body;
                if (!body) return { pass: false, value: '0 words', message: 'Could not find page content.', fix: 'Ensure the page has substantial text content.' };
                var clone = body.cloneNode(true);
                var remove = clone.querySelectorAll('script, style, nav, header, footer, aside, noscript');
                for (var i = 0; i < remove.length; i++) remove[i].remove();
                var text = clone.textContent || '';
                var words = text.trim().split(/\s+/).filter(function(w) { return w.length > 0; }).length;
                if (words < 300) return { pass: false, value: words + ' words', message: 'Content is thin (' + words + ' words). Pages with fewer than 300 words are unlikely to rank well.', fix: 'Expand the content to at least 300 words. For competitive topics, aim for 1500-2500+ words (Rank Math). Cover the topic comprehensively.' };
                return { pass: true, value: words + ' words', message: 'Content has sufficient length.' };
            }
        },
        {
            id: 'paragraphs-not-too-long',
            name: 'Paragraphs are not too long (under 150 words)',
            category: 'Content',
            source: 'Yoast',
            weight: 3,
            check: function(doc) {
                var paragraphs = doc.querySelectorAll('p');
                var longCount = 0;
                var longest = 0;
                for (var i = 0; i < paragraphs.length; i++) {
                    var words = paragraphs[i].textContent.trim().split(/\s+/).length;
                    if (words > longest) longest = words;
                    if (words > 150) longCount++;
                }
                if (longCount > 0) return { pass: false, value: longCount + ' long paragraph(s), longest: ' + longest + ' words', message: longCount + ' paragraph(s) exceed 150 words. Long paragraphs reduce readability.', fix: 'Break long paragraphs into shorter ones (under 150 words each). Use subheadings, bullet points, and lists.' };
                return { pass: true, value: 'All under 150 words (longest: ' + longest + ')', message: 'All paragraphs are reasonable length.' };
            }
        },

        // ---- IMAGES ----
        {
            id: 'images-have-alt',
            name: 'All images have alt attributes',
            category: 'Images',
            source: 'Google, Yoast, AIOSEO, Rank Math, SEOPress, Ahrefs',
            weight: 7,
            check: function(doc) {
                var images = doc.querySelectorAll('img');
                if (images.length === 0) return { pass: true, value: 'No images', message: 'No images found on the page.' };
                var missing = 0;
                var missingExamples = [];
                for (var i = 0; i < images.length; i++) {
                    var alt = images[i].getAttribute('alt');
                    if (alt === null || alt.trim() === '') {
                        missing++;
                        if (missingExamples.length < 3) {
                            missingExamples.push(images[i].getAttribute('src') || '(no src)');
                        }
                    }
                }
                if (missing > 0) return { pass: false, value: missing + '/' + images.length + ' missing alt', message: missing + ' of ' + images.length + ' images lack alt text. Examples: ' + missingExamples.join(', '), fix: 'Add descriptive alt text to all images. Describe what the image shows. Include relevant keywords naturally.' };
                return { pass: true, value: images.length + ' images, all have alt', message: 'All images have alt attributes.' };
            }
        },
        {
            id: 'images-present',
            name: 'Page contains at least one image',
            category: 'Images',
            source: 'Rank Math, AIOSEO',
            weight: 3,
            check: function(doc) {
                var images = doc.querySelectorAll('img');
                if (images.length === 0) return { pass: false, value: '0 images', message: 'No images found. Pages with images tend to have better engagement and rankings.', fix: 'Add at least one relevant image. Rank Math recommends 4+ images for full optimization credit.' };
                return { pass: true, value: images.length + ' image(s)', message: 'Page contains images.' };
            }
        },

        // ---- LINKS ----
        {
            id: 'internal-links',
            name: 'Page has internal links',
            category: 'Links',
            source: 'Yoast, AIOSEO, Rank Math, SEOPress, Ahrefs',
            weight: 6,
            check: function(doc, url) {
                var links = doc.querySelectorAll('a[href]');
                var hostname = '';
                try { hostname = new URL(url).hostname; } catch (e) { }
                var internal = 0;
                for (var i = 0; i < links.length; i++) {
                    var href = links[i].getAttribute('href');
                    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) continue;
                    try {
                        var linkHost = new URL(href, url).hostname;
                        if (linkHost === hostname) internal++;
                    } catch (e) {
                        if (href.startsWith('/') || (!href.startsWith('http') && !href.startsWith('//'))) internal++;
                    }
                }
                if (internal === 0) return { pass: false, value: '0 internal links', message: 'No internal links found. Internal links help search engines discover other pages and spread authority.', fix: 'Add links to related pages on your site. Aim for at least 2-3 internal links per page. Use descriptive anchor text.' };
                return { pass: true, value: internal + ' internal link(s)', message: 'Page has internal links.' };
            }
        },
        {
            id: 'external-links',
            name: 'Page has external links',
            category: 'Links',
            source: 'Yoast, AIOSEO, Rank Math',
            weight: 4,
            check: function(doc, url) {
                var links = doc.querySelectorAll('a[href]');
                var hostname = '';
                try { hostname = new URL(url).hostname; } catch (e) { }
                var external = 0;
                for (var i = 0; i < links.length; i++) {
                    var href = links[i].getAttribute('href');
                    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) continue;
                    try {
                        var linkHost = new URL(href, url).hostname;
                        if (linkHost !== hostname) external++;
                    } catch (e) { }
                }
                if (external === 0) return { pass: false, value: '0 external links', message: 'No external links found. Linking to authoritative sources builds trust and provides context.', fix: 'Link to relevant, authoritative external sources where appropriate. At least one outbound link is recommended.' };
                return { pass: true, value: external + ' external link(s)', message: 'Page has external links.' };
            }
        },
        {
            id: 'no-broken-links-format',
            name: 'Links have valid href attributes',
            category: 'Links',
            source: 'SEOPress, Ahrefs',
            weight: 4,
            check: function(doc) {
                var links = doc.querySelectorAll('a[href]');
                var empty = 0;
                for (var i = 0; i < links.length; i++) {
                    var href = links[i].getAttribute('href');
                    if (href === '' || href === '#' && links[i].textContent.trim().length > 0) empty++;
                }
                if (empty > 0) return { pass: false, value: empty + ' empty/placeholder links', message: empty + ' link(s) have empty or placeholder href values.', fix: 'Ensure all links point to valid URLs. Remove or fix placeholder links (#).' };
                return { pass: true, value: 'All links have valid hrefs', message: 'All links have proper href values.' };
            }
        },

        // ---- SOCIAL & OPEN GRAPH ----
        {
            id: 'og-title',
            name: 'Open Graph title is set',
            category: 'Social & OG',
            source: 'Yoast, AIOSEO, The SEO Framework, SEOPress',
            weight: 5,
            check: function(doc) {
                var el = doc.querySelector('meta[property="og:title"]');
                var val = el ? el.getAttribute('content') : '';
                if (!val) return { pass: false, value: 'Missing', message: 'No og:title found. Social shares will use generic or auto-generated titles.', fix: 'Add <meta property="og:title" content="Your Title"> in the <head>.' };
                return { pass: true, value: val, message: 'Open Graph title is set.' };
            }
        },
        {
            id: 'og-description',
            name: 'Open Graph description is set',
            category: 'Social & OG',
            source: 'Yoast, AIOSEO, The SEO Framework, SEOPress',
            weight: 4,
            check: function(doc) {
                var el = doc.querySelector('meta[property="og:description"]');
                var val = el ? el.getAttribute('content') : '';
                if (!val) return { pass: false, value: 'Missing', message: 'No og:description found. Social shares will lack a descriptive summary.', fix: 'Add <meta property="og:description" content="Your Description"> in the <head>.' };
                return { pass: true, value: val, message: 'Open Graph description is set.' };
            }
        },
        {
            id: 'og-image',
            name: 'Open Graph image is set',
            category: 'Social & OG',
            source: 'Yoast, The SEO Framework, SEOPress',
            weight: 5,
            check: function(doc) {
                var el = doc.querySelector('meta[property="og:image"]');
                var val = el ? el.getAttribute('content') : '';
                if (!val) return { pass: false, value: 'Missing', message: 'No og:image found. Pages shared on social media will have no preview image, looking like spam (The SEO Framework).', fix: 'Add <meta property="og:image" content="https://...image.jpg">. Use a high-resolution, inviting image (at least 1200x630px).' };
                return { pass: true, value: val, message: 'Open Graph image is set.' };
            }
        },
        {
            id: 'og-url',
            name: 'Open Graph URL is set',
            category: 'Social & OG',
            source: 'Yoast, AIOSEO',
            weight: 3,
            check: function(doc) {
                var el = doc.querySelector('meta[property="og:url"]');
                var val = el ? el.getAttribute('content') : '';
                if (!val) return { pass: false, value: 'Missing', message: 'No og:url found.', fix: 'Add <meta property="og:url" content="https://yoursite.com/page"> in the <head>.' };
                return { pass: true, value: val, message: 'Open Graph URL is set.' };
            }
        },
        {
            id: 'og-type',
            name: 'Open Graph type is set',
            category: 'Social & OG',
            source: 'Yoast, The SEO Framework',
            weight: 2,
            check: function(doc) {
                var el = doc.querySelector('meta[property="og:type"]');
                var val = el ? el.getAttribute('content') : '';
                if (!val) return { pass: false, value: 'Missing', message: 'No og:type found.', fix: 'Add <meta property="og:type" content="website"> (or "article" for blog posts) in the <head>.' };
                return { pass: true, value: val, message: 'Open Graph type is set.' };
            }
        },
        {
            id: 'twitter-card',
            name: 'Twitter Card meta tags are set',
            category: 'Social & OG',
            source: 'Yoast, AIOSEO, The SEO Framework, SEOPress',
            weight: 3,
            check: function(doc) {
                var el = doc.querySelector('meta[name="twitter:card"]');
                var val = el ? el.getAttribute('content') : '';
                if (!val) return { pass: false, value: 'Missing', message: 'No twitter:card meta tag found. Twitter shares will not display rich card previews.', fix: 'Add <meta name="twitter:card" content="summary_large_image"> in the <head>.' };
                return { pass: true, value: val, message: 'Twitter Card is set.' };
            }
        },

        // ---- TECHNICAL SEO ----
        {
            id: 'doctype-present',
            name: 'HTML doctype is declared',
            category: 'Technical',
            source: 'Google',
            weight: 3,
            check: function(doc, url, html) {
                if (html.trim().toLowerCase().indexOf('<!doctype') === 0) return { pass: true, value: 'Present', message: 'HTML doctype is declared.' };
                return { pass: false, value: 'Missing', message: 'No DOCTYPE declaration found. This can cause browsers to render in quirks mode.', fix: 'Add <!DOCTYPE html> as the very first line of the HTML.' };
            }
        },
        {
            id: 'https-links',
            name: 'No mixed content (HTTP resources on HTTPS page)',
            category: 'Technical',
            source: 'Google, Moz, Ahrefs',
            weight: 6,
            check: function(doc, url) {
                var isHttps = url.startsWith('https://');
                if (!isHttps) return { pass: true, value: 'N/A (HTTP page)', message: 'Page is served over HTTP; mixed content check not applicable.' };
                var resources = doc.querySelectorAll('[src], [href]');
                var mixed = 0;
                var examples = [];
                for (var i = 0; i < resources.length; i++) {
                    var src = resources[i].getAttribute('src') || resources[i].getAttribute('href') || '';
                    if (src.startsWith('http://') && !src.startsWith('http://localhost')) {
                        mixed++;
                        if (examples.length < 3) examples.push(src.substring(0, 60));
                    }
                }
                if (mixed > 0) return { pass: false, value: mixed + ' HTTP resource(s)', message: mixed + ' resource(s) loaded over HTTP on an HTTPS page. Examples: ' + examples.join(', '), fix: 'Change all resource URLs from http:// to https:// or use protocol-relative URLs (//).' };
                return { pass: true, value: 'No mixed content', message: 'All resources use HTTPS.' };
            }
        },
        {
            id: 'meta-robots',
            name: 'Page is not blocked from indexing (no noindex)',
            category: 'Technical',
            source: 'Google, AIOSEO, SEOPress',
            weight: 9,
            check: function(doc) {
                var robotsMeta = doc.querySelector('meta[name="robots"]');
                var googlebotMeta = doc.querySelector('meta[name="googlebot"]');
                var content = '';
                if (robotsMeta) content += robotsMeta.getAttribute('content') || '';
                if (googlebotMeta) content += ' ' + (googlebotMeta.getAttribute('content') || '');
                if (content.toLowerCase().indexOf('noindex') !== -1) return { pass: false, value: 'noindex detected', message: 'Page has a noindex directive. Search engines will NOT index this page.', fix: 'Remove the noindex directive from meta robots if you want this page to appear in search results.' };
                return { pass: true, value: 'Indexable', message: 'Page is not blocked from indexing.' };
            }
        },
        {
            id: 'structured-data',
            name: 'Structured data (JSON-LD) is present',
            category: 'Technical',
            source: 'Google, Yoast, Rank Math, AIOSEO',
            weight: 5,
            check: function(doc) {
                var jsonLd = doc.querySelectorAll('script[type="application/ld+json"]');
                if (jsonLd.length === 0) return { pass: false, value: 'None found', message: 'No JSON-LD structured data found. Structured data helps search engines understand content and enables rich snippets.', fix: 'Add JSON-LD structured data. Common types: Article, Organization, BreadcrumbList, FAQPage, Product. Google recommends JSON-LD format.' };
                var types = [];
                for (var i = 0; i < jsonLd.length; i++) {
                    try {
                        var data = JSON.parse(jsonLd[i].textContent);
                        if (data['@type']) types.push(data['@type']);
                        else if (data['@graph']) {
                            for (var j = 0; j < data['@graph'].length; j++) {
                                if (data['@graph'][j]['@type']) types.push(data['@graph'][j]['@type']);
                            }
                        }
                    } catch (e) { types.push('(parse error)'); }
                }
                return { pass: true, value: types.join(', ') || jsonLd.length + ' block(s)', message: 'Structured data found: ' + types.join(', ') };
            }
        },
        {
            id: 'favicon',
            name: 'Favicon is defined',
            category: 'Technical',
            source: 'Ahrefs, Moz',
            weight: 2,
            check: function(doc) {
                var icon = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
                if (!icon) return { pass: false, value: 'Missing', message: 'No favicon link found. Favicons appear in browser tabs and search results.', fix: 'Add <link rel="icon" href="/favicon.ico"> in the <head>.' };
                return { pass: true, value: icon.getAttribute('href'), message: 'Favicon is defined.' };
            }
        },

        // ---- URL & STRUCTURE ----
        {
            id: 'url-length',
            name: 'URL length is reasonable (under 75 characters)',
            category: 'URL & Structure',
            source: 'Rank Math, Ahrefs, Moz',
            weight: 3,
            check: function(doc, url) {
                var path = '';
                try { path = new URL(url).pathname; } catch (e) { path = url; }
                var len = url.length;
                if (len > 75) return { pass: false, value: len + ' chars', message: 'URL is long (' + len + ' chars). Shorter URLs tend to perform better in search.', fix: 'Keep URLs short and descriptive. Use 3-5 words separated by hyphens. Remove unnecessary parameters.' };
                return { pass: true, value: len + ' chars', message: 'URL length is reasonable.' };
            }
        },
        {
            id: 'url-descriptive',
            name: 'URL uses descriptive words (not IDs or hashes)',
            category: 'URL & Structure',
            source: 'Google, Moz, Ahrefs',
            weight: 3,
            check: function(doc, url) {
                var path = '';
                try { path = new URL(url).pathname; } catch (e) { return { pass: true, value: 'N/A', message: 'Could not parse URL.' }; }
                if (path === '/' || path === '') return { pass: true, value: 'Homepage', message: 'Homepage URL.' };
                if (/\/[a-f0-9]{8,}\/?$/.test(path) || /\/\d+\/?$/.test(path) || /[?&](p|id|page_id)=\d+/.test(url)) {
                    return { pass: false, value: path, message: 'URL appears to use numeric IDs or hashes instead of descriptive words.', fix: 'Use descriptive, keyword-rich slugs: /seo-best-practices/ instead of /p=123 or /a1b2c3d4.' };
                }
                return { pass: true, value: path, message: 'URL uses descriptive words.' };
            }
        },

        // ---- PERFORMANCE & ACCESSIBILITY ----
        {
            id: 'no-render-blocking-in-body',
            name: 'No CSS links in body (render-blocking)',
            category: 'Performance',
            source: 'Google, Ahrefs',
            weight: 3,
            check: function(doc) {
                var bodyLinks = doc.querySelectorAll('body link[rel="stylesheet"]');
                if (bodyLinks.length > 0) return { pass: false, value: bodyLinks.length + ' stylesheet(s) in body', message: bodyLinks.length + ' CSS file(s) loaded in the body, causing render-blocking.', fix: 'Move all <link rel="stylesheet"> tags into the <head> section.' };
                return { pass: true, value: 'Clean', message: 'No render-blocking stylesheets in body.' };
            }
        },
        {
            id: 'inline-styles-minimal',
            name: 'Inline styles are minimal',
            category: 'Performance',
            source: 'Google, Moz',
            weight: 2,
            check: function(doc) {
                var inlineStyled = doc.querySelectorAll('[style]');
                var count = inlineStyled.length;
                if (count > 20) return { pass: false, value: count + ' elements', message: count + ' elements have inline styles. Excessive inline styles increase page size and are harder to maintain.', fix: 'Move inline styles to external CSS files. This improves cacheability and reduces page weight.' };
                return { pass: true, value: count + ' element(s)', message: 'Inline style usage is acceptable.' };
            }
        },

        // ---- E-E-A-T & TRUST SIGNALS ----
        {
            id: 'author-attribution',
            name: 'Author information is present',
            category: 'E-E-A-T & Trust',
            source: 'Google, AIOSEO, Moz',
            weight: 3,
            check: function(doc) {
                var authorMeta = doc.querySelector('meta[name="author"]');
                var authorSchema = doc.querySelector('script[type="application/ld+json"]');
                var authorLink = doc.querySelector('[rel="author"], .author, .byline, [class*="author"]');
                var hasAuthorInSchema = false;
                if (authorSchema) {
                    try {
                        var d = JSON.parse(authorSchema.textContent);
                        if (d.author || (d['@graph'] && JSON.stringify(d['@graph']).indexOf('"author"') !== -1)) hasAuthorInSchema = true;
                    } catch (e) { }
                }
                if (authorMeta || authorLink || hasAuthorInSchema) {
                    var val = authorMeta ? authorMeta.getAttribute('content') : 'Found via markup';
                    return { pass: true, value: val, message: 'Author information is present.' };
                }
                return { pass: false, value: 'Not found', message: 'No author attribution found. Google E-E-A-T guidelines emphasize showing who wrote the content.', fix: 'Add author information via <meta name="author">, a visible byline, or structured data with an "author" property.' };
            }
        },
        {
            id: 'https-page',
            name: 'Page is served over HTTPS',
            category: 'E-E-A-T & Trust',
            source: 'Google, Moz, Ahrefs',
            weight: 8,
            check: function(doc, url) {
                if (url.startsWith('https://')) return { pass: true, value: 'HTTPS', message: 'Page is served securely over HTTPS.' };
                return { pass: false, value: 'HTTP only', message: 'Page is served over HTTP. HTTPS is a confirmed Google ranking signal since 2014.', fix: 'Enable HTTPS with a valid SSL/TLS certificate. Redirect all HTTP traffic to HTTPS.' };
            }
        },

        // ---- SEMANTIC HTML ----
        {
            id: 'semantic-html',
            name: 'Page uses semantic HTML5 elements',
            category: 'Semantic HTML',
            source: 'Google, Moz',
            weight: 3,
            check: function(doc) {
                var semantics = ['main', 'article', 'section', 'nav', 'aside', 'header', 'footer'];
                var found = [];
                for (var i = 0; i < semantics.length; i++) {
                    if (doc.querySelector(semantics[i])) found.push(semantics[i]);
                }
                if (found.length === 0) return { pass: false, value: 'No semantic elements', message: 'No HTML5 semantic elements found (main, article, section, nav, etc.). Semantic markup helps search engines understand page structure.', fix: 'Wrap main content in <main>, use <article> for self-contained content, <nav> for navigation, <header> and <footer> for page regions.' };
                return { pass: true, value: found.join(', '), message: 'Semantic HTML5 elements are used.' };
            }
        },
        {
            id: 'lists-used',
            name: 'Content uses lists (ul/ol) for structured information',
            category: 'Semantic HTML',
            source: 'Rank Math, Ahrefs',
            weight: 2,
            check: function(doc) {
                var body = doc.querySelector('main, article, [role="main"], .content') || doc.body;
                if (!body) return { pass: true, value: 'N/A', message: 'Could not evaluate content area.' };
                var lists = body.querySelectorAll('ul, ol');
                if (lists.length === 0) return { pass: false, value: '0 lists', message: 'No lists found in content. Lists improve readability and can trigger featured snippets.', fix: 'Use <ul> or <ol> for step-by-step instructions, feature lists, or any enumerable content. Structured content ranks better for featured snippets.' };
                return { pass: true, value: lists.length + ' list(s)', message: 'Content uses lists.' };
            }
        },

        // ---- MOBILE & RESPONSIVENESS ----
        {
            id: 'responsive-images',
            name: 'Images use responsive attributes (width/height or CSS)',
            category: 'Mobile & Responsiveness',
            source: 'Google, Ahrefs',
            weight: 3,
            check: function(doc) {
                var images = doc.querySelectorAll('img');
                if (images.length === 0) return { pass: true, value: 'No images', message: 'No images to check.' };
                var missing = 0;
                for (var i = 0; i < images.length; i++) {
                    var hasWidth = images[i].hasAttribute('width') || (images[i].style && images[i].style.width);
                    var hasHeight = images[i].hasAttribute('height') || (images[i].style && images[i].style.height);
                    if (!hasWidth && !hasHeight) missing++;
                }
                if (missing > images.length / 2) return { pass: false, value: missing + '/' + images.length + ' without dimensions', message: missing + ' images lack explicit width/height attributes. This can cause Cumulative Layout Shift (CLS).', fix: 'Add width and height attributes to all <img> tags to prevent layout shift. Example: <img src="..." width="800" height="600" alt="...">.' };
                return { pass: true, value: 'Most images have dimensions', message: 'Images have dimensional attributes, helping prevent layout shift.' };
            }
        },
        {
            id: 'tap-targets',
            name: 'Links and buttons are not too small (mobile-friendly)',
            category: 'Mobile & Responsiveness',
            source: 'Google',
            weight: 2,
            check: function(doc) {
                // Heuristic: check if there are many very short inline links close together
                var links = doc.querySelectorAll('a');
                var tinyLinks = 0;
                for (var i = 0; i < links.length; i++) {
                    var text = links[i].textContent.trim();
                    if (text.length > 0 && text.length < 3 && !links[i].querySelector('img')) tinyLinks++;
                }
                if (tinyLinks > 5) return { pass: false, value: tinyLinks + ' very short links', message: tinyLinks + ' links have very short text (< 3 chars). These may be too small to tap on mobile.', fix: 'Ensure interactive elements are at least 48x48 CSS pixels. Use descriptive link text instead of single characters.' };
                return { pass: true, value: 'OK', message: 'Link text appears adequate for mobile tap targets.' };
            }
        },

        // ---- READABILITY ----
        {
            id: 'sentence-length',
            name: 'Sentences are not excessively long',
            category: 'Readability',
            source: 'Yoast',
            weight: 3,
            check: function(doc) {
                var body = doc.querySelector('main, article, [role="main"], .content') || doc.body;
                if (!body) return { pass: true, value: 'N/A', message: 'Could not evaluate content.' };
                var clone = body.cloneNode(true);
                var rm = clone.querySelectorAll('script, style, nav, header, footer, aside, noscript, code, pre');
                for (var i = 0; i < rm.length; i++) rm[i].remove();
                var text = (clone.textContent || '').trim();
                if (!text) return { pass: true, value: 'No text', message: 'No text content to analyze.' };
                var sentences = text.split(/[.!?]+/).filter(function(s) { return s.trim().length > 10; });
                if (sentences.length === 0) return { pass: true, value: 'N/A', message: 'Not enough sentences to analyze.' };
                var longCount = 0;
                for (var j = 0; j < sentences.length; j++) {
                    var words = sentences[j].trim().split(/\s+/).length;
                    if (words > 20) longCount++;
                }
                var pct = Math.round((longCount / sentences.length) * 100);
                if (pct > 25) return { pass: false, value: pct + '% long sentences (' + longCount + '/' + sentences.length + ')', message: pct + '% of sentences exceed 20 words. Yoast recommends no more than 25%.', fix: 'Break long sentences into shorter ones. Use periods, semicolons, or restructure complex ideas into multiple sentences.' };
                return { pass: true, value: pct + '% long sentences', message: 'Sentence length is within acceptable range.' };
            }
        },

        // ---- INTERNATIONAL SEO ----
        {
            id: 'hreflang',
            name: 'Hreflang tags present (if multilingual)',
            category: 'International',
            source: 'Google, Moz',
            weight: 1,
            check: function(doc) {
                var hreflangs = doc.querySelectorAll('link[rel="alternate"][hreflang]');
                if (hreflangs.length > 0) {
                    var langs = [];
                    for (var i = 0; i < hreflangs.length; i++) {
                        langs.push(hreflangs[i].getAttribute('hreflang'));
                    }
                    return { pass: true, value: langs.join(', '), message: 'Hreflang tags found for: ' + langs.join(', ') };
                }
                return { pass: true, value: 'Not set (may not be needed)', message: 'No hreflang tags found. Only needed for multilingual/multi-regional sites.' };
            }
        }
    ];

    // ========================================================
    // CATEGORIES
    // ========================================================
    var CATEGORIES = [
        'All',
        'Meta & Title',
        'Headings',
        'Content',
        'Images',
        'Links',
        'Social & OG',
        'Technical',
        'URL & Structure',
        'Performance',
        'E-E-A-T & Trust',
        'Semantic HTML',
        'Mobile & Responsiveness',
        'Readability',
        'International'
    ];

    // ========================================================
    // INIT
    // ========================================================
    function init() {
        analyzeBtn.addEventListener('click', handleAnalyze);
        clearBtn.addEventListener('click', handleClear);
        downloadAllBtn.addEventListener('click', handleDownloadAll);
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display !== 'none') closeModal();
        });
    }

    // ========================================================
    // URL PARSING
    // ========================================================
    function parseUrls(input) {
        return input
            .split('\n')
            .map(function(u) { return u.trim(); })
            .filter(function(u) { return u.length > 0; })
            .map(function(u) {
                if (!u.startsWith('http://') && !u.startsWith('https://')) return 'https://' + u;
                return u;
            });
    }

    // ========================================================
    // FETCH URL
    // ========================================================
    function fetchUrl(url) {
        var useLocalProxy = document.getElementById('use-local-proxy').checked;
        if (useLocalProxy) {
            var proxyUrl = '../proxy/proxy.py?url=' + encodeURIComponent(url);
            return fetch(proxyUrl).then(function(r) { return r.json(); }).then(function(data) {
                if (!data.success) throw new Error(data.error || 'Failed to fetch URL');
                return data.html;
            });
        } else {
            var extUrl = 'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent(url);
            return fetch(extUrl).then(function(r) {
                if (!r.ok) throw new Error('Failed to fetch URL: ' + r.status);
                return r.text();
            });
        }
    }

    // ========================================================
    // RUN ANALYSIS
    // ========================================================
    function runAnalysis(html, url) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var results = [];
        var totalWeight = 0;
        var passedWeight = 0;
        var passed = 0;
        var failed = 0;
        var warnings = 0;

        for (var i = 0; i < SEO_RULES.length; i++) {
            var rule = SEO_RULES[i];
            var result;
            try {
                result = rule.check(doc, url, html);
            } catch (e) {
                result = { pass: true, value: 'Error: ' + e.message, message: 'Could not evaluate this rule.' };
            }
            totalWeight += rule.weight;
            if (result.pass) {
                passedWeight += rule.weight;
                passed++;
            } else {
                failed++;
            }
            results.push({
                id: rule.id,
                name: rule.name,
                category: rule.category,
                source: rule.source,
                weight: rule.weight,
                pass: result.pass,
                value: result.value || '',
                message: result.message || '',
                fix: result.fix || ''
            });
        }

        // Sort: failures first (by weight desc), then warnings, then passes
        results.sort(function(a, b) {
            if (a.pass !== b.pass) return a.pass ? 1 : -1;
            return b.weight - a.weight;
        });

        var score = totalWeight > 0 ? Math.round((passedWeight / totalWeight) * 100) : 0;

        return {
            url: url,
            score: score,
            passed: passed,
            failed: failed,
            warnings: warnings,
            total: SEO_RULES.length,
            results: results
        };
    }

    // ========================================================
    // SCORE UTILITIES
    // ========================================================
    function getScoreColor(score) {
        if (score >= 90) return '#4ade80';
        if (score >= 70) return '#a3e635';
        if (score >= 50) return '#facc15';
        if (score >= 30) return '#fb923c';
        return '#f87171';
    }

    function getScoreClass(score) {
        if (score >= 90) return 'score-excellent';
        if (score >= 70) return 'score-good';
        if (score >= 50) return 'score-needs-work';
        if (score >= 30) return 'score-poor';
        return 'score-critical';
    }

    function getScoreLabel(score) {
        if (score >= 90) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Needs Work';
        if (score >= 30) return 'Poor';
        return 'Critical';
    }

    // ========================================================
    // BUILD SCORE RING HTML
    // ========================================================
    function buildScoreRing(score) {
        var color = getScoreColor(score);
        var circumference = 2 * Math.PI * 50;
        var offset = circumference - (score / 100) * circumference;
        return '<div class="score-ring">' +
            '<svg viewBox="0 0 116 116">' +
            '<circle class="ring-bg" cx="58" cy="58" r="50"></circle>' +
            '<circle class="ring-fill" cx="58" cy="58" r="50" style="stroke:' + color + ';stroke-dasharray:' + circumference + ';stroke-dashoffset:' + offset + '"></circle>' +
            '</svg>' +
            '<span class="score-text ' + getScoreClass(score) + '">' + score + '</span>' +
            '<span class="score-label">' + getScoreLabel(score) + '</span>' +
            '</div>';
    }

    // ========================================================
    // BUILD REPORT CARD HTML
    // ========================================================
    function buildReportCard(analysis, showActions) {
        var html = '<div class="report-card">';

        // Header with score + summary
        html += '<div class="report-card-header">';
        html += buildScoreRing(analysis.score);
        html += '<div class="report-url">';
        html += '<h3>' + escapeHtml(analysis.url) + '</h3>';
        html += '<a href="' + escapeHtml(analysis.url) + '" target="_blank" rel="noopener">' + escapeHtml(analysis.url) + '</a>';
        html += '</div>';
        html += '<div class="report-summary">';
        html += '<div class="summary-stat"><div class="stat-value score-excellent">' + analysis.passed + '</div><div class="stat-label">Passed</div></div>';
        html += '<div class="summary-stat"><div class="stat-value score-critical">' + analysis.failed + '</div><div class="stat-label">Failed</div></div>';
        html += '<div class="summary-stat"><div class="stat-value" style="color:#a0a0a0">' + analysis.total + '</div><div class="stat-label">Total</div></div>';
        html += '</div>';
        html += '</div>';

        // Actions bar
        if (showActions) {
            html += '<div class="report-card-actions">';
            html += '<button class="btn btn-small btn-download" onclick="window._seoDownloadReport(\'' + escapeHtml(analysis.url) + '\')">Download Report</button>';
            html += '<button class="btn btn-small btn-copy" id="copy-report-btn" onclick="window._seoCopyReport(\'' + escapeHtml(analysis.url) + '\', this)">Copy Report</button>';
            html += '</div>';
        }

        // Category tabs
        html += '<div class="category-tabs" id="cat-tabs">';
        var categoryCounts = {};
        for (var i = 0; i < analysis.results.length; i++) {
            var cat = analysis.results[i].category;
            if (!categoryCounts[cat]) categoryCounts[cat] = { pass: 0, fail: 0 };
            if (analysis.results[i].pass) categoryCounts[cat].pass++;
            else categoryCounts[cat].fail++;
        }

        for (var c = 0; c < CATEGORIES.length; c++) {
            var catName = CATEGORIES[c];
            var isAll = catName === 'All';
            var countHtml = '';
            if (isAll) {
                countHtml = '<span class="tab-count tab-count-pass">' + analysis.passed + '</span>';
                if (analysis.failed > 0) countHtml += '<span class="tab-count tab-count-fail">' + analysis.failed + '</span>';
            } else if (categoryCounts[catName]) {
                var cc = categoryCounts[catName];
                if (cc.fail > 0) countHtml = '<span class="tab-count tab-count-fail">' + cc.fail + '</span>';
            } else {
                continue; // skip categories with no rules
            }
            html += '<button class="category-tab' + (isAll ? ' active' : '') + '" data-category="' + escapeHtml(catName) + '">' + escapeHtml(catName) + countHtml + '</button>';
        }
        html += '</div>';

        // Rules list
        html += '<div class="rules-container">';

        for (var ci = 0; ci < CATEGORIES.length; ci++) {
            var panelCat = CATEGORIES[ci];
            var isAllPanel = panelCat === 'All';
            html += '<div class="category-panel' + (isAllPanel ? ' active' : '') + '" data-panel="' + escapeHtml(panelCat) + '">';

            for (var ri = 0; ri < analysis.results.length; ri++) {
                var r = analysis.results[ri];
                if (!isAllPanel && r.category !== panelCat) continue;

                var statusClass = r.pass ? 'pass' : 'fail';
                var statusIcon = r.pass ? '\u2713' : '\u2717';

                html += '<div class="rule-item" data-rule-id="' + r.id + '">';
                html += '<div class="rule-header" onclick="this.parentElement.classList.toggle(\'expanded\')">';
                html += '<span class="rule-status-icon ' + statusClass + '">' + statusIcon + '</span>';
                html += '<span class="rule-name">' + escapeHtml(r.name) + '</span>';
                html += '<span class="rule-source">' + escapeHtml(r.source.split(',')[0].trim()) + '</span>';
                html += '<span class="rule-expand">\u25BC</span>';
                html += '</div>';

                html += '<div class="rule-details">';
                html += '<div class="rule-detail-label">Result</div>';
                html += '<div class="rule-detail-value">' + escapeHtml(r.message) + '</div>';

                if (r.value) {
                    html += '<div class="rule-detail-label">Found</div>';
                    html += '<div class="rule-detail-value found-value">' + escapeHtml(r.value.substring(0, 300)) + '</div>';
                }

                if (r.fix) {
                    html += '<div class="rule-detail-label">How to Fix</div>';
                    html += '<div class="rule-detail-value fix-suggestion">' + escapeHtml(r.fix) + '</div>';
                }

                html += '<div class="rule-detail-label">Sources</div>';
                html += '<div class="rule-detail-value">' + escapeHtml(r.source) + ' (weight: ' + r.weight + '/10)</div>';

                html += '</div>';
                html += '</div>';
            }

            html += '</div>';
        }

        html += '</div>';
        html += '</div>';
        return html;
    }

    // ========================================================
    // BIND CATEGORY TABS (called after inserting HTML)
    // ========================================================
    function bindCategoryTabs(container) {
        var tabs = container.querySelectorAll('.category-tab');
        var panels = container.querySelectorAll('.category-panel');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', function() {
                var cat = this.getAttribute('data-category');
                for (var j = 0; j < tabs.length; j++) tabs[j].classList.remove('active');
                this.classList.add('active');
                for (var k = 0; k < panels.length; k++) {
                    if (panels[k].getAttribute('data-panel') === cat) panels[k].classList.add('active');
                    else panels[k].classList.remove('active');
                }
            });
        }
    }

    // ========================================================
    // REPORT GENERATION (text)
    // ========================================================
    function generateTextReport(analysis) {
        var lines = [];
        lines.push('SEO AUDIT REPORT');
        lines.push('================');
        lines.push('URL: ' + analysis.url);
        lines.push('Date: ' + new Date().toISOString().split('T')[0]);
        lines.push('Score: ' + analysis.score + '/100 (' + getScoreLabel(analysis.score) + ')');
        lines.push('Passed: ' + analysis.passed + '/' + analysis.total);
        lines.push('Failed: ' + analysis.failed + '/' + analysis.total);
        lines.push('');
        lines.push('');

        // Failed rules first
        var failedRules = analysis.results.filter(function(r) { return !r.pass; });
        if (failedRules.length > 0) {
            lines.push('ISSUES TO FIX (sorted by priority)');
            lines.push('-----------------------------------');
            for (var i = 0; i < failedRules.length; i++) {
                var r = failedRules[i];
                lines.push('');
                lines.push('[FAIL] ' + r.name + ' (weight: ' + r.weight + '/10)');
                lines.push('  Category: ' + r.category);
                lines.push('  Sources: ' + r.source);
                lines.push('  Issue: ' + r.message);
                if (r.value) lines.push('  Found: ' + r.value);
                if (r.fix) lines.push('  Fix: ' + r.fix);
            }
            lines.push('');
            lines.push('');
        }

        // Passed rules
        var passedRules = analysis.results.filter(function(r) { return r.pass; });
        if (passedRules.length > 0) {
            lines.push('PASSED CHECKS');
            lines.push('-------------');
            for (var j = 0; j < passedRules.length; j++) {
                var p = passedRules[j];
                lines.push('[PASS] ' + p.name + ' - ' + p.value);
            }
        }

        lines.push('');
        lines.push('---');
        lines.push('Generated by SEO Analyzer');
        lines.push('Sources: Yoast, AIOSEO, Rank Math, SEOPress, The SEO Framework, Google Search Central, Moz, Ahrefs');

        return lines.join('\n');
    }

    // ========================================================
    // DOWNLOAD / COPY HELPERS
    // ========================================================
    function downloadFile(content, filename) {
        var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function getReportFilename(url) {
        try {
            var parsed = new URL(url);
            var hostname = parsed.hostname.replace(/^www\./, '');
            var pathname = parsed.pathname.replace(/\//g, '_').replace(/^_|_$/g, '') || 'index';
            return 'seo-report_' + hostname + '_' + pathname + '.txt';
        } catch (e) {
            return 'seo-report.txt';
        }
    }

    function findAnalysisByUrl(url) {
        for (var i = 0; i < analysisResults.length; i++) {
            if (analysisResults[i].url === url) return analysisResults[i];
        }
        return null;
    }

    // Expose global handlers for inline onclick in report HTML
    window._seoDownloadReport = function(url) {
        var analysis = findAnalysisByUrl(url);
        if (analysis) downloadFile(generateTextReport(analysis), getReportFilename(url));
    };

    window._seoCopyReport = function(url, btn) {
        var analysis = findAnalysisByUrl(url);
        if (analysis) copyToClipboard(generateTextReport(analysis), btn);
    };

    function copyToClipboard(text, button) {
        try {
            navigator.clipboard.writeText(text).then(function() {
                showCopied(button);
            }).catch(function() {
                fallbackCopy(text, button);
            });
        } catch (e) {
            fallbackCopy(text, button);
        }
    }

    function fallbackCopy(text, button) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCopied(button);
    }

    function showCopied(button) {
        if (!button) return;
        var original = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        setTimeout(function() {
            button.textContent = original;
            button.classList.remove('copied');
        }, 2000);
    }

    // ========================================================
    // PROGRESS
    // ========================================================
    function updateProgress(current, total, message) {
        var percent = Math.round((current / total) * 100);
        progressFill.style.width = percent + '%';
        progressText.textContent = message || 'Processing ' + current + ' of ' + total + '...';
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorSection.style.display = 'block';
    }

    function hideError() {
        errorSection.style.display = 'none';
        errorMessage.textContent = '';
    }

    // ========================================================
    // ESCAPE HTML
    // ========================================================
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ========================================================
    // MODAL
    // ========================================================
    function showModal(analysis) {
        modalTitle.textContent = 'SEO Report: ' + analysis.url;
        modalBody.innerHTML = buildReportCard(analysis, true);
        bindCategoryTabs(modalBody);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // ========================================================
    // HANDLE ANALYZE
    // ========================================================
    function handleAnalyze() {
        var input = urlInput.value.trim();
        if (!input) { showError('Please enter at least one URL'); return; }
        var urls = parseUrls(input);
        if (urls.length === 0) { showError('No valid URLs found'); return; }

        hideError();
        analysisResults = [];
        resultsSection.style.display = 'none';
        singleResult.style.display = 'none';
        singleResult.innerHTML = '';
        resultsTable.style.display = 'none';
        resultsTbody.innerHTML = '';
        progressSection.style.display = 'block';
        updateProgress(0, urls.length, 'Starting analysis...');
        analyzeBtn.disabled = true;
        analyzeBtn.querySelector('.btn-text').style.display = 'none';
        analyzeBtn.querySelector('.btn-loading-text').style.display = 'inline';

        var i = 0;
        function next() {
            if (i >= urls.length) {
                progressSection.style.display = 'none';
                analyzeBtn.disabled = false;
                analyzeBtn.querySelector('.btn-text').style.display = 'inline';
                analyzeBtn.querySelector('.btn-loading-text').style.display = 'none';
                displayResults();
                return;
            }
            var url = urls[i];
            updateProgress(i + 1, urls.length, 'Fetching: ' + url);
            fetchUrl(url).then(function(html) {
                updateProgress(i + 1, urls.length, 'Analyzing: ' + url);
                var analysis = runAnalysis(html, url);
                analysisResults.push(analysis);
                i++;
                next();
            }).catch(function(err) {
                analysisResults.push({
                    url: url,
                    score: 0,
                    passed: 0,
                    failed: SEO_RULES.length,
                    warnings: 0,
                    total: SEO_RULES.length,
                    results: [],
                    error: err.message
                });
                i++;
                next();
            });
        }
        next();
    }

    // ========================================================
    // DISPLAY RESULTS
    // ========================================================
    function displayResults() {
        if (analysisResults.length === 0) { showError('No results to display'); return; }

        resultsSection.style.display = 'block';

        if (analysisResults.length === 1) {
            var a = analysisResults[0];
            if (a.error) {
                showError('Failed to analyze: ' + a.error);
                return;
            }
            singleResult.style.display = 'block';
            singleResult.innerHTML = buildReportCard(a, true);
            bindCategoryTabs(singleResult);
            downloadAllBtn.textContent = 'Download Report';
            return;
        }

        // Multiple results - table
        resultsTable.style.display = 'table';
        downloadAllBtn.textContent = 'Download All Reports';

        for (var idx = 0; idx < analysisResults.length; idx++) {
            var res = analysisResults[idx];
            var tr = document.createElement('tr');

            // URL cell
            var urlCell = document.createElement('td');
            var urlLink = document.createElement('a');
            urlLink.href = res.url;
            urlLink.target = '_blank';
            urlLink.textContent = res.url;
            urlCell.appendChild(urlLink);
            tr.appendChild(urlCell);

            // Score cell
            var scoreCell = document.createElement('td');
            if (res.error) {
                scoreCell.textContent = '-';
            } else {
                var scoreSpan = document.createElement('span');
                scoreSpan.className = 'table-score ' + getScoreClass(res.score);
                scoreSpan.textContent = res.score + '/100';
                scoreCell.appendChild(scoreSpan);
            }
            tr.appendChild(scoreCell);

            // Status cell
            var statusCell = document.createElement('td');
            if (res.error) {
                statusCell.innerHTML = '<span class="status-error" title="' + escapeHtml(res.error) + '">Failed</span>';
            } else {
                statusCell.innerHTML = '<span class="status-success">' + res.passed + ' passed, ' + res.failed + ' failed</span>';
            }
            tr.appendChild(statusCell);

            // Actions cell
            var actionsCell = document.createElement('td');
            var actionsDiv = document.createElement('div');
            actionsDiv.className = 'table-actions';

            if (!res.error) {
                var viewBtn = document.createElement('button');
                viewBtn.className = 'btn btn-small btn-view';
                viewBtn.textContent = 'View';
                viewBtn.setAttribute('data-url', res.url);
                viewBtn.addEventListener('click', function() {
                    var analysis = findAnalysisByUrl(this.getAttribute('data-url'));
                    if (analysis) showModal(analysis);
                });
                actionsDiv.appendChild(viewBtn);

                var dlBtn = document.createElement('button');
                dlBtn.className = 'btn btn-small btn-download';
                dlBtn.textContent = 'Download';
                dlBtn.setAttribute('data-url', res.url);
                dlBtn.addEventListener('click', function() {
                    var analysis = findAnalysisByUrl(this.getAttribute('data-url'));
                    if (analysis) downloadFile(generateTextReport(analysis), getReportFilename(analysis.url));
                });
                actionsDiv.appendChild(dlBtn);
            }

            actionsCell.appendChild(actionsDiv);
            tr.appendChild(actionsCell);
            resultsTbody.appendChild(tr);
        }
    }

    // ========================================================
    // HANDLE DOWNLOAD ALL
    // ========================================================
    function handleDownloadAll() {
        if (analysisResults.length === 0) return;
        var valid = analysisResults.filter(function(a) { return !a.error; });
        if (valid.length === 1) {
            downloadFile(generateTextReport(valid[0]), getReportFilename(valid[0].url));
            return;
        }
        for (var i = 0; i < valid.length; i++) {
            (function(idx) {
                setTimeout(function() {
                    downloadFile(generateTextReport(valid[idx]), getReportFilename(valid[idx].url));
                }, idx * 100);
            })(i);
        }
    }

    // ========================================================
    // HANDLE CLEAR
    // ========================================================
    function handleClear() {
        urlInput.value = '';
        analysisResults = [];
        resultsSection.style.display = 'none';
        singleResult.style.display = 'none';
        singleResult.innerHTML = '';
        resultsTable.style.display = 'none';
        resultsTbody.innerHTML = '';
        progressSection.style.display = 'none';
        hideError();
        urlInput.focus();
    }

    // ========================================================
    // START
    // ========================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
