#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import cgi
import cgitb
import json
import sys
import re
from urllib.parse import urljoin, urlparse, urlunparse, parse_qs, urlencode
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
from html.parser import HTMLParser

cgitb.enable()

# Parameters to remove (commonly useless for sitemap purposes)
USELESS_PARAMS = {
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'fbclid', 'gclid', 'gclsrc', 'dclid', 'zanpid', 'msclkid',
    '_ga', '_gl', '_hsenc', '_hsmi', 'hsCtaTracking',
    'mc_cid', 'mc_eid', 'mkt_tok',
    'ref', 'source', 'share', 'si',
    'trk', 'trkInfo', 'trackingId',
    'sessionid', 'session_id', 'sid',
    '__cf_chl_jschl_tk__', '__cf_chl_captcha_tk__',
    'ncid', 'sr_share', 'spm'
}

class LinkExtractor(HTMLParser):
    """HTML parser to extract href attributes from anchor tags."""

    def __init__(self, base_url):
        super().__init__()
        self.base_url = base_url
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            for attr, value in attrs:
                if attr == 'href' and value:
                    self.links.append(value)


def clean_url(url, base_domain):
    """
    Clean a URL by:
    - Normalizing it
    - Removing useless tracking parameters
    - Removing fragments
    - Ensuring it's an internal link
    """
    try:
        parsed = urlparse(url)

        # Skip non-http(s) schemes
        if parsed.scheme and parsed.scheme not in ('http', 'https'):
            return None

        # Skip common non-page resources
        path_lower = parsed.path.lower()
        skip_extensions = (
            '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico',
            '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
            '.zip', '.rar', '.tar', '.gz', '.7z',
            '.mp3', '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm',
            '.css', '.js', '.json', '.xml', '.rss', '.atom',
            '.woff', '.woff2', '.ttf', '.eot', '.otf'
        )
        if any(path_lower.endswith(ext) for ext in skip_extensions):
            return None

        # Check if internal link
        if parsed.netloc and parsed.netloc != base_domain:
            # Check for www variant
            if parsed.netloc != 'www.' + base_domain and 'www.' + parsed.netloc != base_domain:
                return None

        # Filter query parameters
        if parsed.query:
            params = parse_qs(parsed.query, keep_blank_values=True)
            filtered_params = {
                k: v for k, v in params.items()
                if k.lower() not in USELESS_PARAMS
            }
            new_query = urlencode(filtered_params, doseq=True) if filtered_params else ''
        else:
            new_query = ''

        # Normalize path
        path = parsed.path if parsed.path else '/'

        # Remove trailing slash for consistency (except root)
        if path != '/' and path.endswith('/'):
            path = path[:-1]

        # Reconstruct URL without fragment
        clean_parsed = (
            parsed.scheme or 'https',
            parsed.netloc or base_domain,
            path,
            '',  # params
            new_query,
            ''   # fragment removed
        )

        return urlunparse(clean_parsed)

    except Exception:
        return None


def fetch_and_extract(url):
    """Fetch a URL and extract all internal links."""
    try:
        parsed = urlparse(url)
        base_domain = parsed.netloc

        # Create request with a proper User-Agent
        headers = {
            'User-Agent': 'Mozilla/5.0 (compatible; SitemapCrawler/1.0)',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9',
        }

        req = Request(url, headers=headers)

        with urlopen(req, timeout=10) as response:
            # Check if response is HTML
            content_type = response.headers.get('Content-Type', '')
            if 'text/html' not in content_type and 'application/xhtml' not in content_type:
                return {
                    'success': True,
                    'url': url,
                    'links': [],
                    'status': response.status,
                    'message': 'Non-HTML content'
                }

            # Read and decode content
            charset = 'utf-8'
            if 'charset=' in content_type:
                charset = content_type.split('charset=')[-1].split(';')[0].strip()

            content = response.read()
            try:
                html = content.decode(charset)
            except (UnicodeDecodeError, LookupError):
                html = content.decode('utf-8', errors='ignore')

            # Extract links
            extractor = LinkExtractor(url)
            try:
                extractor.feed(html)
            except Exception:
                pass

            # Process and clean links
            internal_links = []
            seen = set()

            for link in extractor.links:
                # Resolve relative URLs
                absolute_url = urljoin(url, link)

                # Clean and validate
                clean = clean_url(absolute_url, base_domain)

                if clean and clean not in seen:
                    seen.add(clean)
                    internal_links.append(clean)

            return {
                'success': True,
                'url': url,
                'links': internal_links,
                'status': response.status,
                'message': 'OK'
            }

    except HTTPError as e:
        return {
            'success': False,
            'url': url,
            'links': [],
            'status': e.code,
            'message': str(e.reason)
        }
    except URLError as e:
        return {
            'success': False,
            'url': url,
            'links': [],
            'status': 0,
            'message': str(e.reason)
        }
    except Exception as e:
        return {
            'success': False,
            'url': url,
            'links': [],
            'status': 0,
            'message': str(e)
        }


def main():
    """Main CGI handler."""
    print("Content-Type: application/json")
    print("Access-Control-Allow-Origin: *")
    print("Access-Control-Allow-Methods: GET, POST")
    print("Access-Control-Allow-Headers: Content-Type")
    print()

    form = cgi.FieldStorage()
    url = form.getfirst('url', '').strip()

    if not url:
        result = {
            'success': False,
            'url': '',
            'links': [],
            'status': 0,
            'message': 'No URL provided'
        }
    else:
        # Ensure URL has scheme
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url

        result = fetch_and_extract(url)

    print(json.dumps(result))


if __name__ == '__main__':
    main()
