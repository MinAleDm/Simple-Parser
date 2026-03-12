#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';

import { Command } from 'commander';

import { generateHeadingChartHtml, generateSummaryReportHtml, writeHtmlFile } from './node/index.js';
import { isProbablyUrl, parseHtml, parseUrl } from './parser.js';
import type { ParseOptions, ParseResult } from './types.js';

interface CommonCommandOptions {
  url?: string;
  inputFile?: string;
  output?: string;
  tokens?: boolean;
  ast?: boolean;
}

function buildParseOptions(options: CommonCommandOptions): ParseOptions {
  const parseOptions: ParseOptions = {};

  if (typeof options.tokens === 'boolean') {
    parseOptions.includeTokens = options.tokens;
  }

  if (typeof options.ast === 'boolean') {
    parseOptions.includeAst = options.ast;
  }

  return parseOptions;
}

async function resolveParseResult(input: string | undefined, options: CommonCommandOptions): Promise<ParseResult> {
  const parseOptions = buildParseOptions(options);

  if (options.url) {
    return parseUrl(options.url, parseOptions);
  }

  if (options.inputFile) {
    const html = await readFile(options.inputFile, 'utf8');
    return parseHtml(html, parseOptions, {
      kind: 'html',
      value: options.inputFile
    });
  }

  if (!input) {
    throw new Error('Input is required. Provide HTML text, --url, or --input-file.');
  }

  if (isProbablyUrl(input)) {
    return parseUrl(input, parseOptions);
  }

  return parseHtml(input, parseOptions, {
    kind: 'html',
    value: 'inline'
  });
}

const program = new Command();

program
  .name('simple-parser')
  .description('Parse and analyze HTML content from text, files, or URLs')
  .version('2.0.0');

program
  .argument('[input]', 'Raw HTML string or URL')
  .option('-u, --url <url>', 'Parse directly from URL')
  .option('-i, --input-file <path>', 'Parse HTML from a local file')
  .option('-o, --output <path>', 'Write JSON output to file instead of stdout')
  .option('--no-tokens', 'Skip token extraction')
  .option('--no-ast', 'Skip AST generation')
  .action(async (input: string | undefined, options: CommonCommandOptions) => {
    const result = await resolveParseResult(input, options);
    const payload = JSON.stringify(result, null, 2);

    if (options.output) {
      await writeFile(options.output, payload, 'utf8');
      process.stdout.write(`Saved JSON output to ${options.output}\n`);
      return;
    }

    process.stdout.write(`${payload}\n`);
  });

program
  .command('report')
  .description('Generate full HTML report')
  .argument('[input]', 'Raw HTML string or URL')
  .option('-u, --url <url>', 'Parse directly from URL')
  .option('-i, --input-file <path>', 'Parse HTML from a local file')
  .option('-o, --output <path>', 'Output report path', 'report.html')
  .option('--no-tokens', 'Skip token extraction')
  .option('--no-ast', 'Skip AST generation')
  .action(async (input: string | undefined, options: CommonCommandOptions) => {
    const result = await resolveParseResult(input, options);
    const reportHtml = generateSummaryReportHtml(result);

    await writeHtmlFile(options.output ?? 'report.html', reportHtml);
    process.stdout.write(`Saved report to ${options.output ?? 'report.html'}\n`);
  });

program
  .command('chart')
  .description('Generate headings-only HTML chart')
  .argument('[input]', 'Raw HTML string or URL')
  .option('-u, --url <url>', 'Parse directly from URL')
  .option('-i, --input-file <path>', 'Parse HTML from a local file')
  .option('-o, --output <path>', 'Output chart path', 'chart.html')
  .option('--no-tokens', 'Skip token extraction')
  .option('--no-ast', 'Skip AST generation')
  .action(async (input: string | undefined, options: CommonCommandOptions) => {
    const result = await resolveParseResult(input, options);
    const chartHtml = generateHeadingChartHtml(result);

    await writeHtmlFile(options.output ?? 'chart.html', chartHtml);
    process.stdout.write(`Saved chart to ${options.output ?? 'chart.html'}\n`);
  });

program.parseAsync().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  process.stderr.write(`simple-parser error: ${message}\n`);
  process.exitCode = 1;
});
