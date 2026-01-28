# OmniTools

Pre-built distribution of [omni-tools](https://github.com/iib0011/omni-tools).

## Version

**Current Version: 0.6.0**

Source: https://github.com/iib0011/omni-tools/releases/tag/v0.6.0

## Build Configuration

This is a consolidated production build with:
- Relative asset paths (base: './')
- Single CSS file
- Single app JS + single vendor JS
- Only English (en) and French (fr) locales

## Updating

To update to a newer version:

1. Clone the omni-tools repo at the desired version tag
2. Run `npm install` (remove `locize-cli` from devDependencies if needed)
3. Modify `vite.config.ts`: add `base: './'` and configure manualChunks
4. Run `npx vite build`
5. Remove non-en/fr locales from `dist/locales/`
6. Replace this folder's contents with the `dist/` output
