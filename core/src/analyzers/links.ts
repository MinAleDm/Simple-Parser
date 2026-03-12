import type { Document } from 'domhandler';

import type { LinkSummary } from '../types.js';
import { collectElements } from '../utils/dom.js';

function isHttpUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://');
}

function isInternalLink(href: string, sourceUrl?: string): boolean {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false;
  }

  if (!isHttpUrl(href)) {
    return true;
  }

  if (!sourceUrl) {
    return false;
  }

  try {
    const sourceHost = new URL(sourceUrl).host;
    const targetHost = new URL(href).host;
    return sourceHost === targetHost;
  } catch {
    return false;
  }
}

export function extractLinks(document: Document, sourceUrl?: string): LinkSummary {
  const anchorTags = collectElements(document, (element) => element.name === 'a');

  let internal = 0;
  let external = 0;
  let anchor = 0;
  let mailto = 0;
  let tel = 0;

  for (const anchorTag of anchorTags) {
    const href = anchorTag.attribs.href?.trim() ?? '';

    if (!href) {
      continue;
    }

    if (href.startsWith('#')) {
      anchor += 1;
      continue;
    }

    if (href.startsWith('mailto:')) {
      mailto += 1;
      continue;
    }

    if (href.startsWith('tel:')) {
      tel += 1;
      continue;
    }

    if (isInternalLink(href, sourceUrl)) {
      internal += 1;
      continue;
    }

    external += 1;
  }

  return {
    total: anchorTags.length,
    internal,
    external,
    anchor,
    mailto,
    tel
  };
}
