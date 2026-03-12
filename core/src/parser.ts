import axios from 'axios';

import { buildAst } from './analyzers/ast.js';
import { extractContacts } from './analyzers/contacts.js';
import { extractHeadings } from './analyzers/headings.js';
import { extractLinks } from './analyzers/links.js';
import { extractMedia } from './analyzers/media.js';
import { extractMetadata } from './analyzers/metadata.js';
import { extractStructure } from './analyzers/structure.js';
import { extractText } from './analyzers/text.js';
import { tokenizeHtml } from './analyzers/tokens.js';
import type { ParseOptions, ParseResult, ParseSource } from './types.js';
import { parseHtmlDocument } from './utils/dom.js';

const DEFAULT_OPTIONS: Required<ParseOptions> = {
  includeTokens: true,
  includeAst: true,
  normalizeWhitespace: true
};

function mergeOptions(options: ParseOptions): Required<ParseOptions> {
  return {
    ...DEFAULT_OPTIONS,
    ...options
  };
}

export function isProbablyUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function parseHtml(html: string, options: ParseOptions = {}, source?: ParseSource): ParseResult {
  const mergedOptions = mergeOptions(options);
  const document = parseHtmlDocument(html);

  return {
    source: source ?? { kind: 'html', value: 'inline' },
    metadata: extractMetadata(document, mergedOptions.normalizeWhitespace),
    headings: extractHeadings(document, mergedOptions.normalizeWhitespace),
    contacts: extractContacts(document, html),
    links: extractLinks(document, source?.kind === 'url' ? source.value : undefined),
    media: extractMedia(document),
    structure: extractStructure(document),
    text: extractText(document, mergedOptions.normalizeWhitespace),
    tokens: mergedOptions.includeTokens ? tokenizeHtml(html, mergedOptions.normalizeWhitespace) : [],
    ast: mergedOptions.includeAst ? buildAst(document, mergedOptions.normalizeWhitespace) : null
  };
}

export async function parseUrl(url: string, options: ParseOptions = {}): Promise<ParseResult> {
  const response = await axios.get<string>(url, {
    responseType: 'text'
  });

  return parseHtml(response.data, options, {
    kind: 'url',
    value: url
  });
}
