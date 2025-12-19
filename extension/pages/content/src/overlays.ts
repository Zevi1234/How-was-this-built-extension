/**
 * Overlay utilities for screenshot region selection and element picking
 * Injected into the page via content script
 */

// Track active overlays for external cancellation
let activeRegionCleanup: (() => void) | null = null;
let activeElementCleanup: (() => void) | null = null;
let activeScanningOverlay: HTMLElement | null = null;

// Maximum page height for full-page capture (15000px as per user decision)
const MAX_CAPTURE_HEIGHT = 15000;

/**
 * Create and show a scanning overlay animation
 * Returns cleanup function to remove the overlay
 */
export function showScanningOverlay(): () => void {
  // Remove any existing overlay
  if (activeScanningOverlay) {
    activeScanningOverlay.remove();
    activeScanningOverlay = null;
  }

  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'hwtb-scanning-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2147483646;
    pointer-events: none;
    overflow: hidden;
  `;

  // Create glowing border around the viewport
  const borderGlow = document.createElement('div');
  borderGlow.style.cssText = `
    position: absolute;
    inset: 0;
    border: 2px solid rgba(59, 130, 246, 0.6);
    box-shadow:
      inset 0 0 30px rgba(59, 130, 246, 0.15),
      inset 0 0 60px rgba(59, 130, 246, 0.1),
      0 0 20px rgba(59, 130, 246, 0.3);
    animation: hwtb-border-pulse 1s ease-in-out infinite;
  `;
  overlay.appendChild(borderGlow);

  // Create scan line that moves down - thicker and more prominent
  const scanLine = document.createElement('div');
  scanLine.style.cssText = `
    position: absolute;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(59, 130, 246, 0.4) 15%,
      rgba(59, 130, 246, 1) 50%,
      rgba(59, 130, 246, 0.4) 85%,
      transparent 100%
    );
    box-shadow:
      0 0 30px rgba(59, 130, 246, 0.8),
      0 0 60px rgba(59, 130, 246, 0.5),
      0 0 100px rgba(59, 130, 246, 0.3);
    animation: hwtb-scan-down 1.2s linear infinite;
  `;
  overlay.appendChild(scanLine);

  // Create a second scan line offset for continuous effect
  const scanLine2 = document.createElement('div');
  scanLine2.style.cssText = `
    position: absolute;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(59, 130, 246, 0.4) 15%,
      rgba(59, 130, 246, 1) 50%,
      rgba(59, 130, 246, 0.4) 85%,
      transparent 100%
    );
    box-shadow:
      0 0 30px rgba(59, 130, 246, 0.8),
      0 0 60px rgba(59, 130, 246, 0.5),
      0 0 100px rgba(59, 130, 246, 0.3);
    animation: hwtb-scan-down 1.2s linear infinite;
    animation-delay: 0.6s;
  `;
  overlay.appendChild(scanLine2);

  // Create corner brackets - larger and more prominent
  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  corners.forEach(corner => {
    const bracket = document.createElement('div');
    const [vertical, horizontal] = corner.split('-');
    bracket.style.cssText = `
      position: absolute;
      ${vertical}: 16px;
      ${horizontal}: 16px;
      width: 50px;
      height: 50px;
      border-color: rgba(59, 130, 246, 0.9);
      border-style: solid;
      border-width: 0;
      border-${vertical}-width: 3px;
      border-${horizontal}-width: 3px;
      animation: hwtb-bracket-pulse 0.8s ease-in-out infinite;
      filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
    `;
    overlay.appendChild(bracket);
  });

  // Create status text - more prominent
  const statusText = document.createElement('div');
  statusText.style.cssText = `
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    padding: 14px 28px;
    border-radius: 12px;
    font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
    box-shadow:
      0 4px 30px rgba(0, 0, 0, 0.4),
      0 0 20px rgba(59, 130, 246, 0.2);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(59, 130, 246, 0.4);
    display: flex;
    align-items: center;
    gap: 12px;
  `;

  // Add animated spinner instead of dot
  const spinner = document.createElement('span');
  spinner.style.cssText = `
    width: 16px;
    height: 16px;
    border: 2px solid rgba(59, 130, 246, 0.3);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: hwtb-spin 0.8s linear infinite;
  `;
  statusText.appendChild(spinner);

  const text = document.createElement('span');
  text.textContent = 'Scanning page...';
  statusText.appendChild(text);

  overlay.appendChild(statusText);

  // Add keyframe animations
  const style = document.createElement('style');
  style.id = 'hwtb-scanning-styles';
  style.textContent = `
    @keyframes hwtb-scan-down {
      0% { top: -4px; opacity: 0; }
      5% { opacity: 1; }
      95% { opacity: 1; }
      100% { top: 100vh; opacity: 0; }
    }
    @keyframes hwtb-bracket-pulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.08); }
    }
    @keyframes hwtb-border-pulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }
    @keyframes hwtb-spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(overlay);
  activeScanningOverlay = overlay;

  // Return cleanup function
  return () => {
    overlay.remove();
    style.remove();
    activeScanningOverlay = null;
  };
}

