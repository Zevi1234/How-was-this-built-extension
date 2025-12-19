import { Router } from 'express';
import { callOpenRouter, callOpenRouterWithVision } from '../lib/openrouter.js';
import { getSystemPrompt, getAnalysisPrompt, getVisionPrompt } from '../lib/prompts.js';
import { searchProductInfo } from '../lib/search.js';
import { categorizeColorsWithVision, categorizeColorsTextOnly } from '../lib/colorCategorizer.js';
import type { AnalyzeRequest, AnalyzeResponse, PageData, ColorPalette } from '../lib/types.js';

const router = Router();

function formatPageDataForLLM(pageData: PageData): string {
  // Handle potentially missing techSignals
  const techSignals = pageData.techSignals || {};
  const techSignalsList = Object.entries(techSignals)
    .filter(([, detected]) => detected)
    .map(([tech]) => tech);

  // Handle potentially missing arrays
  const scripts = pageData.scripts || [];
  const stylesheets = pageData.stylesheets || [];
  const metaTags = pageData.metaTags || {};
  const html = pageData.html || '';

  return `
## Website Analysis Request

**URL**: ${pageData.url || 'Unknown'}
**Title**: ${pageData.title || 'Unknown'}

### Detected Technologies (from client-side detection)
${techSignalsList.length > 0 ? techSignalsList.join(', ') : 'None detected automatically'}

### External Scripts
${scripts.slice(0, 20).join('\n') || 'None found'}

### External Stylesheets
${stylesheets.slice(0, 10).join('\n') || 'None found'}

### Meta Tags
${Object.entries(metaTags)
  .slice(0, 15)
  .map(([name, content]) => `${name}: ${content}`)
  .join('\n') || 'None found'}

### Page HTML (truncated)
\`\`\`html
${html.slice(0, 30000)}
\`\`\`
`;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

router.post('/', async (req, res) => {
  try {
    const { pageData, userLevel, userBio, learningStyle, openRouterApiKey, selectedModel } = req.body as AnalyzeRequest;

    console.log('[HWTB API] Received analyze request');
    console.log('[HWTB API] extractedColors from pageData:', pageData?.extractedColors);
    console.log('[HWTB API] userLevel:', userLevel, 'learningStyle:', learningStyle);
    console.log('[HWTB API] Using custom API key:', !!openRouterApiKey, 'model:', selectedModel || 'default');

    if (!pageData || !userLevel) {
      return res.status(400).json({ error: 'Missing pageData or userLevel' });
    }

    // Create user context for personalized prompts
    const userContext = { level: userLevel, bio: userBio, learningStyle };

    const domain = extractDomain(pageData.url);

    // Search for product info in parallel with analysis
    const productInfoPromise = searchProductInfo(
      domain,
      pageData.title,
      pageData.metaTags
    );

    // Get product info first to include in system prompt
    const productInfo = await productInfoPromise;

    const systemPrompt = getSystemPrompt(userContext, productInfo || undefined);
    const analysisPrompt = getAnalysisPrompt(userContext);
    const pageContext = formatPageDataForLLM(pageData);

    // If we have a screenshot, use vision analysis for better design system detection
    let visionAnalysis: Record<string, unknown> | null = null;
    if (pageData.screenshot) {
      try {
        console.log('[HWTB] Running vision analysis on screenshot...');
        const visionPrompt = getVisionPrompt(userLevel);
        const visionResponse = await callOpenRouterWithVision(
          'You are an expert UI/UX designer analyzing website screenshots.',
          visionPrompt,
          pageData.screenshot,
          { temperature: 0.3, maxTokens: 1000, apiKey: openRouterApiKey, model: selectedModel }
        );
        const jsonMatch = visionResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          visionAnalysis = JSON.parse(jsonMatch[0]);
          console.log('[HWTB] Vision analysis complete');
        }
      } catch (visionError) {
        console.error('[HWTB] Vision analysis failed:', visionError);
        // Continue without vision analysis
      }
    }

    // Include vision analysis in the context if available
    let enhancedContext = pageContext;
    if (visionAnalysis) {
      enhancedContext += `\n\n### Visual Design Analysis (from screenshot)
${JSON.stringify(visionAnalysis, null, 2)}`;
    }

    const response = await callOpenRouter([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${enhancedContext}\n\n${analysisPrompt}` },
    ], {
      temperature: 0.5,
      maxTokens: 2500,
      apiKey: openRouterApiKey,
      model: selectedModel,
    });

    // Parse the JSON response
    let analysis: AnalyzeResponse;
    try {
      // Try to extract JSON from the response (in case model adds extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse LLM response:', response);
      return res.status(500).json({ error: 'Failed to parse analysis response' });
    }

    // Validate the response structure
    if (!analysis.tldr || !analysis.techStack || !analysis.architecture || !analysis.designSystem || !analysis.uxPatterns) {
      // If tldr is missing, create a default one
      if (!analysis.tldr) {
        analysis.tldr = {
          summary: analysis.techStack?.summary || 'Analysis complete',
          landingPageTech: analysis.techStack?.tags?.slice(0, 3) || [],
          productTech: [],
          confidence: 'low',
        };
      }
      if (!analysis.techStack || !analysis.architecture || !analysis.designSystem || !analysis.uxPatterns) {
        return res.status(500).json({ error: 'Invalid analysis response structure' });
      }
    }

    // Ensure suggestedQuestions exists with defaults if missing
    if (!analysis.suggestedQuestions || !Array.isArray(analysis.suggestedQuestions)) {
      analysis.suggestedQuestions = [
        'How does this compare to similar sites?',
        'What makes this tech stack special?',
        'How would I build something similar?',
      ];
    }

    // Ensure topLearnings exists with defaults if missing
    if (!analysis.topLearnings || !Array.isArray(analysis.topLearnings) || analysis.topLearnings.length === 0) {
      analysis.topLearnings = [
        {
          title: 'Modern Tech Stack',
          insight: 'This site uses a modern web development stack, showing attention to developer experience and performance.',
          category: 'tech' as const,
        },
      ];
    }

    // Pass through DOM-extracted fonts and buttons
    if (pageData.extractedFonts && pageData.extractedFonts.length > 0) {
      analysis.fonts = pageData.extractedFonts;
      console.log('[HWTB API] Using DOM-extracted fonts:', pageData.extractedFonts);
    }

    if (pageData.extractedButtons && pageData.extractedButtons.length > 0) {
      analysis.buttons = pageData.extractedButtons;
      console.log('[HWTB API] Using DOM-extracted buttons:', pageData.extractedButtons);
    }

    // Keep raw extracted colors for backward compatibility
    if (pageData.extractedColors && pageData.extractedColors.length > 0) {
      analysis.colorPalette = pageData.extractedColors;
    }

    // AI-powered color categorization with semantic role assignment
    let structuredPalette: ColorPalette | undefined;

    // ALWAYS run AI categorization with visual context when screenshot available
    if (pageData.screenshot && pageData.extractedColors && pageData.extractedColors.length > 0) {
      try {
        console.log('[HWTB] Running vision-based color categorization...');
        const categorized = await categorizeColorsWithVision(
          pageData.screenshot,
          pageData.extractedColors,
          pageData.cssVariables,
          { apiKey: openRouterApiKey, model: selectedModel }
        );

        // Build structured palette from categorization
        if (categorized.primary || categorized.background) {
          structuredPalette = {
            background: categorized.background || '#FFFFFF',
            foreground: categorized.foreground || '#000000',
            primary: categorized.primary || pageData.extractedColors[0],
            secondary: categorized.secondary,
            accent: categorized.accent,
            muted: categorized.muted,
            border: categorized.border,
            destructive: categorized.destructive,
            source: 'ai-categorization',
            confidence: 'high', // High confidence when AI has visual context
            rawColors: pageData.extractedColors,
            possibleSystem: categorized.possibleSystem as ColorPalette['possibleSystem'],
          };
          console.log('[HWTB] Vision categorization complete:', structuredPalette);
        }
      } catch (err) {
        console.error('[HWTB] Vision categorization failed:', err);
        // Fall through to text-only fallback
      }
    }

    // Fallback: text-only AI categorization when no screenshot
    if (!structuredPalette && pageData.extractedColors && pageData.extractedColors.length > 0) {
      try {
        console.log('[HWTB] Running text-only color categorization...');
        const categorized = await categorizeColorsTextOnly(
          pageData.extractedColors,
          pageData.cssVariables,
          { apiKey: openRouterApiKey, model: selectedModel }
        );

        if (categorized.primary || categorized.background) {
          structuredPalette = {
            background: categorized.background || '#FFFFFF',
            foreground: categorized.foreground || '#000000',
            primary: categorized.primary || pageData.extractedColors[0],
            secondary: categorized.secondary,
            accent: categorized.accent,
            muted: categorized.muted,
            border: categorized.border,
            destructive: categorized.destructive,
            source: 'ai-categorization',
            confidence: 'medium', // Medium confidence without visual
            rawColors: pageData.extractedColors,
            possibleSystem: categorized.possibleSystem as ColorPalette['possibleSystem'],
          };
          console.log('[HWTB] Text categorization complete:', structuredPalette);
        }
      } catch (err) {
        console.error('[HWTB] Text categorization failed:', err);
      }
    }

    // Include structured palette in response
    if (structuredPalette) {
      analysis.structuredPalette = structuredPalette;
    }

    return res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Analysis failed',
    });
  }
});

export default router;
