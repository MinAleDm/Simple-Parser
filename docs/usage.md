# Usage

## Library

```ts
import { parseHtml, parseUrl } from 'simple-parser';

const resultFromHtml = parseHtml('<h1>Hello</h1>');
const resultFromUrl = await parseUrl('https://example.com');
```

## CLI

```bash
npx simple-parser "<h1>Hello</h1>"
npx simple-parser "https://example.com"
npx simple-parser report --url https://example.com --output report.html
npx simple-parser chart --url https://example.com --output chart.html
```

## Demo

```bash
cd demo
npm run dev
```

The demo lets you input HTML text and inspect:

- Parsed JSON output
- AST tree view
- Highlighted token stream
- Structure metrics (forms, controls, lists, tables)