/**
 * Hide the scanning overlay (for screenshot capture moments)
 */
export function hideScanningOverlay(): void {
  if (activeScanningOverlay) {
    activeScanningOverlay.style.display = 'none';
  }
}

/**
 * Show the scanning overlay again (after screenshot capture)
 */
export function resumeScanningOverlay(): void {
  if (activeScanningOverlay) {
    activeScanningOverlay.style.display = 'block';
  }
}

/**
 * Cancel any active selection overlay
 */
export function cancelActiveSelection(): void {
  if (activeRegionCleanup) {
    activeRegionCleanup();
    activeRegionCleanup = null;
  }
  if (activeElementCleanup) {
    activeElementCleanup();
    activeElementCleanup = null;
  }
}

/**
 * macOS-style Region Selector
 * Creates a full-page overlay with crosshair cursor and selection rectangle
 * Dark overlay on non-selected areas, clear view of selected region
 */
export function createRegionSelector(): Promise<{ x: number; y: number; width: number; height: number } | null> {
  return new Promise((resolve) => {
    const dpr = window.devicePixelRatio || 1;

    // Create container
    const container = document.createElement('div');
    container.id = 'hwtb-region-selector';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 2147483647;
      cursor: crosshair;
      overflow: hidden;
    `;

    // Dark overlay (will be clipped to show selection)
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      pointer-events: none;
    `;
    container.appendChild(overlay);

    // Crosshair horizontal line
    const crosshairH = document.createElement('div');
    crosshairH.style.cssText = `
      position: absolute;
      left: 0;
      width: 100%;
      height: 1px;
      background: rgba(255, 255, 255, 0.6);
      pointer-events: none;
      display: none;
    `;
    container.appendChild(crosshairH);

    // Crosshair vertical line
    const crosshairV = document.createElement('div');
    crosshairV.style.cssText = `
      position: absolute;
      top: 0;
      height: 100%;
      width: 1px;
      background: rgba(255, 255, 255, 0.6);
      pointer-events: none;
      display: none;
    `;
    container.appendChild(crosshairV);

    // Selection rectangle (clear cutout)
    const selection = document.createElement('div');
    selection.style.cssText = `
      position: absolute;
      border: 1px solid rgba(59, 130, 246, 0.8);
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
      pointer-events: none;
      display: none;
    `;
    container.appendChild(selection);

    // Size indicator
    const sizeIndicator = document.createElement('div');
    sizeIndicator.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.75);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 500;
      pointer-events: none;
      display: none;
      white-space: nowrap;
    `;
    container.appendChild(sizeIndicator);

    // Instructions tooltip
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 10px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
      font-size: 13px;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      backdrop-filter: blur(10px);
    `;
    tooltip.textContent = 'Click and drag to select a region • ESC to cancel';
    container.appendChild(tooltip);

    let startX = 0;
    let startY = 0;
    let isDrawing = false;
    let currentX = 0;
    let currentY = 0;

    const updateCrosshair = (x: number, y: number) => {
      crosshairH.style.display = 'block';
      crosshairH.style.top = `${y}px`;
      crosshairV.style.display = 'block';
      crosshairV.style.left = `${x}px`;
    };

    const updateSelection = () => {
      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      selection.style.display = 'block';
      selection.style.left = `${left}px`;
      selection.style.top = `${top}px`;
      selection.style.width = `${width}px`;
      selection.style.height = `${height}px`;

      // Update overlay clip path to show selection area clearly
      overlay.style.clipPath = `polygon(
        0% 0%,
        0% 100%,
        ${left}px 100%,
        ${left}px ${top}px,
        ${left + width}px ${top}px,
        ${left + width}px ${top + height}px,
        ${left}px ${top + height}px,
        ${left}px 100%,
        100% 100%,
        100% 0%
      )`;

      // Update size indicator
      if (width > 10 && height > 10) {
        sizeIndicator.style.display = 'block';
        sizeIndicator.textContent = `${Math.round(width)} × ${Math.round(height)}`;

        // Position indicator below and to the right of selection
        const indicatorLeft = left + width + 8;
        const indicatorTop = top + height + 8;

        // Keep indicator on screen
        const indicatorWidth = sizeIndicator.offsetWidth || 80;
        const indicatorHeight = sizeIndicator.offsetHeight || 24;

        sizeIndicator.style.left = `${Math.min(indicatorLeft, window.innerWidth - indicatorWidth - 8)}px`;
        sizeIndicator.style.top = `${Math.min(indicatorTop, window.innerHeight - indicatorHeight - 8)}px`;
      } else {
        sizeIndicator.style.display = 'none';
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDrawing = true;
      startX = e.clientX;
      startY = e.clientY;
      currentX = e.clientX;
      currentY = e.clientY;
      tooltip.style.display = 'none';
      updateSelection();
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateCrosshair(e.clientX, e.clientY);

      if (isDrawing) {
        currentX = e.clientX;
        currentY = e.clientY;
        updateSelection();
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDrawing) return;
      isDrawing = false;

      const left = Math.min(startX, e.clientX);
      const top = Math.min(startY, e.clientY);
      const width = Math.abs(e.clientX - startX);
      const height = Math.abs(e.clientY - startY);

      cleanup();

      if (width > 10 && height > 10) {
        // Account for device pixel ratio for accurate capture
        resolve({
          x: Math.round(left * dpr),
          y: Math.round(top * dpr),
          width: Math.round(width * dpr),
          height: Math.round(height * dpr),
        });
      } else {
        resolve(null); // Selection too small
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanup();
        resolve(null);
      }
    };

    const cleanup = () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown, true);
      container.remove();
      activeRegionCleanup = null;
    };

    // Register cleanup for external cancellation
    activeRegionCleanup = () => {
      cleanup();
      resolve(null);
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    // Use capture phase to ensure we get the ESC key even if other elements have focus
    document.addEventListener('keydown', handleKeyDown, true);

    document.body.appendChild(container);

    // Focus the container to ensure keyboard events are captured
    container.setAttribute('tabindex', '-1');
    container.focus();

    // Show crosshair immediately at center
    updateCrosshair(window.innerWidth / 2, window.innerHeight / 2);
  });
}

