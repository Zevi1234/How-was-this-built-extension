import 'webextension-polyfill';
import { appStorage } from '@extension/storage';
import type { PageData, Analysis, ChatMessage, ChatAttachment, ColorPalette } from '@extension/storage';
import { callOpenRouter, callOpenRouterWithVision, type OpenRouterOptions } from './openrouter';
import { getSystemPrompt, getAnalysisPrompt, getChatSystemPrompt, getVisionPrompt, type UserContext } from './prompts';
import { categorizeColorsWithVision, categorizeColorsTextOnly } from './colorCategorizer';
import { searchProductInfo } from './search';

console.log('[HWTB] Background script loaded');

/**
 * Capture screenshot of the visible tab with retry logic
 */
async function captureScreenshot(windowId?: number, retries = 3): Promise<string | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await new Promise<string | null>((resolve) => {
        chrome.tabs.captureVisibleTab(
          windowId ?? chrome.windows.WINDOW_ID_CURRENT,
          { format: 'jpeg', quality: 70 },
          (dataUrl) => {
            if (chrome.runtime.lastError) {
              console.error('[HWTB] Screenshot capture attempt', attempt + 1, 'failed:', chrome.runtime.lastError);
              resolve(null);
            } else {
              resolve(dataUrl || null);
            }
          }
        );
      });

      if (result) {
        return result;
      }

      // Wait before retrying
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error('[HWTB] Screenshot capture attempt', attempt + 1, 'error:', error);
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }

  console.error('[HWTB] Screenshot capture failed after', retries, 'attempts');
  return null;
}

/**
 * Crop a screenshot to a specific region using OffscreenCanvas
 */
async function cropScreenshot(
  fullScreenshot: string,
  region: { x: number; y: number; width: number; height: number }
): Promise<string> {
  // Fetch the image blob from data URL
  const response = await fetch(fullScreenshot);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);

  // Create offscreen canvas
  const canvas = new OffscreenCanvas(region.width, region.height);
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  // Draw cropped region
  ctx.drawImage(
    bitmap,
    region.x, region.y, region.width, region.height,  // source
    0, 0, region.width, region.height                  // destination
  );

  // Convert to blob then to base64
  const croppedBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(croppedBlob);
  });
}

/**
 * Get page dimensions from content script
 */
async function getPageDimensions(tabId: number): Promise<{
  viewportWidth: number;
  viewportHeight: number;
  totalWidth: number;
  totalHeight: number;
  devicePixelRatio: number;
  originalScrollPosition: { x: number; y: number };
}> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { type: 'GET_PAGE_DIMENSIONS' }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error('Could not get page dimensions'));
        return;
      }
      if (response?.type === 'PAGE_DIMENSIONS' && response.dimensions) {
        resolve({
          ...response.dimensions,
          originalScrollPosition: response.scrollPosition || { x: 0, y: 0 },
        });
      } else {
        reject(new Error('Invalid response from content script'));
      }
    });
  });
}

/**
 * Scroll page to position via content script
 */
async function scrollPage(tabId: number, x: number, y: number): Promise<void> {
  console.log('[HWTB] Scrolling to position:', { x, y });
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { type: 'SCROLL_TO_POSITION', x, y }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[HWTB] Scroll failed:', chrome.runtime.lastError);
        reject(new Error('Could not scroll page'));
        return;
      }
      if (response?.type === 'SCROLL_COMPLETE') {
        console.log('[HWTB] Scroll complete');
        resolve();
      } else {
        console.error('[HWTB] Invalid scroll response:', response);
        reject(new Error('Invalid scroll response'));
      }
    });
  });
}

/**
 * Stitch multiple screenshots into one full-page image
 */
