(function() {
    'use strict';

    // Configuration
    var MAX_RETRIES = 3;
    var RETRY_DELAY = 2000;

    // DOM Elements
    var urlInput = document.getElementById('url-input');
    var pdfMode = document.getElementById('pdf-mode');
    var useLocalProxy = document.getElementById('use-local-proxy');
    var captureBtn = document.getElementById('capture-btn');
    var progressSection = document.getElementById('progress-section');
    var progressText = document.getElementById('progress-text');
    var progressPercent = document.getElementById('progress-percent');
    var progressFill = document.getElementById('progress-fill');
    var resultsSection = document.getElementById('results-section');
    var resultsContainer = document.getElementById('results-container');
    var downloadAllBtn = document.getElementById('download-all-btn');
    var errorSection = document.getElementById('error-section');
    var errorMessage = document.getElementById('error-message');

    // State
    var results = [];
    var downloadableItems = [];
    var isProcessing = false;

    // Initialize
    captureBtn.addEventListener('click', handleCapture);
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', downloadAll);
    }

    /**
     * Parse URLs from input textarea
     */
    function parseUrls(input) {
        return input
            .split('\n')
            .map(function(url) { return url.trim(); })
            .filter(function(url) { return url.length > 0; })
            .map(function(url) {
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    return 'https://' + url;
                }
                return url;
            });
    }

    /**
     * Create result item element
     */
    function createResultItem(url, index) {
        var item = document.createElement('div');
        item.className = 'result-item';
        item.id = 'result-' + index;
        item.innerHTML =
            '<div class="result-header">' +
                '<span class="result-url">' + escapeHtml(url) + '</span>' +
                '<span class="result-status pending">Pending</span>' +
            '</div>' +
            '<div class="result-content"></div>';
        return item;
    }

    /**
     * Update result item status
     */
    function updateResultStatus(index, status, statusText) {
        var item = document.getElementById('result-' + index);
        if (!item) return;

        var statusEl = item.querySelector('.result-status');
        statusEl.className = 'result-status ' + status;
        statusEl.textContent = statusText;
    }

    /**
     * Update result item with image
     */
    function updateResultWithImage(index, blob, filename, isPdf) {
        var item = document.getElementById('result-' + index);
        if (!item) return;

        var contentEl = item.querySelector('.result-content');
        var objectUrl = URL.createObjectURL(blob);

        // Store for Download All functionality
        downloadableItems.push({ url: objectUrl, filename: filename });

        if (isPdf) {
            contentEl.innerHTML =
                '<div class="result-preview">' +
                    '<iframe src="' + objectUrl + '" title="PDF Preview"></iframe>' +
                '</div>' +
                '<div class="result-actions">' +
                    '<button class="btn-download" data-url="' + objectUrl + '" data-filename="' + escapeHtml(filename) + '">Download PDF</button>' +
                '</div>';
        } else {
            contentEl.innerHTML =
                '<div class="result-preview">' +
                    '<img src="' + objectUrl + '" alt="Screenshot">' +
                '</div>' +
                '<div class="result-actions">' +
                    '<button class="btn-download" data-url="' + objectUrl + '" data-filename="' + escapeHtml(filename) + '">Download</button>' +
                '</div>';
        }

        // Add download handler
        var downloadBtn = contentEl.querySelector('.btn-download');
        downloadBtn.addEventListener('click', function() {
            downloadFile(this.dataset.url, this.dataset.filename);
        });
    }

    /**
     * Update result item with error
     */
    function updateResultWithError(index, error) {
        var item = document.getElementById('result-' + index);
        if (!item) return;

        var contentEl = item.querySelector('.result-content');
        contentEl.innerHTML = '<div class="result-error">' + escapeHtml(error) + '</div>';
    }

    /**
     * Update progress bar
     */
    function updateProgress(current, total) {
        var percent = total > 0 ? Math.round((current / total) * 100) : 0;
        progressText.textContent = 'Processing ' + current + ' of ' + total;
        progressPercent.textContent = percent + '%';
        progressFill.style.width = percent + '%';
    }

    /**
     * Sleep utility
     */
    function sleep(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }

    /**
     * Capture screenshot with retry logic
     */
    async function captureScreenshot(url, index, isPdf, useLocal) {
        var retries = 0;
        var lastError = null;

        while (retries <= MAX_RETRIES) {
            try {
                if (retries > 0) {
                    updateResultStatus(index, 'retrying', 'Retrying (' + retries + '/' + MAX_RETRIES + ')');
                    await sleep(RETRY_DELAY * retries);
                } else {
                    updateResultStatus(index, 'loading', 'Capturing...');
                }

                var proxyParam = useLocal ? 'local' : 'external';
                var pdfParam = isPdf ? 'true' : 'false';
                var endpoint = 'screenshot.py?url=' + encodeURIComponent(url) +
                               '&proxy=' + proxyParam +
                               '&pdf=' + pdfParam;

                var response = await fetch(endpoint);

                // Check if response is JSON (error) or binary (success)
                var contentType = response.headers.get('content-type') || '';

                if (contentType.includes('application/json')) {
                    var errorData = await response.json();
                    throw new Error(errorData.error || 'Unknown error');
                }

                if (!response.ok) {
                    throw new Error('HTTP error: ' + response.status);
                }

                var blob = await response.blob();

                // Get filename from Content-Disposition header or generate one
                var disposition = response.headers.get('content-disposition');
                var filename = 'screenshot.' + (isPdf ? 'pdf' : 'jpg');
                if (disposition) {
                    var match = disposition.match(/filename="(.+)"/);
                    if (match) {
                        filename = match[1];
                    }
                }

                updateResultStatus(index, 'success', 'Success');
                updateResultWithImage(index, blob, filename, isPdf);
                return { success: true };

            } catch (error) {
                lastError = error;
                retries++;
            }
        }

        // All retries failed
        updateResultStatus(index, 'error', 'Failed');
        updateResultWithError(index, lastError.message);
        return { success: false, error: lastError.message };
    }

    /**
     * Handle capture button click
     */
    async function handleCapture() {
        if (isProcessing) return;

        var urls = parseUrls(urlInput.value);

        if (urls.length === 0) {
            showError('Please enter at least one URL');
            return;
        }

        isProcessing = true;
        captureBtn.disabled = true;
        captureBtn.textContent = 'Processing...';
        hideError();

        // Reset results
        results = [];
        downloadableItems = [];
        resultsContainer.innerHTML = '';
        resultsSection.classList.remove('hidden');
        progressSection.classList.remove('hidden');
        hideDownloadAllButton();

        // Create result items
        var isPdf = pdfMode.checked;
        var useLocal = useLocalProxy.checked;

        for (var i = 0; i < urls.length; i++) {
            var item = createResultItem(urls[i], i);
            resultsContainer.appendChild(item);
        }

        // Process URLs one by one
        for (var j = 0; j < urls.length; j++) {
            updateProgress(j, urls.length);
            var result = await captureScreenshot(urls[j], j, isPdf, useLocal);
            results.push(result);
        }

        updateProgress(urls.length, urls.length);

        // Done
        isProcessing = false;
        captureBtn.disabled = false;
        captureBtn.textContent = 'Capture Screenshots';

        // Show summary
        var successCount = results.filter(function(r) { return r.success; }).length;
        if (successCount < urls.length) {
            showError('Completed with ' + (urls.length - successCount) + ' error(s)');
        }

        // Show Download All button if multiple successful downloads
        if (downloadableItems.length > 1) {
            showDownloadAllButton();
        }
    }

    /**
     * Download file utility
     */
    function downloadFile(url, filename) {
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /**
     * Show error message
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorSection.classList.remove('hidden');
    }

    /**
     * Hide error message
     */
    function hideError() {
        errorSection.classList.add('hidden');
    }

    /**
     * Escape HTML special characters
     */
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show Download All button
     */
    function showDownloadAllButton() {
        downloadAllBtn.textContent = 'Download All (' + downloadableItems.length + ')';
        downloadAllBtn.classList.remove('hidden');
    }

    /**
     * Hide Download All button
     */
    function hideDownloadAllButton() {
        downloadAllBtn.classList.add('hidden');
    }

    /**
     * Download all files
     */
    function downloadAll() {
        var delay = 300;
        downloadableItems.forEach(function(item, index) {
            setTimeout(function() {
                downloadFile(item.url, item.filename);
            }, index * delay);
        });
    }

})();
