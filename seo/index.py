#!/usr/bin/env python3
"""Serves the SEO Analyzer frontend HTML page."""

import os


def main():
    """Read and serve the index.html file."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(script_dir, 'index.html')

    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except FileNotFoundError:
        print("Status: 500 Internal Server Error")
        print("Content-Type: text/plain")
        print()
        print("Error: index.html not found")
        return

    print("Content-Type: text/html; charset=utf-8")
    print()
    print(html_content)


if __name__ == '__main__':
    main()
