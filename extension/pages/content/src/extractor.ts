// Page data extraction utilities for How Was This Built
import { colord, extend } from 'colord';
import labPlugin from 'colord/plugins/lab';

// Extend colord with LAB color space support for perceptual color distance
extend([labPlugin]);

export interface TechSignals {
  nextjs: boolean;
  nuxt: boolean;
  react: boolean;
  vue: boolean;
  angular: boolean;
  svelte: boolean;
  tailwind: boolean;
  wordpress: boolean;
  gatsby: boolean;
  remix: boolean;
}

export interface ExtractedFont {
  family: string;
  usage: 'heading' | 'body' | 'code' | 'other';
}

export interface ExtractedButton {
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontWeight: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  borderColor?: string;
  borderWidth?: string;
  padding?: string;
  fontSize?: string;
  fontFamily?: string;
  boxShadow?: string;
  textTransform?: string;
  letterSpacing?: string;
}

export interface PageData {
  url: string;
  title: string;
  html: string;
  scripts: string[];
  stylesheets: string[];
  metaTags: Record<string, string>;
  techSignals: TechSignals;
  extractedColors?: string[]; // Hex colors extracted from computed styles
  extractedFonts?: ExtractedFont[]; // Fonts extracted from computed styles
  extractedButtons?: ExtractedButton[]; // Button styles extracted from DOM
  cssVariables?: Record<string, string>; // CSS custom properties from :root
}

const MAX_HTML_SIZE = 50000; // 50KB limit

/**
 * Detect frameworks and libraries from global variables and DOM patterns
 */
function detectTechSignals(): TechSignals {
  const win = window as Record<string, unknown>;

  // Check for Next.js
  const hasNextData = '__NEXT_DATA__' in win || document.getElementById('__NEXT_DATA__') !== null;

  // Check for Nuxt
  const hasNuxt = '__NUXT__' in win || '__NUXT_DATA__' in win;

  // Check for React
  const hasReact =
    '__REACT_DEVTOOLS_GLOBAL_HOOK__' in win ||
    document.querySelector('[data-reactroot]') !== null ||
    document.querySelector('[data-reactid]') !== null ||
    Array.from(document.querySelectorAll('*')).some(el =>
      Object.keys(el).some(key => key.startsWith('__react'))
    );

  // Check for Vue
  const hasVue = '__VUE__' in win || '__VUE_DEVTOOLS_GLOBAL_HOOK__' in win;

  // Check for Angular
  const hasAngular =
    'ng' in win ||
    document.querySelector('[ng-version]') !== null ||
    document.querySelector('[ng-app]') !== null;

  // Check for Svelte
  const hasSvelte = Array.from(document.querySelectorAll('*')).some(el =>
    Array.from(el.classList).some(cls => cls.startsWith('svelte-'))
  );

  // Check for Tailwind CSS (look for utility classes)
  const hasTailwind = detectTailwind();

  // Check for WordPress
  const hasWordpress =
    document.querySelector('link[href*="wp-content"]') !== null ||
    document.querySelector('script[src*="wp-content"]') !== null ||
    document.querySelector('meta[name="generator"][content*="WordPress"]') !== null;

  // Check for Gatsby
  const hasGatsby =
    '___gatsby' in win ||
    document.getElementById('___gatsby') !== null;

  // Check for Remix
  const hasRemix = '__remixContext' in win;

  return {
    nextjs: hasNextData,
    nuxt: hasNuxt,
    react: hasReact,
    vue: hasVue,
    angular: hasAngular,
    svelte: hasSvelte,
    tailwind: hasTailwind,
    wordpress: hasWordpress,
    gatsby: hasGatsby,
    remix: hasRemix,
  };
}

/**
 * Detect Tailwind CSS by looking for common utility class patterns
 */
function detectTailwind(): boolean {
  const tailwindPatterns = [
    /^(flex|grid|block|inline|hidden)$/,
    /^(m|p|w|h|min-w|max-w|min-h|max-h)-\d+$/,
    /^(text|bg|border)-(red|blue|green|gray|slate|zinc|neutral|stone|orange|amber|yellow|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}$/,
    /^(rounded|shadow|opacity|z)-/,
    /^(sm|md|lg|xl|2xl):/,
    /^hover:/,
    /^dark:/,
  ];

  const sampleElements = document.querySelectorAll('body *');
  let tailwindMatches = 0;
  const samplesToCheck = Math.min(sampleElements.length, 100);

  for (let i = 0; i < samplesToCheck; i++) {
    const el = sampleElements[i];
    const classes = Array.from(el.classList);
    for (const cls of classes) {
      if (tailwindPatterns.some(pattern => pattern.test(cls))) {
        tailwindMatches++;
        if (tailwindMatches >= 5) return true;
      }
    }
  }

  return false;
}