async function stitchScreenshots(
  screenshots: string[],
  _viewportWidth: number,
  viewportHeight: number,
  totalWidth: number,
  totalHeight: number,
  devicePixelRatio: number
): Promise<string> {
  // Security: Cap dimensions to prevent memory exhaustion from malicious pages
  // Max 8192px is a reasonable limit that covers most real pages
  const MAX_DIMENSION = 8192;
  const cappedWidth = Math.min(totalWidth, MAX_DIMENSION);
  const cappedHeight = Math.min(totalHeight, MAX_DIMENSION * 4); // Allow taller pages (32K max height)

  // Calculate canvas dimensions (in actual pixels, accounting for DPR)
  const canvasWidth = Math.round(cappedWidth * devicePixelRatio);
  const canvasHeight = Math.round(cappedHeight * devicePixelRatio);
  const viewportHeightPx = Math.round(viewportHeight * devicePixelRatio);

  // Additional safeguard: limit total pixel count to ~64 megapixels
  const MAX_PIXELS = 64 * 1024 * 1024;
  if (canvasWidth * canvasHeight > MAX_PIXELS) {
    throw new Error('Page too large to capture. Please use viewport capture instead.');
  }

  console.log('[HWTB] Stitching screenshots:', {
    count: screenshots.length,
    canvasWidth,
    canvasHeight,
    viewportHeightPx,
  });

  const canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context for stitching');

  // Draw each screenshot at the correct vertical position
  for (let i = 0; i < screenshots.length; i++) {
    const response = await fetch(screenshots[i]);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    const yPosition = i * viewportHeightPx;

    // For the last screenshot, we may need to crop it to avoid overlap
    const remainingHeight = canvasHeight - yPosition;
    const sourceHeight = Math.min(bitmap.height, remainingHeight);

    ctx.drawImage(
      bitmap,
      0, 0, bitmap.width, sourceHeight,  // source
      0, yPosition, bitmap.width, sourceHeight  // destination
    );

    bitmap.close();
  }

  // Convert to JPEG with moderate quality for AI vision analysis
  // Balance between file size and image clarity for color detection
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.60 });

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

/**
 * Send a simple message to content script (fire and forget with ACK)
 */
async function sendToContentScript(tabId: number, message: { type: string }): Promise<void> {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, () => {
      // Ignore errors, just resolve
      resolve();
    });
  });
}

/**
 * Capture full-page screenshot by scrolling and stitching
 */
