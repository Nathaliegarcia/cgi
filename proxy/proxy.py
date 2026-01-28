#!/usr/bin/env python3
"""
CGI Proxy script to fetch external websites and bypass CORS restrictions.
"""

import cgi
import cgitb
import json
import urllib.request
import urllib.error
import urllib.parse
import sys
import os

cgitb.enable()

def send_response(status, data, content_type="application/json"):
    """Send HTTP response with proper headers."""
    print(f"Status: {status}")
    print(f"Content-Type: {content_type}")
    print("Access-Control-Allow-Origin: *")
    print("Access-Control-Allow-Methods: GET, POST, OPTIONS")
    print("Access-Control-Allow-Headers: Content-Type")
    print()
    if isinstance(data, str):
        print(data)
    else:
        print(json.dumps(data))

def fetch_url(url):
    """Fetch content from a URL."""
    try:
        # Validate URL
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme not in ('http', 'https'):
            return None, "Invalid URL scheme. Only HTTP and HTTPS are allowed."

        # Create request with a user agent
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        }

        req = urllib.request.Request(url, headers=headers)

        with urllib.request.urlopen(req, timeout=30) as response:
            # Try to detect encoding
            content_type = response.headers.get('Content-Type', '')
            encoding = 'utf-8'

            if 'charset=' in content_type:
                encoding = content_type.split('charset=')[-1].split(';')[0].strip()

            content = response.read()

            try:
                html = content.decode(encoding)
            except (UnicodeDecodeError, LookupError):
                try:
                    html = content.decode('utf-8', errors='replace')
                except:
                    html = content.decode('latin-1', errors='replace')

            return html, None

    except urllib.error.HTTPError as e:
        return None, f"HTTP Error {e.code}: {e.reason}"
    except urllib.error.URLError as e:
        return None, f"URL Error: {str(e.reason)}"
    except Exception as e:
        return None, f"Error: {str(e)}"

def main():
    """Main entry point."""
    method = os.environ.get('REQUEST_METHOD', 'GET')

    # Handle preflight OPTIONS request
    if method == 'OPTIONS':
        send_response(200, '')
        return

    # Get the URL parameter
    form = cgi.FieldStorage()
    url = form.getvalue('url', '')

    if not url:
        send_response(400, {'error': 'Missing URL parameter', 'success': False})
        return

    # Decode URL if needed
    url = urllib.parse.unquote(url)

    # Ensure URL has a scheme
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    # Fetch the URL
    html, error = fetch_url(url)

    if error:
        send_response(400, {'error': error, 'success': False, 'url': url})
        return

    send_response(200, {'html': html, 'success': True, 'url': url})

if __name__ == '__main__':
    main()