/**
 * Extract all external script URLs
 */
function extractScripts(): string[] {
  const scripts = document.querySelectorAll('script[src]');
  return Array.from(scripts)
    .map(script => script.getAttribute('src') || '')
    .filter(src => src.length > 0);
}

/**
 * Extract all external stylesheet URLs
 */
function extractStylesheets(): string[] {
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  return Array.from(stylesheets)
    .map(link => link.getAttribute('href') || '')
    .filter(href => href.length > 0);
}

/**
 * Extract meta tags as key-value pairs
 */
function extractMetaTags(): Record<string, string> {
  const metas = document.querySelectorAll('meta');
  const result: Record<string, string> = {};

  metas.forEach(meta => {
    const name = meta.getAttribute('name') || meta.getAttribute('property') || meta.getAttribute('http-equiv');
    const content = meta.getAttribute('content');

    if (name && content) {
      result[name] = content;
    }
  });

  return result;
}

/**
 * Get truncated HTML of the page
 */
function getHTML(): string {
  const html = document.documentElement.outerHTML;
  if (html.length > MAX_HTML_SIZE) {
    return html.slice(0, MAX_HTML_SIZE) + '\n<!-- TRUNCATED -->';
  }
  return html;
}

/**
 * Convert RGB/RGBA color string to hex
 */
function rgbToHex(rgb: string): string | null {
  // Handle rgb(r, g, b) and rgba(r, g, b, a)
  const match = rgb.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return null;

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  // Convert to hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Check if a color is "interesting" (not pure white, black, or transparent)
 */
function isInterestingColor(hex: string): boolean {
  if (!hex) return false;

  const normalized = hex.toUpperCase();

  // Filter out pure white, near-white, pure black, near-black
  const boringColors = [
    '#FFFFFF', '#FEFEFE', '#FDFDFD', '#FCFCFC', '#FBFBFB', '#FAFAFA', '#F9F9F9', '#F8F8F8',
    '#000000', '#010101', '#020202', '#030303', '#040404', '#050505',
    '#TRANSPARENT', 'TRANSPARENT',
  ];

  if (boringColors.includes(normalized)) return false;

  // Filter out grays (where R, G, B are very close)
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);

  // If all values are within 10 of each other and it's very light or very dark, skip
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  if (maxDiff < 15 && (r > 240 || r < 20)) return false;

  return true;
}

/**
 * Check if a color is saturated (has actual hue, not gray)
 */
function isColorful(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate saturation-like metric
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  // If the difference between max and min is significant, it's colorful
  return diff > 30;
}

/**
 * Calculate relative luminance for WCAG contrast ratio
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getRelativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculate WCAG contrast ratio between two colors
 * Returns a value between 1 and 21
 */
function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a button has sufficient contrast for accessibility
 * This is specifically to filter out extraction errors where we get
 * dark backgrounds with dark text (contrast < 2:1 is clearly broken)
 */
function hasAccessibleContrast(bgColor: string, textColor: string): boolean {
  // Handle transparent backgrounds - assume they're accessible
  if (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') {
    return true;
  }

  // Ensure we have valid hex colors
  if (!bgColor.startsWith('#') || !textColor.startsWith('#')) {
    return true; // Can't determine, assume accessible
  }

  const ratio = getContrastRatio(bgColor, textColor);
  // Only filter out severely broken buttons (contrast < 2:1)
  // This catches dark-on-dark extraction errors without removing valid buttons
  return ratio >= 2;
}

/**
 * Check if an element should be excluded from color extraction
 * (likely a logo, image, decorative element, or third-party widget)
 */