async function captureFullPageScreenshot(tabId: number, windowId: number): Promise<string | null> {
  try {
    // Ensure content script is loaded
    await ensureContentScript(tabId);

    // Get page dimensions
    const dimensions = await getPageDimensions(tabId);
    const { viewportWidth, viewportHeight, totalWidth, totalHeight, devicePixelRatio, originalScrollPosition } = dimensions;

    console.log('[HWTB] Full-page capture dimensions:', dimensions);

    // Show scanning overlay for the entire capture process
    await sendToContentScript(tabId, { type: 'SHOW_SCANNING_OVERLAY' });

    // If page fits in one viewport, just capture once
    if (totalHeight <= viewportHeight) {
      console.log('[HWTB] Page fits in viewport, using simple capture');
      // Brief pause to let user see the overlay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Hide overlay just for the capture moment
      await sendToContentScript(tabId, { type: 'HIDE_SCANNING_OVERLAY' });
      await new Promise(resolve => setTimeout(resolve, 30));
      const screenshot = await captureScreenshot(windowId);
      await sendToContentScript(tabId, { type: 'REMOVE_SCANNING_OVERLAY' });
      return screenshot;
    }

    // Calculate number of screenshots needed
    const screenshotCount = Math.ceil(totalHeight / viewportHeight);
    console.log('[HWTB] Need', screenshotCount, 'screenshots');

    const screenshots: string[] = [];

    // Capture each section - overlay stays visible during scrolling for smooth animation
    for (let i = 0; i < screenshotCount; i++) {
      const scrollY = i * viewportHeight;

      // Scroll to position (overlay visible during scroll - looks smooth)
      await scrollPage(tabId, 0, scrollY);

      // Minimal delay for page to settle after scroll
      await new Promise(resolve => setTimeout(resolve, 100));

      // Hide overlay just for the instant of capture
      await sendToContentScript(tabId, { type: 'HIDE_SCANNING_OVERLAY' });
      await new Promise(resolve => setTimeout(resolve, 30));

      // Capture this section
      const screenshot = await captureScreenshot(windowId);

      // Immediately resume overlay for continued smooth animation
      await sendToContentScript(tabId, { type: 'RESUME_SCANNING_OVERLAY' });

      // Minimal delay to avoid Chrome's rate limiting (150ms seems to be the safe minimum)
      await new Promise(resolve => setTimeout(resolve, 150));

      if (screenshot) {
        screenshots.push(screenshot);
      } else {
        console.error('[HWTB] Failed to capture section', i);
        await sendToContentScript(tabId, { type: 'REMOVE_SCANNING_OVERLAY' });
        await scrollPage(tabId, originalScrollPosition.x, originalScrollPosition.y);
        return null;
      }
    }

    // Remove scanning overlay
    await sendToContentScript(tabId, { type: 'REMOVE_SCANNING_OVERLAY' });

    // Restore original scroll position
    await scrollPage(tabId, originalScrollPosition.x, originalScrollPosition.y);

    // Stitch screenshots together
    const fullPageScreenshot = await stitchScreenshots(
      screenshots,
      viewportWidth,
      viewportHeight,
      totalWidth,
      totalHeight,
      devicePixelRatio
    );

    console.log('[HWTB] Full-page screenshot complete, size:', Math.round(fullPageScreenshot.length / 1024), 'KB');

    return fullPageScreenshot;
  } catch (error) {
    console.error('[HWTB] Full-page capture failed:', error);
    // Try to remove overlay on error
    try {
      await sendToContentScript(tabId, { type: 'REMOVE_SCANNING_OVERLAY' });
    } catch {
      // Ignore cleanup errors
    }
    // Fall back to simple viewport capture
    return await captureScreenshot(windowId);
  }
}

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    await chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Set up side panel behavior
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Message types from side panel
interface AnalyzeMessage {
  type: 'ANALYZE_PAGE';
}

interface ChatMessageRequest {
  type: 'SEND_CHAT';
  message: string;
  attachments?: ChatAttachment[];
}

interface GetCurrentTabMessage {
  type: 'GET_CURRENT_TAB';
}

interface StartRegionSelectionMessage {
  type: 'START_REGION_SELECTION';
}

interface StartElementPickerMessage {
  type: 'START_ELEMENT_PICKER';
}

interface CancelSelectionMessage {
  type: 'CANCEL_SELECTION';
}

// Messages from content script
interface RegionSelectedMessage {
  type: 'REGION_SELECTED';
  region: { x: number; y: number; width: number; height: number };
}

interface ElementSelectedMessage {
  type: 'ELEMENT_SELECTED';
  element: {
    outerHTML: string;
    computedStyles: Record<string, string>;
    tagName: string;
    className: string;
  };
}

interface SelectionCancelledMessage {
  type: 'SELECTION_CANCELLED';
}

type BackgroundMessage =
  | AnalyzeMessage
  | ChatMessageRequest
  | GetCurrentTabMessage
  | StartRegionSelectionMessage
  | StartElementPickerMessage
  | CancelSelectionMessage
  | RegionSelectedMessage
  | ElementSelectedMessage
  | SelectionCancelledMessage;

// Response types
interface AnalysisResponse {
  success: boolean;
  analysis?: Analysis;
  error?: string;
}

interface ChatResponse {
  success: boolean;
  reply?: string;
  error?: string;
}

interface TabResponse {
  url: string;
  title: string;
  canAnalyze: boolean;
}

interface SimpleResponse {
  success: boolean;
  error?: string;
}

/**
 * Ensure content script is injected in the tab
 */
