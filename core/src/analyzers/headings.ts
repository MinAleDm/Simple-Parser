import type { Document } from 'domhandler';

import type { HeadingItem, HeadingLevel, HeadingSummary } from '../types.js';
import { collectElements, getNodeText, normalizeWhitespace } from '../utils/dom.js';

const HEADING_LEVELS: HeadingLevel[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export function extractHeadings(document: Document, normalizeText: boolean): HeadingSummary {
  const counts: Record<HeadingLevel, number> = {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0
  };

  const items: HeadingItem[] = [];
  const elements = collectElements(document, (element) => HEADING_LEVELS.includes(element.name as HeadingLevel));

  for (const heading of elements) {
    const level = heading.name as HeadingLevel;
    const rawText = getNodeText(heading);
    const text = normalizeText ? normalizeWhitespace(rawText) : rawText;

    counts[level] += 1;

    if (text) {
      items.push({
        level,
        text
      });
    }
  }

  const total = HEADING_LEVELS.reduce((accumulator, level) => accumulator + counts[level], 0);

  return {
    counts,
    total,
    items
  };
}
