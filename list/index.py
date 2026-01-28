#!/usr/bin/env python3
"""
CGI script that generates a directory index page.
Lists all subdirectories in the root and creates links to each.
"""

import os

# Get the parent directory (root) where this script should list from
SCRIPT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def get_directories():
    """Get all subdirectories in the script's directory."""
    directories = []
    for item in os.listdir(SCRIPT_DIR):
        item_path = os.path.join(SCRIPT_DIR, item)
        # Only include directories, exclude hidden ones (starting with .)
        if os.path.isdir(item_path) and not item.startswith('.'):
            directories.append(item)
    return sorted(directories)


def generate_html(directories):
    """Generate HTML page with links to each directory."""
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Directory Index</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
            text-align: center;
            font-size: 2rem;
        }
        .directory-list {
            list-style: none;
        }
        .directory-list li {
            margin-bottom: 12px;
        }
        .directory-list a {
            display: flex;
            align-items: center;
            padding: 16px 20px;
            background: #f8f9fa;
            border-radius: 8px;
            text-decoration: none;
            color: #333;
            font-size: 1.1rem;
            transition: all 0.2s ease;
            border: 2px solid transparent;
        }
        .directory-list a:hover {
            background: #e9ecef;
            border-color: #667eea;
            transform: translateX(5px);
        }
        .folder-icon {
            margin-right: 12px;
            font-size: 1.4rem;
        }
        .empty-message {
            text-align: center;
            color: #666;
            font-style: italic;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Directory Index</h1>
"""

    if directories:
        html += '        <ul class="directory-list">\n'
        for directory in directories:
            html += f'            <li><a href="/{directory}/"><span class="folder-icon">📁</span>{directory}</a></li>\n'
        html += '        </ul>\n'
    else:
        html += '        <p class="empty-message">No directories found.</p>\n'

    html += """    </div>
</body>
</html>
"""
    return html


def main():
    """Main CGI entry point."""
    # Output HTTP headers
    print("Content-Type: text/html; charset=utf-8")
    print()  # Empty line separates headers from body

    # Get directories and generate HTML
    directories = get_directories()
    html = generate_html(directories)

    # Output the HTML
    print(html)


if __name__ == "__main__":
    main()