async function ensureContentScript(tabId: number): Promise<void> {
  try {
    // Try to ping the content script first
    await chrome.tabs.sendMessage(tabId, { type: 'PING' });
  } catch {
    // Content script not loaded, inject it
    console.log('[HWTB] Injecting content script...');
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content/all.iife.js'],
    });
    // Wait a moment for the script to initialize
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * Extract page data from the current tab
 */
async function extractPageData(tabId: number): Promise<PageData> {
  // Ensure content script is loaded first
  await ensureContentScript(tabId);

  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tabId,
      { type: 'EXTRACT_PAGE_DATA' },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error('Could not connect to page. Please refresh and try again.'));
          return;
        }
        if (response?.type === 'PAGE_DATA' && response.data) {
          resolve(response.data);
        } else {
          reject(new Error('Invalid response from content script'));
        }
      }
    );
  });
}

/**
 * Format page data for the LLM analysis prompt
 */
function formatPageDataForLLM(pageData: PageData): string {
  const techSignals = pageData.techSignals || {};
  const techSignalsList = Object.entries(techSignals)
    .filter(([, detected]) => detected)
    .map(([tech]) => tech);

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

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Analyze page data directly using OpenRouter API
 */
async function analyzePageData(
  pageData: PageData,
  userLevel: string,
  userBio?: string,
  learningStyle?: string,
  openRouterApiKey?: string,
  selectedModel?: string
): Promise<Analysis> {
  if (!openRouterApiKey) {
    throw new Error('No API key configured. Please add your OpenRouter API key in settings.');
  }

  const options: OpenRouterOptions = {
    apiKey: openRouterApiKey,
    model: selectedModel,
  };

  const userContext: UserContext = {
    level: userLevel as 'beginner' | 'learning' | 'designer' | 'developer',
    bio: userBio,
    learningStyle,
  };

  const domain = extractDomain(pageData.url);

  // Search for product info using LLM knowledge
  let productInfo: string | null = null;
  try {
    productInfo = await searchProductInfo(domain, pageData.title, pageData.metaTags, options);
  } catch (err) {
    console.warn('[HWTB] Product search failed:', err);
  }

  const systemPrompt = getSystemPrompt(userContext, productInfo || undefined);
  const analysisPrompt = getAnalysisPrompt(userContext);
  const pageContext = formatPageDataForLLM(pageData);

  // If we have a screenshot, use vision analysis for better design system detection
  let visionAnalysis: Record<string, unknown> | null = null;
  if (pageData.screenshot) {
    try {
      console.log('[HWTB] Running vision analysis on screenshot...');
      const visionPrompt = getVisionPrompt(userContext.level);
      const visionResponse = await callOpenRouterWithVision(
        'You are an expert UI/UX designer analyzing website screenshots.',
        visionPrompt,
        pageData.screenshot,
        { ...options, temperature: 0.3, maxTokens: 1000 }
      );
      const jsonMatch = visionResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        visionAnalysis = JSON.parse(jsonMatch[0]);
        console.log('[HWTB] Vision analysis complete');
      }
    } catch (visionError) {
      console.error('[HWTB] Vision analysis failed:', visionError);
    }
  }

  // Include vision analysis in the context if available
  let enhancedContext = pageContext;
  if (visionAnalysis) {
    enhancedContext += `\n\n### Visual Design Analysis (from screenshot)
${JSON.stringify(visionAnalysis, null, 2)}`;
  }

  // Main analysis call
  const response = await callOpenRouter([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `${enhancedContext}\n\n${analysisPrompt}` },
  ], {
    ...options,
    temperature: 0.5,
    maxTokens: 2500,
  });

  // Parse the JSON response
  let analysis: Partial<Analysis>;
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    analysis = JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    console.error('[HWTB] Failed to parse LLM response:', response);
    throw new Error('Failed to parse analysis response');
  }

  // Validate and fill defaults
  if (!analysis.tldr) {
    analysis.tldr = {
      summary: analysis.techStack?.summary || 'Analysis complete',
      landingPageTech: analysis.techStack?.tags?.slice(0, 3) || [],
      productTech: [],
      confidence: 'low' as const,
    };
  }

  if (!analysis.techStack || !analysis.architecture || !analysis.designSystem || !analysis.uxPatterns) {
    throw new Error('Invalid analysis response structure');
  }

  if (!analysis.suggestedQuestions || !Array.isArray(analysis.suggestedQuestions)) {
    analysis.suggestedQuestions = [
      'How does this compare to similar sites?',
      'What makes this tech stack special?',
      'How would I build something similar?',
    ];
  }

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
  }

  if (pageData.extractedButtons && pageData.extractedButtons.length > 0) {
    analysis.buttons = pageData.extractedButtons;
  }

  // Keep raw extracted colors for backward compatibility
  if (pageData.extractedColors && pageData.extractedColors.length > 0) {
    analysis.colorPalette = pageData.extractedColors;
  }

  // AI-powered color categorization
  let structuredPalette: ColorPalette | undefined;

  if (pageData.screenshot && pageData.extractedColors && pageData.extractedColors.length > 0) {
    try {
      console.log('[HWTB] Running vision-based color categorization...');
      const categorized = await categorizeColorsWithVision(
        pageData.screenshot,
        pageData.extractedColors,
        pageData.cssVariables,
        options
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
          confidence: 'high',
          rawColors: pageData.extractedColors,
          possibleSystem: categorized.possibleSystem as ColorPalette['possibleSystem'],
        };
        console.log('[HWTB] Vision categorization complete');
      }
    } catch (err) {
      console.error('[HWTB] Vision categorization failed:', err);
    }
  }

  // Fallback: text-only AI categorization when no screenshot
  if (!structuredPalette && pageData.extractedColors && pageData.extractedColors.length > 0) {
    try {
      console.log('[HWTB] Running text-only color categorization...');
      const categorized = await categorizeColorsTextOnly(
        pageData.extractedColors,
        pageData.cssVariables,
        options
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
          confidence: 'medium',
          rawColors: pageData.extractedColors,
          possibleSystem: categorized.possibleSystem as ColorPalette['possibleSystem'],
        };
        console.log('[HWTB] Text categorization complete');
      }
    } catch (err) {
      console.error('[HWTB] Text categorization failed:', err);
    }
  }

  if (structuredPalette) {
    analysis.structuredPalette = structuredPalette;
  }

  return {
    url: pageData.url,
    timestamp: Date.now(),
    ...analysis,
  } as Analysis;
}