function shouldExcludeElement(el: HTMLElement): boolean {
  const tagName = el.tagName.toLowerCase();

  // Always exclude images, videos, canvases, iframes
  if (['img', 'video', 'canvas', 'iframe', 'picture', 'source'].includes(tagName)) {
    return true;
  }

  // Exclude SVGs unless they're small icons (likely in buttons)
  if (tagName === 'svg') {
    const rect = el.getBoundingClientRect();
    // Allow small SVGs (icons) but exclude large ones (logos, illustrations)
    if (rect.width > 48 || rect.height > 48) {
      return true;
    }
  }

  // Check class and id for logo-related names
  const classAndId = ((el.className || '') + ' ' + (el.id || '')).toLowerCase();
  const logoPatterns = ['logo', 'brand', 'icon-', 'avatar', 'profile-pic', 'thumbnail', 'gallery', 'carousel', 'slider', 'hero-image', 'banner-img'];
  if (logoPatterns.some(pattern => classAndId.includes(pattern))) {
    return true;
  }

  // Check for third-party widget/noise patterns (customer logos, chat widgets, social icons)
  const noisePatterns = [
    'customer', 'client', 'partner', 'trusted', 'testimonial',
    'social', 'widget', 'chat', 'intercom', 'hubspot', 'crisp',
    'drift', 'zendesk', 'freshdesk', 'badge', 'sponsor'
  ];
  if (noisePatterns.some(pattern => classAndId.includes(pattern))) {
    return true;
  }

  // Check if inside footer badge/partner section
  try {
    const isInFooterNoise = el.closest('footer [class*="badge"], footer [class*="partner"], footer [class*="sponsor"], [class*="trusted-by"], [class*="as-seen"]');
    if (isInFooterNoise) return true;
  } catch {
    // closest might fail on some elements
  }

  // Check if element is inside a logo container
  const parent = el.parentElement;
  if (parent) {
    const parentClassAndId = ((parent.className || '') + ' ' + (parent.id || '')).toLowerCase();
    if (logoPatterns.some(pattern => parentClassAndId.includes(pattern))) {
      return true;
    }
    if (noisePatterns.some(pattern => parentClassAndId.includes(pattern))) {
      return true;
    }
  }

  return false;
}

/**
 * Check if an element is a UI component (should be prioritized)
 */
function isUIComponent(el: HTMLElement): boolean {
  const tagName = el.tagName.toLowerCase();

  // Common UI component tags
  if (['button', 'input', 'select', 'textarea', 'nav', 'header', 'footer', 'main', 'aside', 'form'].includes(tagName)) {
    return true;
  }

  // Check for common UI component classes
  const className = (el.className || '').toLowerCase();
  const uiPatterns = [
    'btn', 'button', 'card', 'modal', 'dialog', 'dropdown', 'menu', 'nav', 'tab',
    'badge', 'tag', 'chip', 'pill', 'alert', 'toast', 'notification',
    'input', 'form', 'field', 'select', 'checkbox', 'radio',
    'header', 'footer', 'sidebar', 'toolbar', 'panel',
    'cta', 'primary', 'secondary', 'accent'
  ];

  return uiPatterns.some(pattern => className.includes(pattern));
}

/**
 * Get the visual weight of an element based on its size
 */
function getElementWeight(el: HTMLElement): number {
  try {
    const rect = el.getBoundingClientRect();
    const area = rect.width * rect.height;

    // Normalize area to a weight (larger = more weight, but with diminishing returns)
    // Use log scale to prevent huge elements from dominating
    if (area < 100) return 1;
    if (area < 1000) return 2;
    if (area < 5000) return 3;
    if (area < 20000) return 5;
    if (area < 50000) return 7;
    return 10;
  } catch {
    return 1;
  }
}

/**
 * Extract dominant colors from the page by scanning computed styles
 * Prioritizes UI components and excludes logos/images
 */