/**
 * Element Picker Overlay
 * Creates an inspector-style overlay for selecting DOM elements
 * Hover highlights elements, click to select
 */
export function createElementPicker(): Promise<{
  outerHTML: string;
  computedStyles: Record<string, string>;
  tagName: string;
  className: string;
} | null> {
  return new Promise((resolve) => {
    // Highlight overlay
    const highlight = document.createElement('div');
    highlight.id = 'hwtb-element-highlight';
    highlight.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 2147483646;
      border: 2px solid #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      transition: all 0.05s ease-out;
      display: none;
      border-radius: 2px;
    `;
    document.body.appendChild(highlight);

    // Label for element tag
    const label = document.createElement('div');
    label.style.cssText = `
      position: fixed;
      z-index: 2147483647;
      background: #3b82f6;
      color: white;
      padding: 3px 8px;
      font-family: 'SF Mono', 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 500;
      border-radius: 4px;
      pointer-events: none;
      display: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(label);

    // Instructions tooltip
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 10px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
      font-size: 13px;
      z-index: 2147483647;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      backdrop-filter: blur(10px);
    `;
    tooltip.textContent = 'Hover to highlight • Click to select • ESC to cancel';
    document.body.appendChild(tooltip);

    let currentElement: Element | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      // Get element at point, but ignore our overlay elements
      highlight.style.display = 'none';
      label.style.display = 'none';

      const target = document.elementFromPoint(e.clientX, e.clientY);

      // Ignore our own overlay elements
      if (!target ||
          target.id === 'hwtb-element-highlight' ||
          target === label ||
          target === tooltip ||
          target.closest('#hwtb-element-highlight')) {
        return;
      }

      currentElement = target;
      const rect = target.getBoundingClientRect();

      // Update highlight
      highlight.style.display = 'block';
      highlight.style.left = `${rect.left}px`;
      highlight.style.top = `${rect.top}px`;
      highlight.style.width = `${rect.width}px`;
      highlight.style.height = `${rect.height}px`;

      // Update label
      label.style.display = 'block';

      const tagName = target.tagName.toLowerCase();
      const id = target.id ? `#${target.id}` : '';
      const className = target.className && typeof target.className === 'string'
        ? `.${target.className.trim().split(/\s+/)[0]}`
        : '';
      label.textContent = `${tagName}${id}${className}`;

      // Position label above element, or below if not enough space
      const labelHeight = 24;
      const labelTop = rect.top - labelHeight - 4;

      if (labelTop > 0) {
        label.style.top = `${labelTop}px`;
      } else {
        label.style.top = `${rect.bottom + 4}px`;
      }
      label.style.left = `${rect.left}px`;
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      if (currentElement) {
        const styles = window.getComputedStyle(currentElement);
        const result = {
          outerHTML: currentElement.outerHTML.slice(0, 5000), // Limit size
          computedStyles: {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            fontFamily: styles.fontFamily,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            borderRadius: styles.borderRadius,
            border: styles.border,
            padding: styles.padding,
            margin: styles.margin,
            display: styles.display,
            position: styles.position,
          },
          tagName: currentElement.tagName.toLowerCase(),
          className: currentElement.className?.toString() || '',
        };
        cleanup();
        resolve(result);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanup();
        resolve(null);
      }
    };

    const cleanup = () => {
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      highlight.remove();
      label.remove();
      tooltip.remove();
      activeElementCleanup = null;
    };

    // Register cleanup for external cancellation
    activeElementCleanup = () => {
      cleanup();
      resolve(null);
    };

    // Use capture phase to intercept events before page handlers
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleClick, true);
    // Use capture phase for ESC key to ensure we catch it
    document.addEventListener('keydown', handleKeyDown, true);
  });
}

