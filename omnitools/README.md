# OmniTools

Pre-built distribution of [omni-tools](https://github.com/iib0011/omni-tools).

## Version

**Current Version: 0.6.0**

Source: https://github.com/iib0011/omni-tools/releases/tag/v0.6.0

## Build Configuration

This is a consolidated production build with:
- Single CSS file
- Single app JS + single vendor JS
- Only English (en) and French (fr) locales
- Workers kept separate (required for functionality)

## About

OmniTools is a collection of online utilities for everyday tasks including:
- Image/video/audio processing
- PDF manipulation
- Text and list operations
- Date/time calculations
- Mathematical functions
- Data format conversion (JSON, CSV, XML)

All processing happens client-side.

## Updating

To update to a newer version:

1. Clone the omni-tools repo at the desired version tag
2. Run `npm install` (may need to remove `locize-cli` from devDependencies)
3. Modify `vite.config.ts` to consolidate chunks (manualChunks + cssCodeSplit: false)
4. Run `npx vite build`
5. Remove non-en/fr locales from `dist/locales/`
6. Replace this folder's contents with the `dist/` output
7. Update this README with the new version number
