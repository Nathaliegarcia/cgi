/**
 * Website to Markdown Converter
 * Converts HTML content from websites to clean Markdown format
 */

(function() {
    'use strict';

    // DOM Elements
    const urlInput = document.getElementById('url-input');
    const convertBtn = document.getElementById('convert-btn');
    const clearBtn = document.getElementById('clear-btn');
    const progressSection = document.getElementById('progress-section');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const resultsSection = document.getElementById('results-section');
    const singleResult = document.getElementById('single-result');
    const singleMarkdown = document.getElementById('single-markdown');
    const singleDownloadBtn = document.getElementById('single-download-btn');
    const resultsTable = document.getElementById('results-table');
    const resultsTbody = document.getElementById('results-tbody');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const errorSection = document.getElementById('error-section');
    const errorMessage = document.getElementById('error-message');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMarkdown = document.getElementById('modal-markdown');
    const modalClose = document.getElementById('modal-close');
    const modalCopyBtn = document.getElementById('modal-copy-btn');
    const modalDownloadBtn = document.getElementById('modal-download-btn');

    // Store results for download
    let conversionResults = [];
    let currentModalData = null;

    // Initialize event listeners
    function init() {
        convertBtn.addEventListener('click', handleConvert);
        clearBtn.addEventListener('click', handleClear);
        downloadAllBtn.addEventListener('click', handleDownloadAll);
        singleDownloadBtn.addEventListener('click', () => downloadSingle(conversionResults[0]));
        modalClose.addEventListener('click', closeModal);
        modalCopyBtn.addEventListener('click', () => copyToClipboard(currentModalData.markdown, modalCopyBtn));
        modalDownloadBtn.addEventListener('click', () => downloadSingle(currentModalData));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Copy button for single result
        document.querySelector('[data-target="single-markdown"]').addEventListener('click', function() {
            copyToClipboard(singleMarkdown.textContent, this);
        });

        // Handle escape key for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display !== 'none') {
                closeModal();
            }
        });
    }

    // Parse URLs from input
    function parseUrls(input) {
        return input
            .split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0)
            .map(url => {
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    return 'https://' + url;
                }
                return url;
            });
    }

    // Fetch URL content via CORS proxy
    async function fetchUrl(url) {
        const useLocalProxy = document.getElementById('use-local-proxy').checked;
        let proxyUrl;

        if (useLocalProxy) {
            // Use local proxy
            proxyUrl = '../proxy/proxy.py?url=' + encodeURIComponent(url);
            const response = await fetch(proxyUrl);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch URL');
            }

            return data.html;
        } else {
            // Use codetabs proxy
            proxyUrl = 'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent(url);
            const response = await fetch(proxyUrl);

            if (!response.ok) {
                throw new Error('Failed to fetch URL: ' + response.status);
            }

            return await response.text();
        }
    }

    // HTML to Markdown converter
    function htmlToMarkdown(html, url) {
        // Create a temporary DOM element
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Remove unwanted elements
        const removeSelectors = [
            'script', 'style', 'noscript', 'iframe', 'svg', 'canvas',
            'nav', 'footer', 'header', 'aside', 'form', 'input', 'button',
            '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
            '.nav', '.navbar', '.footer', '.header', '.sidebar', '.menu',
            '.advertisement', '.ad', '.ads', '.social', '.share', '.comments'
        ];

        removeSelectors.forEach(selector => {
            doc.querySelectorAll(selector).forEach(el => el.remove());
        });

        // Get the main content area or body
        const mainContent = doc.querySelector('main, article, [role="main"], .content, .post, .entry') || doc.body;

        // Convert to markdown
        let markdown = convertNode(mainContent);

        // Clean up the markdown
        markdown = cleanMarkdown(markdown);

        // Add source URL at the top
        markdown = `> Source: ${url}\n\n---\n\n${markdown}`;

        return markdown;
    }

    // Convert a DOM node to markdown
    function convertNode(node) {
        if (!node) return '';

        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        const tagName = node.tagName.toLowerCase();
        let result = '';

        // Get child content
        const childContent = Array.from(node.childNodes)
            .map(child => convertNode(child))
            .join('');

        switch (tagName) {
            // Headings
            case 'h1':
                result = `\n\n# ${childContent.trim()}\n\n`;
                break;
            case 'h2':
                result = `\n\n## ${childContent.trim()}\n\n`;
                break;
            case 'h3':
                result = `\n\n### ${childContent.trim()}\n\n`;
                break;
            case 'h4':
                result = `\n\n#### ${childContent.trim()}\n\n`;
                break;
            case 'h5':
                result = `\n\n##### ${childContent.trim()}\n\n`;
                break;
            case 'h6':
                result = `\n\n###### ${childContent.trim()}\n\n`;
                break;

            // Paragraphs and blocks
            case 'p':
                result = `\n\n${childContent.trim()}\n\n`;
                break;
            case 'div':
            case 'section':
            case 'article':
            case 'main':
                result = `\n${childContent}\n`;
                break;
            case 'br':
                result = '\n';
                break;
            case 'hr':
                result = '\n\n---\n\n';
                break;

            // Inline formatting
            case 'strong':
            case 'b':
                result = `**${childContent.trim()}**`;
                break;
            case 'em':
            case 'i':
                result = `*${childContent.trim()}*`;
                break;
            case 'u':
                result = `_${childContent.trim()}_`;
                break;
            case 's':
            case 'strike':
            case 'del':
                result = `~~${childContent.trim()}~~`;
                break;
            case 'code':
                result = `\`${childContent.trim()}\``;
                break;
            case 'mark':
                result = `==${childContent.trim()}==`;
                break;

            // Links
            case 'a':
                const href = node.getAttribute('href');
                if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                    result = `[${childContent.trim()}](${href})`;
                } else {
                    result = childContent;
                }
                break;

            // Images
            case 'img':
                const src = node.getAttribute('src');
                const alt = node.getAttribute('alt') || 'image';
                if (src) {
                    result = `\n\n![${alt}](${src})\n\n`;
                }
                break;

            // Lists
            case 'ul':
                result = '\n' + convertList(node, '-') + '\n';
                break;
            case 'ol':
                result = '\n' + convertList(node, '1.') + '\n';
                break;
            case 'li':
                result = childContent.trim();
                break;

            // Code blocks
            case 'pre':
                const codeEl = node.querySelector('code');
                const codeContent = codeEl ? codeEl.textContent : node.textContent;
                const lang = codeEl ? (codeEl.className.match(/language-(\w+)/) || [])[1] || '' : '';
                result = `\n\n\`\`\`${lang}\n${codeContent.trim()}\n\`\`\`\n\n`;
                break;

            // Blockquotes
            case 'blockquote':
                const quoteLines = childContent.trim().split('\n');
                result = '\n\n' + quoteLines.map(line => `> ${line}`).join('\n') + '\n\n';
                break;

            // Tables
            case 'table':
                result = '\n\n' + convertTable(node) + '\n\n';
                break;

            // Definition lists
            case 'dl':
                result = '\n' + convertDefinitionList(node) + '\n';
                break;

            // Figures
            case 'figure':
                result = childContent;
                break;
            case 'figcaption':
                result = `\n*${childContent.trim()}*\n`;
                break;

            // Default: just return child content
            default:
                result = childContent;
        }

        return result;
    }

    // Convert list elements
    function convertList(listNode, marker) {
        const items = [];
        let index = 1;

        listNode.querySelectorAll(':scope > li').forEach(li => {
            const itemMarker = marker === '1.' ? `${index}.` : marker;
            const content = convertNode(li);
            items.push(`${itemMarker} ${content}`);
            index++;
        });

        return items.join('\n');
    }

    // Convert table to markdown
    function convertTable(tableNode) {
        const rows = [];

        // Get headers
        const headerRow = tableNode.querySelector('thead tr, tr:first-child');
        if (headerRow) {
            const headers = Array.from(headerRow.querySelectorAll('th, td'))
                .map(cell => convertNode(cell).trim().replace(/\|/g, '\\|'));

            if (headers.length > 0) {
                rows.push('| ' + headers.join(' | ') + ' |');
                rows.push('| ' + headers.map(() => '---').join(' | ') + ' |');
            }
        }

        // Get body rows
        const bodyRows = tableNode.querySelectorAll('tbody tr, tr:not(:first-child)');
        bodyRows.forEach(tr => {
            const cells = Array.from(tr.querySelectorAll('td, th'))
                .map(cell => convertNode(cell).trim().replace(/\|/g, '\\|'));

            if (cells.length > 0) {
                rows.push('| ' + cells.join(' | ') + ' |');
            }
        });

        return rows.join('\n');
    }

    // Convert definition list
    function convertDefinitionList(dlNode) {
        const items = [];
        let currentTerm = '';

        Array.from(dlNode.children).forEach(child => {
            if (child.tagName.toLowerCase() === 'dt') {
                currentTerm = convertNode(child).trim();
                items.push(`**${currentTerm}**`);
            } else if (child.tagName.toLowerCase() === 'dd') {
                items.push(`: ${convertNode(child).trim()}`);
            }
        });

        return items.join('\n');
    }

    // Clean up markdown output
    function cleanMarkdown(markdown) {
        return markdown
            // Remove excessive newlines
            .replace(/\n{4,}/g, '\n\n\n')
            // Remove leading/trailing whitespace from lines
            .split('\n')
            .map(line => line.trimEnd())
            .join('\n')
            // Remove empty bold/italic
            .replace(/\*\*\s*\*\*/g, '')
            .replace(/\*\s*\*/g, '')
            .replace(/__\s*__/g, '')
            .replace(/_\s*_/g, '')
            // Clean up spaces around formatting
            .replace(/\s+\*\*/g, ' **')
            .replace(/\*\*\s+/g, '** ')
            // Remove leading/trailing whitespace
            .trim();
    }

    // Get filename from URL
    function getFilename(url) {
        try {
            const parsed = new URL(url);
            const hostname = parsed.hostname.replace(/^www\./, '');
            const pathname = parsed.pathname.replace(/\//g, '_').replace(/^_|_$/g, '') || 'index';
            return `${hostname}_${pathname}.md`;
        } catch {
            return 'converted.md';
        }
    }

    // Download single file
    function downloadSingle(data) {
        const blob = new Blob([data.markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Download all as ZIP (simple concatenation since we can't use libraries)
    function handleDownloadAll() {
        if (conversionResults.length === 0) return;

        if (conversionResults.length === 1) {
            downloadSingle(conversionResults[0]);
            return;
        }

        // Create individual downloads for each file
        conversionResults.forEach((result, index) => {
            setTimeout(() => {
                downloadSingle(result);
            }, index * 500); // Stagger downloads
        });
    }

    // Copy to clipboard
    async function copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        }
    }

    // Show modal with markdown content
    function showModal(data) {
        currentModalData = data;
        modalTitle.textContent = data.url;
        modalMarkdown.textContent = data.markdown;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        currentModalData = null;
    }

    // Update progress
    function updateProgress(current, total, message) {
        const percent = Math.round((current / total) * 100);
        progressFill.style.width = `${percent}%`;
        progressText.textContent = message || `Processing ${current} of ${total}...`;
    }

    // Show error
    function showError(message) {
        errorMessage.textContent = message;
        errorSection.style.display = 'block';
    }

    // Hide error
    function hideError() {
        errorSection.style.display = 'none';
        errorMessage.textContent = '';
    }

    // Handle convert button click
    async function handleConvert() {
        const input = urlInput.value.trim();

        if (!input) {
            showError('Please enter at least one URL');
            return;
        }

        const urls = parseUrls(input);

        if (urls.length === 0) {
            showError('No valid URLs found');
            return;
        }

        // Reset state
        hideError();
        conversionResults = [];
        resultsSection.style.display = 'none';
        singleResult.style.display = 'none';
        resultsTable.style.display = 'none';
        resultsTbody.innerHTML = '';

        // Show progress
        progressSection.style.display = 'block';
        updateProgress(0, urls.length, 'Starting conversion...');

        // Disable button
        convertBtn.disabled = true;
        convertBtn.querySelector('.btn-text').style.display = 'none';
        convertBtn.querySelector('.btn-loading').style.display = 'inline';

        // Process URLs
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            updateProgress(i + 1, urls.length, `Fetching: ${url}`);

            try {
                const html = await fetchUrl(url);
                updateProgress(i + 1, urls.length, `Converting: ${url}`);

                const markdown = htmlToMarkdown(html, url);
                const filename = getFilename(url);

                conversionResults.push({
                    url: url,
                    markdown: markdown,
                    filename: filename,
                    success: true,
                    error: null
                });
            } catch (err) {
                conversionResults.push({
                    url: url,
                    markdown: '',
                    filename: getFilename(url),
                    success: false,
                    error: err.message
                });
            }
        }

        // Hide progress
        progressSection.style.display = 'none';

        // Enable button
        convertBtn.disabled = false;
        convertBtn.querySelector('.btn-text').style.display = 'inline';
        convertBtn.querySelector('.btn-loading').style.display = 'none';

        // Show results
        displayResults();
    }

    // Display results
    function displayResults() {
        if (conversionResults.length === 0) {
            showError('No results to display');
            return;
        }

        resultsSection.style.display = 'block';

        // Single result
        if (conversionResults.length === 1) {
            const result = conversionResults[0];

            if (result.success) {
                singleResult.style.display = 'block';
                singleMarkdown.textContent = result.markdown;
            } else {
                showError(`Failed to convert: ${result.error}`);
            }

            downloadAllBtn.textContent = 'Download';
            return;
        }

        // Multiple results - show table
        resultsTable.style.display = 'table';
        downloadAllBtn.textContent = 'Download All';

        conversionResults.forEach((result, index) => {
            const tr = document.createElement('tr');

            // URL cell
            const urlCell = document.createElement('td');
            const urlLink = document.createElement('a');
            urlLink.href = result.url;
            urlLink.target = '_blank';
            urlLink.textContent = result.url;
            urlCell.appendChild(urlLink);
            tr.appendChild(urlCell);

            // Status cell
            const statusCell = document.createElement('td');
            if (result.success) {
                statusCell.innerHTML = '<span class="status-success">Success</span>';
            } else {
                statusCell.innerHTML = `<span class="status-error" title="${result.error}">Failed</span>`;
            }
            tr.appendChild(statusCell);

            // Preview cell
            const previewCell = document.createElement('td');
            if (result.success) {
                const preview = document.createElement('span');
                preview.className = 'preview-text';
                preview.textContent = result.markdown.substring(0, 100) + '...';
                previewCell.appendChild(preview);
            } else {
                previewCell.textContent = '-';
            }
            tr.appendChild(previewCell);

            // Actions cell
            const actionsCell = document.createElement('td');
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'table-actions';

            if (result.success) {
                // View button
                const viewBtn = document.createElement('button');
                viewBtn.className = 'btn btn-small btn-view';
                viewBtn.textContent = 'View';
                viewBtn.addEventListener('click', () => showModal(result));
                actionsDiv.appendChild(viewBtn);

                // Copy button
                const copyBtn = document.createElement('button');
                copyBtn.className = 'btn btn-small btn-copy';
                copyBtn.textContent = 'Copy';
                copyBtn.addEventListener('click', () => copyToClipboard(result.markdown, copyBtn));
                actionsDiv.appendChild(copyBtn);

                // Download button
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'btn btn-small btn-download';
                downloadBtn.textContent = 'Download';
                downloadBtn.addEventListener('click', () => downloadSingle(result));
                actionsDiv.appendChild(downloadBtn);
            }

            actionsCell.appendChild(actionsDiv);
            tr.appendChild(actionsCell);

            resultsTbody.appendChild(tr);
        });
    }

    // Handle clear button
    function handleClear() {
        urlInput.value = '';
        conversionResults = [];
        resultsSection.style.display = 'none';
        singleResult.style.display = 'none';
        resultsTable.style.display = 'none';
        resultsTbody.innerHTML = '';
        progressSection.style.display = 'none';
        hideError();
        urlInput.focus();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
