import type { Document } from 'domhandler';

import type { MetadataSummary } from '../types.js';
import { collectElements, getNodeText, normalizeWhitespace } from '../utils/dom.js';

export function extractMetadata(document: Document, normalizeText: boolean): MetadataSummary {
  const htmlTag = collectElements(document, (element) => element.name === 'html')[0];
  const titleTag = collectElements(document, (element) => element.name === 'title')[0];

  const metaTags = collectElements(document, (element) => element.name === 'meta');
  const linkTags = collectElements(document, (element) => element.name === 'link');

  let description: string | null = null;
  let keywords: string[] = [];

  for (const metaTag of metaTags) {
    const name = metaTag.attribs.name?.toLowerCase();
    const content = metaTag.attribs.content?.trim();

    if (!content) {
      continue;
    }

    if (name === 'description') {
      description = normalizeText ? normalizeWhitespace(content) : content;
    }

    if (name === 'keywords') {
      keywords = content
        .split(',')
        .map((keyword) => keyword.trim())
        .filter(Boolean);
    }
  }

  const canonical = linkTags.find((linkTag) => linkTag.attribs.rel?.toLowerCase() === 'canonical')?.attribs
    .href;

  const rawTitle = titleTag ? getNodeText(titleTag) : null;

  return {
    title: rawTitle ? (normalizeText ? normalizeWhitespace(rawTitle) : rawTitle) : null,
    description,
    keywords,
    canonicalUrl: canonical ?? null,
    language: htmlTag?.attribs.lang ?? null
  };
}
