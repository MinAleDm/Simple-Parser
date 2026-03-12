import type { AnyNode, Document } from 'domhandler';

import type { TextSummary } from '../types.js';
import { normalizeWhitespace, walkNodes } from '../utils/dom.js';

function isScriptLikeNode(node: AnyNode | null | undefined): boolean {
  if (!node || node.type !== 'script' && node.type !== 'style') {
    return false;
  }

  return true;
}

export function extractText(document: Document, normalizeText: boolean): TextSummary {
  const textSegments: string[] = [];

  walkNodes(document.children, (node) => {
    if (node.type !== 'text') {
      return;
    }

    if (isScriptLikeNode(node.parent)) {
      return;
    }

    const segment = normalizeText ? normalizeWhitespace(node.data) : node.data;

    if (segment) {
      textSegments.push(segment);
    }
  });

  const mergedText = normalizeText
    ? normalizeWhitespace(textSegments.join(' '))
    : textSegments.join(' ');
  const words = mergedText.match(/[\p{L}\p{N}]+/gu) ?? [];

  return {
    wordCount: words.length,
    characterCount: mergedText.length,
    readingTimeMinutes: words.length === 0 ? 0 : Math.max(1, Math.ceil(words.length / 200))
  };
}