function extractColors(): string[] {
  console.log('[HWTB Extractor] Starting sophisticated color extraction...');
  const colorCounts = new Map<string, number>();
  const colorSources = new Map<string, Set<string>>(); // Track where each color comes from

  // Helper to add a color with source tracking
  const addColor = (hex: string, weight: number, source: string) => {
    const count = colorCounts.get(hex) || 0;
    colorCounts.set(hex, count + weight);

    if (!colorSources.has(hex)) {
      colorSources.set(hex, new Set());
    }
    colorSources.get(hex)!.add(source);
  };

  // PASS 1: High-priority UI components (buttons, CTAs, nav)
  const primaryUIElements = document.querySelectorAll(
    'button, [role="button"], input[type="submit"], input[type="button"], ' +
    'a[class*="btn"], a[class*="button"], a[class*="cta"], ' +
    '[class*="btn-primary"], [class*="btn-secondary"], [class*="button-primary"], ' +
    'nav, header nav, [role="navigation"]'
  );

  console.log('[HWTB Extractor] Pass 1: Found', primaryUIElements.length, 'primary UI elements');

  for (const el of primaryUIElements) {
    if (shouldExcludeElement(el as HTMLElement)) continue;

    try {
      const styles = window.getComputedStyle(el);
      const bgColor = styles.getPropertyValue('background-color');

      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        const hex = rgbToHex(bgColor);
        if (hex && isInterestingColor(hex) && isColorful(hex)) {
          // Very high weight for colorful button/CTA backgrounds - primary brand colors
          addColor(hex, 50, 'primary-ui');
          console.log('[HWTB Extractor] Found primary UI color:', hex);
        }
      }
    } catch {
      // Skip
    }
  }

  // PASS 2: Secondary UI components (cards, sections, containers)
  const secondaryUIElements = document.querySelectorAll(
    '[class*="card"], [class*="panel"], [class*="section"], [class*="container"], ' +
    '[class*="box"], [class*="tile"], [class*="item"], ' +
    'article, section, aside, main, footer'
  );

  console.log('[HWTB Extractor] Pass 2: Found', secondaryUIElements.length, 'secondary UI elements');

  for (const el of secondaryUIElements) {
    if (shouldExcludeElement(el as HTMLElement)) continue;

    try {
      const styles = window.getComputedStyle(el);
      const bgColor = styles.getPropertyValue('background-color');

      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        const hex = rgbToHex(bgColor);
        if (hex && isInterestingColor(hex)) {
          const weight = isColorful(hex) ? 15 : 5;
          addColor(hex, weight, 'secondary-ui');
        }
      }
    } catch {
      // Skip
    }
  }

  // PASS 3: General scan with exclusions and area-based weighting
  const allElements = document.querySelectorAll('body *');
  const elementsToScan = Math.min(allElements.length, 300);
  console.log('[HWTB Extractor] Pass 3: Scanning', elementsToScan, 'general elements');

  for (let i = 0; i < elementsToScan; i++) {
    const el = allElements[i] as HTMLElement;

    // Skip excluded elements (logos, images, etc.)
    if (shouldExcludeElement(el)) continue;

    try {
      const styles = window.getComputedStyle(el);
      const tagName = el.tagName.toLowerCase();
      const isUI = isUIComponent(el);
      const areaWeight = getElementWeight(el);

      // Background color
      const bgColor = styles.getPropertyValue('background-color');
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        const hex = rgbToHex(bgColor);
        if (hex && isInterestingColor(hex)) {
          let weight = isColorful(hex) ? 5 : 1;
          weight *= areaWeight;
          if (isUI) weight *= 2;
          addColor(hex, weight, 'general-bg');
        }
      }

      // Text color - only for important text elements and if colorful
      if (['h1', 'h2', 'h3', 'a', 'button'].includes(tagName)) {
        const textColor = styles.getPropertyValue('color');
        if (textColor && textColor !== 'rgba(0, 0, 0, 0)') {
          const hex = rgbToHex(textColor);
          if (hex && isInterestingColor(hex) && isColorful(hex)) {
            addColor(hex, 3, 'text');
          }
        }
      }
    } catch {
      // Skip
    }
  }

  // PASS 4: CSS custom properties (design tokens - highly reliable)
  try {
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j] as CSSStyleRule;
          if (rule.selectorText === ':root' || rule.selectorText === 'html') {
            const styleText = rule.style.cssText;
            // Look for color-like CSS variables (prioritize ones with "primary", "accent", etc.)
            const colorVarMatches = styleText.matchAll(/--([\w-]+):\s*(#[a-fA-F0-9]{3,8}|rgb[a]?\([^)]+\))/g);
            for (const match of colorVarMatches) {
              const varName = match[1].toLowerCase();
              let colorValue = match[2];

              // Higher weight for semantically named colors
              let weight = 5;
              if (varName.includes('primary') || varName.includes('accent') || varName.includes('brand')) {
                weight = 20;
              } else if (varName.includes('secondary') || varName.includes('highlight')) {
                weight = 10;
              }

              if (colorValue.startsWith('#')) {
                if (colorValue.length === 4) {
                  colorValue = `#${colorValue[1]}${colorValue[1]}${colorValue[2]}${colorValue[2]}${colorValue[3]}${colorValue[3]}`;
                }
                if (isInterestingColor(colorValue.toUpperCase())) {
                  addColor(colorValue.toUpperCase(), weight, 'css-var');
                }
              } else {
                const hex = rgbToHex(colorValue);
                if (hex && isInterestingColor(hex)) {
                  addColor(hex, weight, 'css-var');
                }
              }
            }
          }
        }
      } catch {
        // CORS errors
      }
    }
  } catch {
    // Ignore
  }

  // Log analysis
  console.log('[HWTB Extractor] Total unique colors found:', colorCounts.size);
  console.log('[HWTB Extractor] Color sources:', Object.fromEntries(
    Array.from(colorSources.entries()).map(([color, sources]) => [color, Array.from(sources)])
  ));

  // Filter: Only keep colors that appear in multiple sources OR have very high weight
  // This helps filter out one-off colors from logos
  const reliableColors = Array.from(colorCounts.entries())
    .filter(([color, weight]) => {
      const sources = colorSources.get(color)!;
      // Keep if: multiple sources, or primary UI source, or CSS variable, or very high weight
      return sources.size > 1 ||
             sources.has('primary-ui') ||
             sources.has('css-var') ||
             weight >= 30;
    });

  console.log('[HWTB Extractor] Reliable colors after filtering:', reliableColors.length);

  // Sort: colorful first, then by weight
  const sortedColors = reliableColors
    .sort((a, b) => {
      const aColorful = isColorful(a[0]) ? 1 : 0;
      const bColorful = isColorful(b[0]) ? 1 : 0;
      if (aColorful !== bColorful) return bColorful - aColorful;
      return b[1] - a[1];
    })
    .map(([color]) => color);

  console.log('[HWTB Extractor] Sorted colors:', sortedColors.slice(0, 10));

  // Deduplicate similar colors using perceptual DeltaE distance
  // DeltaE < 5 means colors are perceptually indistinguishable to most people
  const uniqueColors: string[] = [];
  for (const color of sortedColors) {
    if (uniqueColors.length >= 8) break;

    const isSimilar = uniqueColors.some(existing => {
      try {
        const lab1 = colord(existing).toLab();
        const lab2 = colord(color).toLab();
        // CIE76 DeltaE formula - simple Euclidean distance in LAB space
        const deltaE = Math.sqrt(
          Math.pow(lab1.l - lab2.l, 2) +
          Math.pow(lab1.a - lab2.a, 2) +
          Math.pow(lab1.b - lab2.b, 2)
        );
        return deltaE < 5;
      } catch {
        // Fallback to RGB comparison if LAB conversion fails
        const r1 = parseInt(existing.slice(1, 3), 16);
        const g1 = parseInt(existing.slice(3, 5), 16);
        const b1 = parseInt(existing.slice(5, 7), 16);
        const r2 = parseInt(color.slice(1, 3), 16);
        const g2 = parseInt(color.slice(3, 5), 16);
        const b2 = parseInt(color.slice(5, 7), 16);
        return Math.abs(r1 - r2) < 25 && Math.abs(g1 - g2) < 25 && Math.abs(b1 - b2) < 25;
      }
    });

    if (!isSimilar) {
      uniqueColors.push(color);
    }
  }

  console.log('[HWTB Extractor] Final palette:', uniqueColors);
  return uniqueColors;
}

