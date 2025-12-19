import { readFileSync } from 'node:fs';
import type { ManifestType } from '@extension/shared';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

/**
 * How Was This Built - Chrome Extension Manifest
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  name: 'How Was This Built?',
  version: packageJson.version,
  description: 'Understand how any website is built. Get AI-powered explanations of tech stacks, architecture, design systems, and UX patterns.',
  // <all_urls> is required for chrome.tabs.captureVisibleTab() to work
  // The more restrictive ['http://*/*', 'https://*/*'] doesn't grant screenshot permission
  host_permissions: ['<all_urls>'],
  permissions: ['storage', 'scripting', 'tabs', 'activeTab', 'sidePanel', 'favicon'],
  background: {
    service_worker: 'background.js',
    type: 'module',
  },
  action: {
    default_icon: 'icon-34.png',
  },
  icons: {
    '128': 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['content/all.iife.js'],
    },
  ],
  web_accessible_resources: [
    {
      // Only expose the minimum required resources
      // Icons are needed for display, content.css for content script styling
      resources: ['icon-128.png', 'icon-34.png'],
      // Restrict to http/https only (not all origins)
      matches: ['http://*/*', 'https://*/*'],
    },
  ],
  side_panel: {
    default_path: 'side-panel/index.html',
  },
} satisfies ManifestType;

export default manifest;