/**
 * Get page dimensions for full-page screenshot capture
 */
export function getPageDimensions(): {
  viewportWidth: number;
  viewportHeight: number;
  totalWidth: number;
  totalHeight: number;
  devicePixelRatio: number;
} {
  const docEl = document.documentElement;
  const body = document.body;

  // Get the actual scroll dimensions
  const totalWidth = Math.max(
    body.scrollWidth || 0,
    docEl.scrollWidth || 0,
    body.offsetWidth || 0,
    docEl.offsetWidth || 0,
    docEl.clientWidth || 0
  );

  const totalHeight = Math.min(
    Math.max(
      body.scrollHeight || 0,
      docEl.scrollHeight || 0,
      body.offsetHeight || 0,
      docEl.offsetHeight || 0,
      docEl.clientHeight || 0
    ),
    MAX_CAPTURE_HEIGHT
  );

  return {
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    totalWidth,
    totalHeight,
    devicePixelRatio: window.devicePixelRatio || 1,
  };
}

/**
 * Scroll to a specific position and wait for rendering
 */
export async function scrollToPosition(x: number, y: number): Promise<void> {
  return new Promise((resolve) => {
    window.scrollTo(x, y);
    // Wait for scroll to complete and content to render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Additional delay for lazy-loaded content and animations to settle
        setTimeout(resolve, 200);
      });
    });
  });
}

/**
 * Get current scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.scrollX || document.documentElement.scrollLeft || 0,
    y: window.scrollY || document.documentElement.scrollTop || 0,
  };
}
