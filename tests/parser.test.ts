import { describe, expect, it } from 'vitest';

import { parseHtml } from '../core/src/index.ts';

const SAMPLE_HTML = `
<!doctype html>
<html lang="en">
  <head>
    <title>Demo parser page</title>
    <meta name="description" content="Parser demo page for tests" />
    <meta name="keywords" content="parser, html, test" />
    <link rel="canonical" href="https://example.com/demo" />
  </head>
  <body>
    <h1>Main heading</h1>
    <h2>Section title</h2>
    <p>Contact us at test@example.com or +1 (202) 555-0101.</p>
    <form action="/submit">
      <input type="email" name="email" />
      <textarea name="message"></textarea>
      <button type="submit">Send</button>
    </form>
    <ul>
      <li>One</li>
      <li>Two</li>
    </ul>
    <a href="/contact">Contact</a>
    <a href="mailto:test@example.com">Email us</a>
    <a href="https://google.com">External</a>
    <img src="cover.png" />
    <img src="photo.png" alt="Photo" />
  </body>
</html>`;

describe('parseHtml', () => {
  it('extracts metadata and structural statistics', () => {
    const result = parseHtml(SAMPLE_HTML, {}, { kind: 'url', value: 'https://example.com' });

    expect(result.metadata.title).toBe('Demo parser page');
    expect(result.metadata.description).toBe('Parser demo page for tests');
    expect(result.metadata.keywords).toEqual(['parser', 'html', 'test']);

    expect(result.headings.counts.h1).toBe(1);
    expect(result.headings.counts.h2).toBe(1);
    expect(result.headings.total).toBe(2);

    expect(result.contacts.emails).toContain('test@example.com');
    expect(result.contacts.phoneNumbers.length).toBe(1);
    expect(result.contacts.contactLinks).toContain('/contact');

    expect(result.links.internal).toBe(1);
    expect(result.links.external).toBe(1);
    expect(result.links.mailto).toBe(1);

    expect(result.media.images).toBe(2);
    expect(result.media.imagesMissingAlt).toBe(1);
    expect(result.structure.forms).toBe(1);
    expect(result.structure.formControls).toBe(2);
    expect(result.structure.buttons).toBe(1);
    expect(result.structure.lists).toBe(1);
    expect(result.text.wordCount).toBeGreaterThan(0);

    expect(result.tokens.length).toBeGreaterThan(0);
    expect(result.ast?.type).toBe('root');
  });

  it('can disable heavy sections', () => {
    const result = parseHtml('<h1>Hello</h1>', { includeAst: false, includeTokens: false });

    expect(result.tokens).toEqual([]);
    expect(result.ast).toBeNull();
  });
});
