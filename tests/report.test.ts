import { describe, expect, it } from 'vitest';

import { generateHeadingChartHtml, generateSummaryReportHtml } from '../core/src/node/index.ts';
import { parseHtml } from '../core/src/parser.ts';

describe('node report generation', () => {
  it('generates summary and chart html documents', () => {
    const result = parseHtml('<html><body><h1>Title</h1></body></html>', {}, { kind: 'html', value: 'inline' });

    const reportHtml = generateSummaryReportHtml(result);
    const chartHtml = generateHeadingChartHtml(result);

    expect(reportHtml).toContain('<!DOCTYPE html>');
    expect(reportHtml).toContain('Simple Parser Report');
    expect(chartHtml).toContain('Heading Chart');
    expect(chartHtml).toContain('Headings count');
  });
});
