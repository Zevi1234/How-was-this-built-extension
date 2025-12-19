/**
 * Product/company tech stack research using AI
 * Ported from api/lib/search.ts
 */

import { callOpenRouter, type OpenRouterOptions } from './openrouter';

/**
 * Search for information about a company's tech stack using the LLM's knowledge
 * and any context clues from the page
 */
export async function searchProductInfo(
  domain: string,
  title: string,
  metaTags: Record<string, string> | undefined,
  options: OpenRouterOptions
): Promise<string | null> {
  try {
    // Extract company name from domain or title
    const companyName = extractCompanyName(domain, title);

    // Build context from meta tags (handle undefined metaTags)
    const tags = metaTags || {};
    const description = tags['description'] || tags['og:description'] || '';
    const keywords = tags['keywords'] || '';

    const prompt = `Based on your knowledge, what can you tell me about the tech stack of "${companyName}" (${domain})?

Context from their website:
- Title: ${title}
- Description: ${description}
${keywords ? `- Keywords: ${keywords}` : ''}

Please provide:
1. What their main product/service is
2. What technologies they likely use for their core product (based on your knowledge of the company, industry patterns, or any public information you're aware of)
3. Any notable technical decisions or interesting facts about their engineering

If you don't have specific information about this company, make educated guesses based on:
- The type of product/service they offer
- Common tech stacks for similar companies
- Any hints from the page description

Keep your response concise (3-5 sentences). Focus on the actual product tech, not the marketing site.`;

    const response = await callOpenRouter([
      { role: 'user', content: prompt }
    ], {
      ...options,
      temperature: 0.3,
      maxTokens: 500,
    });

    return response;
  } catch (error) {
    console.error('[HWTB] Product search error:', error);
    return null;
  }
}

function extractCompanyName(domain: string, title: string): string {
  // Remove common TLDs and www
  let name = domain
    .replace(/^www\./, '')
    .replace(/\.(com|io|co|org|net|app|dev|ai)$/, '')
    .replace(/\./g, ' ');

  // Capitalize first letter
  name = name.charAt(0).toUpperCase() + name.slice(1);

  // If title has a clear company name (before | or -), prefer that
  const titleMatch = title.match(/^([^|\-–]+)/);
  if (titleMatch && titleMatch[1].trim().length < 30) {
    return titleMatch[1].trim();
  }

  return name;
}
