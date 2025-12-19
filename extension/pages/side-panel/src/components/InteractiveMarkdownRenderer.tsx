import { useMemo } from 'react';
import { marked } from 'marked';

interface InteractiveMarkdownRendererProps {
  content: string;
  className?: string;
  onTermClick?: (term: string) => void;
}

// Configure marked for safe output
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Parse content to extract [[interactive terms]] and convert to React elements
 */
function parseInteractiveContent(content: string): { cleanContent: string; terms: string[] } {
  const terms: string[] = [];
  const termRegex = /\[\[([^\]]+)\]\]/g;

  // Extract all terms
  let match;
  while ((match = termRegex.exec(content)) !== null) {
    terms.push(match[1]);
  }

  // Replace [[term]] with a placeholder that won't be escaped
  // Using a unique marker that's unlikely to appear in content
  const cleanContent = content.replace(termRegex, '{{INTERACTIVE_TERM:$1}}');

  return { cleanContent, terms };
}

/**
 * Simple HTML sanitizer to prevent XSS
 * Only allows safe tags and attributes
 */
function sanitizeHtml(html: string): string {
  const allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'code', 'pre',
    'ul', 'ol', 'li', 'a', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'span' // Allow span for our interactive terms
  ];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const temp = doc.body;

  const walk = (node: Element) => {
    const children = Array.from(node.children);
    for (const child of children) {
      const tagName = child.tagName.toLowerCase();
      if (!allowedTags.includes(tagName)) {
        const text = document.createTextNode(child.textContent || '');
        child.replaceWith(text);
      } else {
        const attrs = Array.from(child.attributes);
        for (const attr of attrs) {
          if (tagName === 'a' && attr.name === 'href') {
            const href = child.getAttribute('href') || '';
            const safeSchemes = /^(https?:\/\/|mailto:|#|\/)/i;
            if (safeSchemes.test(href) || !href.includes(':')) {
              child.setAttribute('target', '_blank');
              child.setAttribute('rel', 'noopener noreferrer');
            } else {
              child.removeAttribute('href');
            }
          } else if (tagName === 'span' && (attr.name === 'class' || attr.name === 'data-term')) {
            // Allow class and data-term on spans for interactive terms
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

export function InteractiveMarkdownRenderer({
  content,
  className = '',
  onTermClick
}: InteractiveMarkdownRendererProps) {
  const { html, hasInteractiveTerms } = useMemo(() => {
    try {
      const { cleanContent } = parseInteractiveContent(content);

      // Parse markdown
      let rawHtml = marked.parse(cleanContent) as string;

      // Replace placeholders with interactive span elements
      const termButtonRegex = /\{\{INTERACTIVE_TERM:([^}]+)\}\}/g;
      const hasTerms = termButtonRegex.test(rawHtml);

      rawHtml = rawHtml.replace(
        /\{\{INTERACTIVE_TERM:([^}]+)\}\}/g,
        '<span class="interactive-term" data-term="$1">$1</span>'
      );

      return { html: sanitizeHtml(rawHtml), hasInteractiveTerms: hasTerms };
    } catch (e) {
      console.error('Failed to parse markdown:', e);
      return {
        html: content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;'),
        hasInteractiveTerms: false
      };
    }
  }, [content]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('interactive-term') && onTermClick) {
      const term = target.getAttribute('data-term');
      if (term) {
        onTermClick(term);
      }
    }
  };

  return (
    <div
      className={`markdown-content ${className} ${hasInteractiveTerms ? 'has-interactive-terms' : ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
      onClick={handleClick}
    />
  );
}