/**
 * Format analysis context for chat
 */
function formatAnalysisContext(analysis: Analysis): string {
  return `
## Previous Website Analysis

**URL**: ${analysis.url}
**Analyzed**: ${new Date(analysis.timestamp).toLocaleString()}

### Tech Stack
${analysis.techStack.summary}
Tags: ${analysis.techStack.tags.join(', ')}

### Architecture
${analysis.architecture.summary}
Tags: ${analysis.architecture.tags.join(', ')}

### Design System
${analysis.designSystem.summary}
Tags: ${analysis.designSystem.tags.join(', ')}

### UX Patterns
${analysis.uxPatterns.summary}
Tags: ${analysis.uxPatterns.tags.join(', ')}
`;
}

/**
 * Send chat message directly using OpenRouter API
 */
async function sendChatMessage(
  message: string,
  analysis: Analysis,
  history: ChatMessage[],
  userLevel: string,
  userBio?: string,
  learningStyle?: string,
  openRouterApiKey?: string,
  selectedModel?: string
): Promise<string> {
  if (!openRouterApiKey) {
    throw new Error('No API key configured. Please add your OpenRouter API key in settings.');
  }

  const userContext: UserContext = {
    level: userLevel as 'beginner' | 'learning' | 'designer' | 'developer',
    bio: userBio,
    learningStyle,
  };

  const systemPrompt = getChatSystemPrompt(userContext);
  const analysisContext = formatAnalysisContext(analysis);

  // Build the message history
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: `${systemPrompt}\n\n${analysisContext}` },
  ];

  // Add conversation history (limit to last 10 messages)
  if (history && history.length > 0) {
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  // Add the current message
  messages.push({ role: 'user', content: message });

  const response = await callOpenRouter(messages, {
    apiKey: openRouterApiKey,
    model: selectedModel,
    temperature: 0.7,
    maxTokens: 1024,
  });

  return response.trim();
}

