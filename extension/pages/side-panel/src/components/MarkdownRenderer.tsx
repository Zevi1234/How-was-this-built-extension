import { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Configure marked for safe output
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
});

/**
 * Simple HTML sanitizer to prevent XSS
 * Only allows safe tags and attributes
 */
function sanitizeHtml(html: string): string {
  const allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'code', 'pre',
    'ul', 'ol', 'li', 'a', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ];

  // Use DOMParser instead of innerHTML to avoid triggering network requests
  // for <img src="..."> or other resource-loading tags before sanitization
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const temp = doc.body;

  // Walk through all elements and remove disallowed ones
  const walk = (node: Element) => {
    const children = Array.from(node.children);
    for (const child of children) {
      const tagName = child.tagName.toLowerCase();
      if (!allowedTags.includes(tagName)) {
        // Replace with text content
        const text = document.createTextNode(child.textContent || '');
        child.replaceWith(text);
      } else {
        // Remove all attributes except href on <a> tags
        const attrs = Array.from(child.attributes);
        for (const attr of attrs) {
          if (tagName === 'a' && attr.name === 'href') {
            const href = child.getAttribute('href') || '';
            // Only allow safe URL schemes (http, https, mailto)
            // Block javascript:, data:, vbscript:, and other dangerous schemes
            const safeSchemes = /^(https?:\/\/|mailto:|#|\/)/i;
            if (safeSchemes.test(href) || !href.includes(':')) {
              // Make links open in new tab and add security attributes
              child.setAttribute('target', '_blank');
              child.setAttribute('rel', 'noopener noreferrer');
            } else {
              // Remove dangerous href entirely
              child.removeAttribute('href');
            }
          } else {
            child.removeAttribute(attr.name);
          }
        }
        walk(child);
      }
    }
  };

  walk(temp);
  return temp.innerHTML;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const html = useMemo(() => {
    try {
      const rawHtml = marked.parse(content) as string;
      return sanitizeHtml(rawHtml);
    } catch (e) {
      console.error('Failed to parse markdown:', e);
      // On parse error, escape HTML entities to prevent XSS
      // Never return raw content that could contain malicious HTML/JS
      return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }, [content]);

  return (
    <div
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
