/**
 * AI-powered color categorization for design system analysis
 * Ported from api/lib/colorCategorizer.ts
 */

import { callOpenRouterWithVision, callOpenRouter, type OpenRouterOptions } from './openrouter';

const VISION_CATEGORIZATION_PROMPT = `You are analyzing a website screenshot to identify its design system color palette.

I've extracted these candidate colors from the DOM (ordered by visual prominence):
{colors}

Looking at the screenshot, assign each color to its semantic role in the design system:

IMPORTANT GUIDELINES:
1. Only assign colors that are actually part of the DESIGN SYSTEM - ignore:
   - Customer/partner logos in "Trusted by" sections
   - Social media icons
   - Third-party chat widgets (Intercom, HubSpot, etc.)
   - One-off illustration colors
   - Image backgrounds

2. Identify these roles (only include ones you're confident about):
   - background: Page/section background color
   - foreground: Primary body text color
   - primary: Main brand color, used for CTAs and primary buttons
   - secondary: Supporting UI color, less prominent than primary
   - accent: Highlight/emphasis color, used sparingly
   - muted: Subdued color for secondary text, placeholders
   - border: Divider and input border color
   - destructive: Error/warning color (red/orange) if visible

3. If you see a color in the screenshot that's clearly part of the design system but wasn't in my extracted list, include it anyway.

4. If this appears to be a known design system (Shadcn, Tailwind, Radix, Material), note it in possibleSystem.

Return ONLY valid JSON with hex color values:
{
  "background": "#FFFFFF",
  "foreground": "#1A1A1A",
  "primary": "#0066CC",
  "secondary": "#6B7280",
  "accent": "#F59E0B",
  "muted": "#9CA3AF",
  "border": "#E5E7EB",
  "possibleSystem": "shadcn"
}

Only include roles you're confident about. Omit uncertain ones.`;

const TEXT_ONLY_CATEGORIZATION_PROMPT = `You are a design system expert. Given these extracted colors from a website, assign them to semantic roles.

Colors (ordered by visual prominence):
{colors}

Assign each color to ONE of these roles based on its properties:
- background: Lightest color, used for page background
- foreground: Darkest color, used for body text
- primary: Brand color, used for CTAs/buttons (often saturated)
- secondary: Supporting color, less prominent than primary
- accent: Highlight color, used sparingly for emphasis
- muted: Subdued color for secondary text/borders
- border: Color used for dividers and input borders
- destructive: Red/orange used for errors/warnings (if present)

Return ONLY valid JSON with hex color values:
{
  "background": "#FFFFFF",
  "foreground": "#1A1A1A",
  "primary": "#0066CC",
  "secondary": "#6B7280",
  "accent": "#F59E0B",
  "muted": "#9CA3AF",
  "border": "#E5E7EB"
}

Only include roles you're confident about. Omit uncertain ones.`;

export interface CategorizedColors {
  background?: string;
  foreground?: string;
  primary?: string;
  secondary?: string;
  accent?: string;
  muted?: string;
  border?: string;
  destructive?: string;
  possibleSystem?: string;
}

/**
 * Categorize colors using AI vision analysis with screenshot context
 * This is the primary method - gives AI full visual context for accurate role assignment
 */
export async function categorizeColorsWithVision(
  screenshot: string,
  extractedColors: string[],
  cssVariables: Record<string, string> | undefined,
  options: OpenRouterOptions
): Promise<CategorizedColors> {
  let prompt = VISION_CATEGORIZATION_PROMPT.replace('{colors}', extractedColors.join(', '));

  // Add CSS variable context if available - helps AI understand existing semantic naming
  if (cssVariables && Object.keys(cssVariables).length > 0) {
    const relevantVars = Object.entries(cssVariables)
      .filter(([name]) => {
        const n = name.toLowerCase();
        return n.includes('primary') || n.includes('secondary') || n.includes('accent') ||
               n.includes('background') || n.includes('foreground') || n.includes('text') ||
               n.includes('muted') || n.includes('border') || n.includes('destructive') ||
               n.includes('danger') || n.includes('error');
      })
      .slice(0, 20); // Limit to avoid token overflow

    if (relevantVars.length > 0) {
      prompt += `\n\nI also found these CSS custom properties that may indicate the design system:\n${
        relevantVars.map(([name, value]) => `${name}: ${value}`).join('\n')
      }`;
    }
  }

  const response = await callOpenRouterWithVision(
    'You are an expert UI/UX designer analyzing website design systems. Respond only with valid JSON.',
    prompt,
    screenshot,
    { ...options, temperature: 0.2, maxTokens: 800 }
  );

  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in vision categorization response');
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('Invalid JSON in vision categorization response');
  }

  // Validate and normalize the response
  return normalizeColorResponse(parsed);
}

/**
 * Fallback: Categorize colors using text-only AI analysis
 * Used when no screenshot is available
 */
export async function categorizeColorsTextOnly(
  extractedColors: string[],
  cssVariables: Record<string, string> | undefined,
  options: OpenRouterOptions
): Promise<CategorizedColors> {
  let prompt = TEXT_ONLY_CATEGORIZATION_PROMPT.replace('{colors}', extractedColors.join(', '));

  // Add CSS variable context if available
  if (cssVariables && Object.keys(cssVariables).length > 0) {
    const relevantVars = Object.entries(cssVariables)
      .filter(([name]) => {
        const n = name.toLowerCase();
        return n.includes('primary') || n.includes('secondary') || n.includes('accent') ||
               n.includes('background') || n.includes('foreground') || n.includes('text') ||
               n.includes('muted') || n.includes('border') || n.includes('destructive');
      })
      .slice(0, 15);

    if (relevantVars.length > 0) {
      prompt += `\n\nCSS variables found:\n${
        relevantVars.map(([name, value]) => `${name}: ${value}`).join('\n')
      }`;
    }
  }

  const response = await callOpenRouter([
    { role: 'system', content: 'You are a design system expert. Respond only with valid JSON.' },
    { role: 'user', content: prompt }
  ], { ...options, temperature: 0.2, maxTokens: 500 });

  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in text categorization response');
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('Invalid JSON in text categorization response');
  }
  return normalizeColorResponse(parsed);
}

/**
 * Normalize and validate the AI response
 */
function normalizeColorResponse(response: Record<string, unknown>): CategorizedColors {
  const result: CategorizedColors = {};

  const colorRoles = ['background', 'foreground', 'primary', 'secondary', 'accent', 'muted', 'border', 'destructive'];

  for (const role of colorRoles) {
    const value = response[role];
    if (typeof value === 'string' && isValidHexColor(value)) {
      result[role as keyof CategorizedColors] = normalizeHex(value);
    }
  }

  // Handle possibleSystem
  if (typeof response.possibleSystem === 'string') {
    const system = response.possibleSystem.toLowerCase();
    if (['tailwind', 'shadcn', 'radix', 'material', 'custom'].includes(system)) {
      result.possibleSystem = system;
    }
  }

  return result;
}

/**
 * Check if a string is a valid hex color
 */
function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(color);
}

/**
 * Normalize hex color to uppercase 6-digit format
 */
function normalizeHex(hex: string): string {
  let normalized = hex.toUpperCase();

  // Expand 3-digit hex to 6-digit
  if (normalized.length === 4) {
    normalized = `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
  }

  // Strip alpha channel if present (8-digit to 6-digit)
  if (normalized.length === 9) {
    normalized = normalized.slice(0, 7);
  }

  return normalized;
}