/**
 * Check if a URL can be analyzed
 */
function canAnalyzeUrl(url: string): boolean {
  if (!url) return false;

  // Cannot analyze these special pages
  const blockedProtocols = [
    'chrome://',
    'chrome-extension://',
    'about:',
    'file://',
    'view-source:',
    'devtools://',
  ];

  return !blockedProtocols.some(protocol => url.startsWith(protocol));
}

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener(
  (message: BackgroundMessage, sender, sendResponse) => {
    handleMessage(message, sendResponse);
    return true; // Keep the message channel open for async response
  }
);

async function handleMessage(
  message: BackgroundMessage,
  sendResponse: (response: AnalysisResponse | ChatResponse | TabResponse | SimpleResponse) => void
) {
  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id || !tab.url) {
      sendResponse({
        success: false,
        error: 'No active tab found',
      } as AnalysisResponse);
      return;
    }

    // Handle region selection request from side panel
    if (message.type === 'START_REGION_SELECTION') {
      await ensureContentScript(tab.id);
      chrome.tabs.sendMessage(tab.id, { type: 'START_REGION_SELECTION' });
      sendResponse({ success: true });
      return;
    }

    // Handle element picker request from side panel
    if (message.type === 'START_ELEMENT_PICKER') {
      await ensureContentScript(tab.id);
      chrome.tabs.sendMessage(tab.id, { type: 'START_ELEMENT_PICKER' });
      sendResponse({ success: true });
      return;
    }

    // Handle cancel selection request from side panel
    if (message.type === 'CANCEL_SELECTION') {
      chrome.tabs.sendMessage(tab.id, { type: 'CANCEL_SELECTION' });
      sendResponse({ success: true });
      return;
    }

    // Handle region selected from content script - capture and crop screenshot
    if (message.type === 'REGION_SELECTED') {
      console.log('[HWTB] Region selected, capturing screenshot...');
      try {
        const fullScreenshot = await captureScreenshot(tab.windowId);
        if (fullScreenshot) {
          console.log('[HWTB] Screenshot captured, cropping...');
          const croppedScreenshot = await cropScreenshot(fullScreenshot, message.region);
          console.log('[HWTB] Screenshot cropped, sending to side panel...');
          // Send back to side panel via runtime message
          // Use catch to handle case where no listener is registered
          chrome.runtime.sendMessage({
            type: 'SCREENSHOT_CAPTURED',
            dataUrl: croppedScreenshot,
            region: message.region,
          }).catch(() => {
            // Side panel might not be open, ignore
            console.log('[HWTB] No listener for screenshot message (side panel may be closed)');
          });
        } else {
          console.log('[HWTB] Screenshot capture failed');
          chrome.runtime.sendMessage({ type: 'SCREENSHOT_FAILED' }).catch(() => {});
        }
      } catch (error) {
        console.error('[HWTB] Screenshot crop failed:', error);
        chrome.runtime.sendMessage({ type: 'SCREENSHOT_FAILED' }).catch(() => {});
      }
      sendResponse({ success: true });
      return;
    }

    // Handle element selected from content script - forward to side panel
    if (message.type === 'ELEMENT_SELECTED') {
      console.log('[HWTB] Element selected, forwarding to side panel...');
      chrome.runtime.sendMessage({
        type: 'ELEMENT_CAPTURED',
        element: message.element,
      }).catch(() => {
        console.log('[HWTB] No listener for element message (side panel may be closed)');
      });
      sendResponse({ success: true });
      return;
    }

    // Handle selection cancelled from content script
    if (message.type === 'SELECTION_CANCELLED') {
      console.log('[HWTB] Selection cancelled, forwarding to side panel');
      chrome.runtime.sendMessage({ type: 'SELECTION_CANCELLED' }).catch(() => {});
      sendResponse({ success: true });
      return;
    }

    if (message.type === 'GET_CURRENT_TAB') {
      sendResponse({
        url: tab.url,
        title: tab.title || '',
        canAnalyze: canAnalyzeUrl(tab.url),
      } as TabResponse);
      return;
    }

    if (message.type === 'ANALYZE_PAGE') {
      if (!canAnalyzeUrl(tab.url)) {
        sendResponse({
          success: false,
          error: 'Cannot analyze this page. Try a regular website.',
        } as AnalysisResponse);
        return;
      }

      // Set analyzing state
      await appStorage.setAnalyzing(true);

      try {
        // Get user profile from storage
        const state = await appStorage.get();
        const { userLevel, userBio, learningStyle, aiConfig } = state;

        // Debug: log AI config (without exposing key)
        console.log('[HWTB] AI Config:', {
          hasApiKey: !!aiConfig?.openRouterApiKey,
          selectedModel: aiConfig?.selectedModel,
        });

        // Extract page data first (need tab.id for full-page capture)
        const pageData = await extractPageData(tab.id);

        // Capture full-page screenshot (scrolls and stitches)
        const screenshot = await captureFullPageScreenshot(tab.id, tab.windowId);

        // Add screenshot to page data
        if (screenshot) {
          pageData.screenshot = screenshot;
          console.log('[HWTB] Full-page screenshot attached, size:', Math.round(screenshot.length / 1024), 'KB');
        }

        // Analyze with API
        const analysis = await analyzePageData(
          pageData,
          userLevel,
          userBio,
          learningStyle,
          aiConfig?.openRouterApiKey,
          aiConfig?.selectedModel
        );

        // Save to storage
        await appStorage.addAnalysis(analysis);

        sendResponse({
          success: true,
          analysis,
        } as AnalysisResponse);
      } finally {
        await appStorage.setAnalyzing(false);
      }
      return;
    }

    if (message.type === 'SEND_CHAT') {
      const state = await appStorage.get();

      if (!state.currentAnalysis) {
        sendResponse({
          success: false,
          error: 'No analysis available. Analyze a page first.',
        } as ChatResponse);
        return;
      }

      // Add user message to chat (with attachments if present)
      await appStorage.addChatMessage({
        role: 'user',
        content: message.message,
        attachments: message.attachments,
      });

      // Build enhanced message content with attachment context
      let enhancedMessage = message.message;
      if (message.attachments?.length) {
        enhancedMessage += '\n\n[User has attached the following context:]';
        for (const att of message.attachments) {
          if (att.type === 'screenshot') {
            enhancedMessage += '\n- A screenshot of a specific region of the page';
          } else if (att.type === 'element') {
            enhancedMessage += `\n- Selected element: <${att.tagName}> with classes "${att.className}"`;
            enhancedMessage += `\n  Computed styles: ${JSON.stringify(att.computedStyles, null, 2)}`;
            enhancedMessage += `\n  HTML (truncated): ${att.outerHTML.slice(0, 500)}${att.outerHTML.length > 500 ? '...' : ''}`;
          }
        }
      }

      // Send to API with user profile for personalized responses
      const reply = await sendChatMessage(
        enhancedMessage,
        state.currentAnalysis,
        state.currentChat,
        state.userLevel,
        state.userBio,
        state.learningStyle,
        state.aiConfig?.openRouterApiKey,
        state.aiConfig?.selectedModel
      );

      // Add assistant response to chat
      await appStorage.addChatMessage({
        role: 'assistant',
        content: reply,
      });

      sendResponse({
        success: true,
        reply,
      } as ChatResponse);
      return;
    }
  } catch (error) {
    console.error('[HWTB] Background error:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as AnalysisResponse | ChatResponse);
  }
}
