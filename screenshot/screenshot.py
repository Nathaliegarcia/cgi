#!/usr/bin/env python3
"""Screenshot CGI endpoint - captures website screenshots using wkhtmltoimage/wkhtmltopdf."""

import os
import sys
import subprocess
import tempfile
import urllib.parse
from datetime import datetime


def send_error_response(status, error_message):
    """Send JSON error response."""
    import json
    print(f"Status: {status}")
    print("Content-Type: application/json")
    print("Access-Control-Allow-Origin: *")
    print()
    print(json.dumps({"success": False, "error": error_message}))
    sys.exit(0)


def send_image_response(image_data, filename, content_type):
    """Send binary image response."""
    sys.stdout.flush()
    sys.stdout.buffer.write(f"Status: 200 OK\r\n".encode())
    sys.stdout.buffer.write(f"Content-Type: {content_type}\r\n".encode())
    sys.stdout.buffer.write(f"Content-Disposition: attachment; filename=\"{filename}\"\r\n".encode())
    sys.stdout.buffer.write(b"Access-Control-Allow-Origin: *\r\n")
    sys.stdout.buffer.write(f"Content-Length: {len(image_data)}\r\n".encode())
    sys.stdout.buffer.write(b"\r\n")
    sys.stdout.buffer.write(image_data)
    sys.stdout.buffer.flush()


def validate_url(url):
    """Validate that URL is http or https."""
    if not url:
        return False, "Missing 'url' parameter"

    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ('http', 'https'):
        return False, "URL must start with http:// or https://"

    if not parsed.netloc:
        return False, "Invalid URL format"

    return True, None


def get_domain_from_url(url):
    """Extract domain name from URL."""
    parsed = urllib.parse.urlparse(url)
    domain = parsed.netloc
    # Remove www. prefix if present
    if domain.startswith('www.'):
        domain = domain[4:]
    # Replace dots with underscores for filename safety
    return domain.replace('.', '_').replace(':', '_')


def generate_filename(url, is_pdf):
    """Generate filename based on domain and timestamp."""
    domain = get_domain_from_url(url)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    extension = 'pdf' if is_pdf else 'png'
    return f"{domain}_{timestamp}.{extension}"


def capture_screenshot(url, is_pdf, timeout=30):
    """Capture screenshot using wkhtmltoimage or wkhtmltopdf."""

    # Determine which tool and extension to use
    if is_pdf:
        tool = 'wkhtmltopdf'
        suffix = '.pdf'
    else:
        tool = 'wkhtmltoimage'
        suffix = '.png'

    # Create temporary file for output
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp_file:
        output_path = tmp_file.name

    try:
        # Build command with common options
        cmd = [
            tool,
            '--quiet',
            '--disable-smart-width',
            '--javascript-delay', '1000',  # Wait for JS to load
        ]

        if is_pdf:
            # PDF-specific options
            cmd.extend([
                '--page-size', 'A4',
                '--margin-top', '10mm',
                '--margin-bottom', '10mm',
                '--margin-left', '10mm',
                '--margin-right', '10mm',
            ])
        else:
            # Image-specific options
            cmd.extend([
                '--width', '1280',
                '--height', '800',
                '--format', 'png',
            ])

        # Add URL and output path
        cmd.extend([url, output_path])

        # Execute command
        result = subprocess.run(
            cmd,
            capture_output=True,
            timeout=timeout
        )

        # Check if output file was created and has content
        if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
            error_msg = result.stderr.decode('utf-8', errors='ignore') if result.stderr else 'Unknown error'
            return None, f"Screenshot generation failed: {error_msg}"

        # Read the output file
        with open(output_path, 'rb') as f:
            image_data = f.read()

        return image_data, None

    except subprocess.TimeoutExpired:
        return None, f"Screenshot timed out after {timeout} seconds"
    except FileNotFoundError:
        return None, f"'{tool}' is not installed on this server"
    except Exception as e:
        return None, f"Screenshot failed: {str(e)}"
    finally:
        # Cleanup temporary file
        if os.path.exists(output_path):
            os.unlink(output_path)


def main():
    """Main entry point."""
    # Parse query string
    query_string = os.environ.get('QUERY_STRING', '')
    params = urllib.parse.parse_qs(query_string)

    # Get URL parameter (required)
    url = params.get('url', [None])[0]
    if url:
        url = urllib.parse.unquote(url)

    # Get proxy parameter (default: local) - for future use
    proxy = params.get('proxy', ['local'])[0]

    # Get pdf parameter (default: false)
    pdf_param = params.get('pdf', ['false'])[0].lower()
    is_pdf = pdf_param in ('true', '1', 'yes')

    # Validate URL
    is_valid, error = validate_url(url)
    if not is_valid:
        send_error_response("400 Bad Request", error)

    # Capture screenshot
    image_data, error = capture_screenshot(url, is_pdf)
    if error:
        send_error_response("500 Internal Server Error", error)

    # Generate filename and send response
    filename = generate_filename(url, is_pdf)
    content_type = 'application/pdf' if is_pdf else 'image/png'
    send_image_response(image_data, filename, content_type)


if __name__ == '__main__':
    main()
