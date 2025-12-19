import { extractPageData, type PageData } from '@src/extractor';
import {
  createRegionSelector,
  createElementPicker,
  cancelActiveSelection,
  getPageDimensions,
  scrollToPosition,
  getScrollPosition,
  showScanningOverlay,
  hideScanningOverlay,
  resumeScanningOverlay,
} from '@src/overlays';

console.log('[HWTB] Content script loaded');

// Track scanning overlay cleanup function
let scanningOverlayCleanup: (() => void) | null = null;

// Message types
interface ContentScriptMessage {
  type:
    | 'EXTRACT_PAGE_DATA'
    | 'PING'
    | 'START_REGION_SELECTION'
    | 'START_ELEMENT_PICKER'
    | 'CANCEL_SELECTION'
    | 'GET_PAGE_DIMENSIONS'
    | 'SCROLL_TO_POSITION'
    | 'SHOW_SCANNING_OVERLAY'
    | 'HIDE_SCANNING_OVERLAY'
    | 'RESUME_SCANNING_OVERLAY'
    | 'REMOVE_SCANNING_OVERLAY';
  x?: number;
  y?: number;
}

interface PageDataResponse {
  type: 'PAGE_DATA' | 'PONG' | 'ACK' | 'PAGE_DIMENSIONS' | 'SCROLL_COMPLETE';
  data?: PageData;
  dimensions?: {
    viewportWidth: number;
    viewportHeight: number;
    totalWidth: number;
    totalHeight: number;
    devicePixelRatio: number;
  };
  scrollPosition?: { x: number; y: number };
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(
  (
    message: ContentScriptMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: PageDataResponse) => void
  ) => {
    // Simple ping to check if content script is loaded
    if (message.type === 'PING') {
      sendResponse({ type: 'PONG' });
      return true;
    }

    // Cancel any active selection
    if (message.type === 'CANCEL_SELECTION') {
      console.log('[HWTB] Cancelling active selection...');
      cancelActiveSelection();
      sendResponse({ type: 'ACK' });
      return true;
    }

    // Region selection for screenshot
    if (message.type === 'START_REGION_SELECTION') {
      console.log('[HWTB] Starting region selection...');
      sendResponse({ type: 'ACK' });

      createRegionSelector().then((region) => {
        if (region) {
          console.log('[HWTB] Region selected:', region);
          chrome.runtime.sendMessage({ type: 'REGION_SELECTED', region });
        } else {
          console.log('[HWTB] Region selection cancelled');
          chrome.runtime.sendMessage({ type: 'SELECTION_CANCELLED' });
        }
      });

      return true;
    }

    // Element picker for component selection
    if (message.type === 'START_ELEMENT_PICKER') {
      console.log('[HWTB] Starting element picker...');
      sendResponse({ type: 'ACK' });

      createElementPicker().then((element) => {
        if (element) {
          console.log('[HWTB] Element selected:', element.tagName);
          chrome.runtime.sendMessage({ type: 'ELEMENT_SELECTED', element });
        } else {
          console.log('[HWTB] Element picker cancelled');
          chrome.runtime.sendMessage({ type: 'SELECTION_CANCELLED' });
        }
      });

      return true;
    }

    // Get page dimensions for full-page screenshot
    if (message.type === 'GET_PAGE_DIMENSIONS') {
      const dimensions = getPageDimensions();
      const scrollPosition = getScrollPosition();
      console.log('[HWTB] Page dimensions:', dimensions);
      sendResponse({
        type: 'PAGE_DIMENSIONS',
        dimensions,
        scrollPosition,
      });
      return true;
    }

    // Scroll to position for full-page screenshot
    if (message.type === 'SCROLL_TO_POSITION') {
      const x = message.x ?? 0;
      const y = message.y ?? 0;
      scrollToPosition(x, y).then(() => {
        sendResponse({ type: 'SCROLL_COMPLETE' });
      });
      return true;
    }

    // Show scanning overlay
    if (message.type === 'SHOW_SCANNING_OVERLAY') {
      console.log('[HWTB] Showing scanning overlay...');
      scanningOverlayCleanup = showScanningOverlay();
      sendResponse({ type: 'ACK' });
      return true;
    }

    // Hide scanning overlay (temporarily, for screenshot capture)
    if (message.type === 'HIDE_SCANNING_OVERLAY') {
      hideScanningOverlay();
      sendResponse({ type: 'ACK' });
      return true;
    }

    // Resume scanning overlay (after screenshot capture)
    if (message.type === 'RESUME_SCANNING_OVERLAY') {
      resumeScanningOverlay();
      sendResponse({ type: 'ACK' });
      return true;
    }

    // Remove scanning overlay completely
    if (message.type === 'REMOVE_SCANNING_OVERLAY') {
      console.log('[HWTB] Removing scanning overlay...');
      if (scanningOverlayCleanup) {
        scanningOverlayCleanup();
        scanningOverlayCleanup = null;
      }
      sendResponse({ type: 'ACK' });
      return true;
    }

    if (message.type === 'EXTRACT_PAGE_DATA') {
      console.log('[HWTB] Extracting page data...');

      try {
        const pageData = extractPageData();
        console.log('[HWTB] Page data extracted:', {
          url: pageData.url,
          title: pageData.title,
          scriptsCount: pageData.scripts.length,
          techSignals: pageData.techSignals,
          extractedColors: pageData.extractedColors,
        });
        console.log('[HWTB] Extracted colors:', pageData.extractedColors);

        sendResponse({
          type: 'PAGE_DATA',
          data: pageData,
        });
      } catch (error) {
        console.error('[HWTB] Error extracting page data:', error);
        // Send empty data on error
        sendResponse({
          type: 'PAGE_DATA',
          data: {
            url: window.location.href,
            title: document.title,
            html: '',
            scripts: [],
            stylesheets: [],
            metaTags: {},
            techSignals: {
              nextjs: false,
              nuxt: false,
              react: false,
              vue: false,
              angular: false,
              svelte: false,
              tailwind: false,
              wordpress: false,
              gatsby: false,
              remix: false,
            },
          },
        });
      }

      return true; // Keep the message channel open for async response
    }

    // Return false for unhandled message types
    return false;
  }
);
