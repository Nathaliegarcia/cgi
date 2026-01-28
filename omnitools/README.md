# OmniTools

Pre-built distribution of [omni-tools](https://github.com/iib0011/omni-tools).

## Version

**Current Version: 0.6.0**

Source: https://github.com/iib0011/omni-tools/releases/tag/v0.6.0

## About

OmniTools is a collection of online utilities for everyday tasks including:
- Image/video/audio processing
- PDF manipulation
- Text and list operations
- Date/time calculations
- Mathematical functions
- Data format conversion (JSON, CSV, XML)

All processing happens client-side - nothing ever leaves your device.

## Updating

To update to a newer version:

1. Clone the omni-tools repo at the desired version tag
2. Run `npm install` (may need to remove `locize-cli` from devDependencies if xlsx CDN is blocked)
3. Run `npx vite build`
4. Replace this folder's contents with the `dist/` output
5. Update this README with the new version number
