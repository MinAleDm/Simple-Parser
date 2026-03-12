import type { Token, TokenType } from '../types.js';
import { normalizeWhitespace } from '../utils/dom.js';

const TOKEN_PATTERN = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[a-zA-Z][^>]*>/gi;

function inferTokenType(value: string): TokenType {
  if (value.startsWith('<!--')) {
    return 'comment';
  }

  if (value.toLowerCase().startsWith('<!doctype')) {
    return 'doctype';
  }

  if (value.startsWith('</')) {
    return 'tag-close';
  }

  return 'tag-open';
}

export function tokenizeHtml(html: string, normalizeText: boolean): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;

  // Проходим по маркерам разметки и между ними выделяем отдельные текстовые токены.
  for (const match of html.matchAll(TOKEN_PATTERN)) {
    const value = match[0];
    const start = match.index ?? 0;
    const end = start + value.length;

    if (start > cursor) {
      const rawText = html.slice(cursor, start);
      const textValue = normalizeText ? normalizeWhitespace(rawText) : rawText;

      if (textValue) {
        tokens.push({
          type: 'text',
          value: textValue,
          start: cursor,
          end: start
        });
      }
    }

    tokens.push({
      type: inferTokenType(value),
      value,
      start,
      end
    });

    cursor = end;
  }

  if (cursor < html.length) {
    // Добавляем хвостовой текст после последнего токена разметки.
    const rawTail = html.slice(cursor);
    const tailValue = normalizeText ? normalizeWhitespace(rawTail) : rawTail;

    if (tailValue) {
      tokens.push({
        type: 'text',
        value: tailValue,
        start: cursor,
        end: html.length
      });
    }
  }

  return tokens;
}
