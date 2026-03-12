import type { Document } from 'domhandler';

import type { ContactSummary } from '../types.js';
import { uniqueNonEmpty } from '../utils/array.js';
import { collectElements, getNodeText, normalizeWhitespace } from '../utils/dom.js';

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_PATTERN = /(?:\+?\d[\d()\s-]{7,}\d)/g;
const CONTACT_HINTS = ['contact', 'контакт', 'support', 'feedback', 'help', 'about'];

function sanitizePhone(phoneNumber: string): string {
  return phoneNumber.replace(/\s+/g, ' ').trim();
}

function isLikelyPhone(phoneNumber: string): boolean {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  return digitsOnly.length >= 10;
}

export function extractContacts(document: Document, html: string): ContactSummary {
  const emails = uniqueNonEmpty(html.match(EMAIL_PATTERN) ?? []);
  const phoneNumbers = uniqueNonEmpty((html.match(PHONE_PATTERN) ?? []).map(sanitizePhone).filter(isLikelyPhone));

  const anchorTags = collectElements(document, (element) => element.name === 'a');
  const contactLinks: string[] = [];

  for (const anchor of anchorTags) {
    const href = anchor.attribs.href?.trim();
    const text = normalizeWhitespace(getNodeText(anchor)).toLowerCase();
    const hrefLowerCase = href?.toLowerCase() ?? '';

    const hasContactHint = CONTACT_HINTS.some(
      (hint) => hrefLowerCase.includes(hint) || text.includes(hint)
    );

    if (hasContactHint && href) {
      contactLinks.push(href);
    }
  }

  return {
    emails,
    phoneNumbers,
    contactLinks: uniqueNonEmpty(contactLinks)
  };
}