/**
 * List of generic system fonts to filter out
 */
const SYSTEM_FONTS = [
  'system-ui', '-apple-system', 'blinkmacsystemfont', 'segoe ui',
  'arial', 'helvetica', 'sans-serif', 'serif', 'monospace',
  'times new roman', 'times', 'courier new', 'courier',
  'ui-sans-serif', 'ui-serif', 'ui-monospace'
];

/**
 * Clean font family string by removing quotes and extra whitespace
 */
function cleanFontFamily(fontFamily: string): string {
  return fontFamily
    .split(',')[0] // Take first font in stack
    .trim()
    .replace(/["']/g, '') // Remove quotes
    .trim();
}

/**
 * Check if a font is a generic system font
 */
function isSystemFont(font: string): boolean {
  const normalized = font.toLowerCase();
  return SYSTEM_FONTS.some(sf => normalized.includes(sf));
}

/**
 * Extract fonts used on the page
 */
function extractFonts(): ExtractedFont[] {
  console.log('[HWTB Extractor] Starting font extraction...');
  const fontUsage = new Map<string, { count: number; usage: Set<string> }>();

  // Scan headings
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(h => {
    try {
      const styles = window.getComputedStyle(h);
      const family = cleanFontFamily(styles.fontFamily);
      if (family && !isSystemFont(family)) {
        if (!fontUsage.has(family)) {
          fontUsage.set(family, { count: 0, usage: new Set() });
        }
        fontUsage.get(family)!.count++;
        fontUsage.get(family)!.usage.add('heading');
      }
    } catch {
      // Skip
    }
  });

  // Scan body text
  const bodyElements = document.querySelectorAll('p, span, div, li, td, label');
  const samplesToScan = Math.min(bodyElements.length, 100);
  for (let i = 0; i < samplesToScan; i++) {
    const el = bodyElements[i];
    try {
      const styles = window.getComputedStyle(el);
      const family = cleanFontFamily(styles.fontFamily);
      if (family && !isSystemFont(family)) {
        if (!fontUsage.has(family)) {
          fontUsage.set(family, { count: 0, usage: new Set() });
        }
        fontUsage.get(family)!.count++;
        fontUsage.get(family)!.usage.add('body');
      }
    } catch {
      // Skip
    }
  }

  // Scan code elements
  const codeElements = document.querySelectorAll('code, pre, .code, [class*="mono"]');
  codeElements.forEach(el => {
    try {
      const styles = window.getComputedStyle(el);
      const family = cleanFontFamily(styles.fontFamily);
      if (family && !isSystemFont(family)) {
        if (!fontUsage.has(family)) {
          fontUsage.set(family, { count: 0, usage: new Set() });
        }
        fontUsage.get(family)!.count++;
        fontUsage.get(family)!.usage.add('code');
      }
    } catch {
      // Skip
    }
  });

  // Convert to array and determine primary usage
  const fonts: ExtractedFont[] = [];
  for (const [family, data] of fontUsage.entries()) {
    let usage: 'heading' | 'body' | 'code' | 'other' = 'other';
    // Priority: heading > code > body > other
    if (data.usage.has('heading')) usage = 'heading';
    else if (data.usage.has('code')) usage = 'code';
    else if (data.usage.has('body')) usage = 'body';

    fonts.push({ family, usage });
  }

  // Sort by usage priority (heading first) and return top fonts
  const sortOrder = { heading: 0, body: 1, code: 2, other: 3 };
  fonts.sort((a, b) => sortOrder[a.usage] - sortOrder[b.usage]);

  console.log('[HWTB Extractor] Extracted fonts:', fonts.slice(0, 5));
  return fonts.slice(0, 5);
}

/**
 * Extract button styles from the page
 */
function extractButtons(): ExtractedButton[] {
  console.log('[HWTB Extractor] Starting button extraction...');
  const buttons: ExtractedButton[] = [];
  const buttonElements = document.querySelectorAll(
    'button, [role="button"], input[type="submit"], input[type="button"], ' +
    'a[class*="btn"], a[class*="button"], [class*="btn-"], [class*="button-"]'
  );

  const seenStyles = new Set<string>();

  for (let i = 0; i < buttonElements.length; i++) {
    if (buttons.length >= 3) break; // Max 3 button styles for variety
    const el = buttonElements[i];
    if (shouldExcludeElement(el as HTMLElement)) continue;

    // Skip very small or hidden elements
    const rect = el.getBoundingClientRect();
    if (rect.width < 30 || rect.height < 20) continue;

    try {
      const styles = window.getComputedStyle(el);
      const bgColor = rgbToHex(styles.backgroundColor) || 'transparent';
      const textColor = rgbToHex(styles.color) || '#000000';
      const borderRadius = styles.borderRadius;
      const borderColorRaw = styles.borderColor;
      const borderColor = rgbToHex(borderColorRaw) || undefined;
      const borderWidth = styles.borderWidth;
      const padding = styles.padding;
      const fontSize = styles.fontSize;
      const fontFamily = cleanFontFamily(styles.fontFamily);
      const boxShadow = styles.boxShadow !== 'none' ? styles.boxShadow : undefined;
      const textTransform = styles.textTransform !== 'none' ? styles.textTransform : undefined;
      const letterSpacing = styles.letterSpacing !== 'normal' ? styles.letterSpacing : undefined;

      // Create a style signature to avoid duplicates (include more properties for accuracy)
      const signature = `${bgColor}-${textColor}-${borderRadius}-${padding}-${borderColor || 'none'}`;
      if (seenStyles.has(signature)) continue;
      seenStyles.add(signature);

      // Skip buttons with boring/invisible backgrounds (likely just text links)
      const bgIsTransparent = bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)';
      const hasBorder = borderWidth && parseFloat(borderWidth) > 0 && borderColor && borderColor !== bgColor;

      // Determine variant
      let variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
      if (bgIsTransparent) {
        if (hasBorder) {
          variant = 'outline';
        } else {
          variant = 'ghost';
        }
      } else if (!isColorful(bgColor)) {
        variant = 'secondary';
      }

      // Skip ghost buttons if we already have a primary - they're less interesting
      if (variant === 'ghost' && buttons.some(b => b.variant === 'primary')) {
        continue;
      }

      // Skip buttons with poor contrast (likely extraction errors or inaccessible buttons)
      if (!hasAccessibleContrast(bgColor, textColor)) {
        continue;
      }

      buttons.push({
        backgroundColor: bgColor,
        textColor: textColor,
        borderRadius: borderRadius,
        fontWeight: styles.fontWeight,
        variant,
        borderColor: hasBorder ? borderColor : undefined,
        borderWidth: hasBorder ? borderWidth : undefined,
        padding: padding,
        fontSize: fontSize,
        fontFamily: fontFamily && !isSystemFont(fontFamily) ? fontFamily : undefined,
        boxShadow: boxShadow,
        textTransform: textTransform,
        letterSpacing: letterSpacing,
      });
    } catch {
      // Skip
    }
  }

  console.log('[HWTB Extractor] Extracted buttons:', buttons);
  return buttons;
}

/**
 * Extract CSS custom properties from :root that contain color values
 * Returns a map of variable name to hex color value
 */
function extractCSSVariables(): Record<string, string> {
  console.log('[HWTB Extractor] Starting CSS variable extraction...');
  const cssVars: Record<string, string> = {};

  try {
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j] as CSSStyleRule;
          if (rule.selectorText === ':root' || rule.selectorText === 'html') {
            const styleText = rule.style.cssText;
            // Extract all CSS variables with color-like values
            const colorVarMatches = styleText.matchAll(/--([\w-]+):\s*(#[a-fA-F0-9]{3,8}|rgb[a]?\([^)]+\))/g);
            for (const match of colorVarMatches) {
              const varName = `--${match[1]}`;
              let colorValue = match[2];

              // Normalize hex colors
              if (colorValue.startsWith('#')) {
                if (colorValue.length === 4) {
                  colorValue = `#${colorValue[1]}${colorValue[1]}${colorValue[2]}${colorValue[2]}${colorValue[3]}${colorValue[3]}`;
                }
                colorValue = colorValue.toUpperCase();
              } else {
                // Convert rgb/rgba to hex
                const hex = rgbToHex(colorValue);
                if (hex) {
                  colorValue = hex;
                } else {
                  continue;
                }
              }

              cssVars[varName] = colorValue;
            }
          }
        }
      } catch {
        // CORS errors for cross-origin stylesheets
      }
    }
  } catch {
    // Ignore
  }

  console.log('[HWTB Extractor] Extracted CSS variables:', Object.keys(cssVars).length);
  return cssVars;
}

/**
 * Main function to extract all page data
 */
export function extractPageData(): PageData {
  return {
    url: window.location.href,
    title: document.title,
    html: getHTML(),
    scripts: extractScripts(),
    stylesheets: extractStylesheets(),
    metaTags: extractMetaTags(),
    techSignals: detectTechSignals(),
    extractedColors: extractColors(),
    extractedFonts: extractFonts(),
    extractedButtons: extractButtons(),
    cssVariables: extractCSSVariables(),
  };
}
