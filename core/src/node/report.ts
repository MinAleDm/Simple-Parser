import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { ParseResult } from '../types.js';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function generateSummaryReportHtml(result: ParseResult): string {
  const source = escapeHtml(result.source.value);
  const description = result.metadata.description
    ? escapeHtml(result.metadata.description)
    : 'Description is not available';

  const emails = result.contacts.emails.length
    ? result.contacts.emails.map(escapeHtml).join(', ')
    : 'Not found';
  const phones = result.contacts.phoneNumbers.length
    ? result.contacts.phoneNumbers.map(escapeHtml).join(', ')
    : 'Not found';
  const contactLinks = result.contacts.contactLinks.length
    ? result.contacts.contactLinks
        .map((link) => `<li><a href="${escapeHtml(link)}">${escapeHtml(link)}</a></li>`)
        .join('')
    : '<li>Not found</li>';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Simple Parser Report</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
      :root {
        color-scheme: dark;
        --bg: #08090d;
        --panel: #131622;
        --accent: #67d0ff;
        --muted: #8c95ad;
      }
      body {
        margin: 0;
        padding: 28px;
        font-family: 'Segoe UI', sans-serif;
        background: radial-gradient(circle at top, #1a2140 0%, var(--bg) 50%);
        color: #e8ecf8;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 14px;
      }
      .panel {
        background: var(--panel);
        border: 1px solid #20253a;
        border-radius: 14px;
        padding: 16px;
      }
      h1,
      h2 {
        margin: 0 0 12px;
      }
      p,
      li {
        color: var(--muted);
      }
      a {
        color: var(--accent);
      }
      canvas {
        max-width: 900px;
      }
    </style>
  </head>
  <body>
    <h1>Simple Parser Report</h1>
    <p>Source: ${source}</p>

    <div class="grid">
      <section class="panel">
        <h2>Metadata</h2>
        <p><strong>Title:</strong> ${escapeHtml(result.metadata.title ?? 'Not found')}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Language:</strong> ${escapeHtml(result.metadata.language ?? 'Not found')}</p>
      </section>

      <section class="panel">
        <h2>Contacts</h2>
        <p><strong>Emails:</strong> ${emails}</p>
        <p><strong>Phone numbers:</strong> ${phones}</p>
        <ul>${contactLinks}</ul>
      </section>

      <section class="panel">
        <h2>Text</h2>
        <p><strong>Word count:</strong> ${result.text.wordCount}</p>
        <p><strong>Characters:</strong> ${result.text.characterCount}</p>
        <p><strong>Reading time:</strong> ${result.text.readingTimeMinutes} min</p>
      </section>

      <section class="panel">
        <h2>Media</h2>
        <p><strong>Images:</strong> ${result.media.images}</p>
        <p><strong>Images missing alt:</strong> ${result.media.imagesMissingAlt}</p>
        <p><strong>Scripts:</strong> ${result.media.scripts}</p>
        <p><strong>Stylesheets:</strong> ${result.media.stylesheets}</p>
      </section>

      <section class="panel">
        <h2>Structure</h2>
        <p><strong>Lists:</strong> ${result.structure.lists}</p>
        <p><strong>Tables:</strong> ${result.structure.tables}</p>
        <p><strong>Forms:</strong> ${result.structure.forms}</p>
        <p><strong>Form controls:</strong> ${result.structure.formControls}</p>
        <p><strong>Buttons:</strong> ${result.structure.buttons}</p>
      </section>
    </div>

    <section class="panel" style="margin-top: 14px">
      <h2>Heading Distribution</h2>
      <canvas id="headingChart"></canvas>
    </section>

    <script>
      const headingChart = document.getElementById('headingChart').getContext('2d');
      new Chart(headingChart, {
        type: 'bar',
        data: {
          labels: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
          datasets: [
            {
              label: 'Headings count',
              data: [
                ${result.headings.counts.h1},
                ${result.headings.counts.h2},
                ${result.headings.counts.h3},
                ${result.headings.counts.h4},
                ${result.headings.counts.h5},
                ${result.headings.counts.h6}
              ],
              backgroundColor: '#67d0ff'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }
      });
    </script>
  </body>
</html>`;
}

export function generateHeadingChartHtml(result: ParseResult): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Heading Chart</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #10131d;
        color: #e8ecf8;
      }
      .panel {
        width: min(900px, 90vw);
        background: #171b2b;
        border: 1px solid #20253a;
        border-radius: 16px;
        padding: 24px;
      }
      h1 {
        margin-top: 0;
      }
    </style>
  </head>
  <body>
    <section class="panel">
      <h1>Heading Chart for ${escapeHtml(result.source.value)}</h1>
      <canvas id="chart"></canvas>
    </section>
    <script>
      const ctx = document.getElementById('chart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
          datasets: [
            {
              label: 'Headings count',
              data: [
                ${result.headings.counts.h1},
                ${result.headings.counts.h2},
                ${result.headings.counts.h3},
                ${result.headings.counts.h4},
                ${result.headings.counts.h5},
                ${result.headings.counts.h6}
              ],
              backgroundColor: ['#8be9fd', '#ff79c6', '#f1fa8c', '#50fa7b', '#bd93f9', '#ffb86c']
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }
      });
    </script>
  </body>
</html>`;
}

export async function writeHtmlFile(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, 'utf8');
}
