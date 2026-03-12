import { useMemo, useState } from 'react';
import { parseHtml, type ParseResult } from 'simple-parser';

import { AstTree } from './components/AstTree';
import { TokenTable } from './components/TokenTable';
import { DEMO_EXAMPLES } from './examples';

type ResultView = 'json' | 'tree' | 'tokens';

function runParse(input: string): ParseResult {
  return parseHtml(input, {
    includeAst: true,
    includeTokens: true,
    normalizeWhitespace: true
  });
}

export function App() {
  const [input, setInput] = useState(DEMO_EXAMPLES[0].html);
  const [result, setResult] = useState<ParseResult>(() => runParse(DEMO_EXAMPLES[0].html));
  const [view, setView] = useState<ResultView>('json');
  const [error, setError] = useState<string | null>(null);

  const prettyJson = useMemo(() => JSON.stringify(result, null, 2), [result]);

  const parseInput = () => {
    try {
      const nextResult = runParse(input);
      setResult(nextResult);
      setError(null);
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : 'Failed to parse input.');
    }
  };

  const selectExample = (exampleId: string) => {
    const example = DEMO_EXAMPLES.find((entry) => entry.id === exampleId);

    if (!example) {
      return;
    }

    setInput(example.html);
    const parsed = runParse(example.html);
    setResult(parsed);
    setError(null);
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(prettyJson);
  };

  return (
    <main className="layout">
      <header className="hero">
        <img className="hero-logo" src="/simpleparserlogo.png" alt="Логотип Simple Parser" />
        <p className="eyebrow">Simple Parser</p>
        <h1>Interactive HTML Parsing Workbench</h1>
        <p className="muted">
          Inspect metadata, headings, links, contacts, tokens, and AST with one parse operation.
        </p>
      </header>

      <section className="examples card">
        <h2>Examples</h2>
        <div className="examples-grid">
          {DEMO_EXAMPLES.map((example) => (
            <button key={example.id} className="example-button" onClick={() => selectExample(example.id)}>
              <strong>{example.title}</strong>
              <span>{example.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="workspace">
        <article className="card editor-panel">
          <div className="panel-header">
            <h2>Input</h2>
            <button className="action" onClick={parseInput}>
              Run Parser
            </button>
          </div>
          <textarea
            aria-label="HTML input"
            className="editor"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          {error ? <p className="error">{error}</p> : null}
        </article>

        <article className="card output-panel">
          <div className="panel-header">
            <h2>Result</h2>
            <button className="action ghost" onClick={copyJson}>
              Copy JSON
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat">
              <span>Headings</span>
              <strong>{result.headings.total}</strong>
            </div>
            <div className="stat">
              <span>Links</span>
              <strong>{result.links.total}</strong>
            </div>
            <div className="stat">
              <span>Emails</span>
              <strong>{result.contacts.emails.length}</strong>
            </div>
            <div className="stat">
              <span>Words</span>
              <strong>{result.text.wordCount}</strong>
            </div>
            <div className="stat">
              <span>Forms</span>
              <strong>{result.structure.forms}</strong>
            </div>
            <div className="stat">
              <span>Controls</span>
              <strong>{result.structure.formControls}</strong>
            </div>
          </div>

          <div className="tabs" role="tablist" aria-label="Result views">
            <button
              className={view === 'json' ? 'tab active' : 'tab'}
              role="tab"
              onClick={() => setView('json')}
            >
              JSON
            </button>
            <button
              className={view === 'tree' ? 'tab active' : 'tab'}
              role="tab"
              onClick={() => setView('tree')}
            >
              Tree View
            </button>
            <button
              className={view === 'tokens' ? 'tab active' : 'tab'}
              role="tab"
              onClick={() => setView('tokens')}
            >
              Tokens
            </button>
          </div>

          <div className="result-body">
            {view === 'json' ? (
              <pre>{prettyJson}</pre>
            ) : null}

            {view === 'tree' ? (
              result.ast ? (
                <ul className="tree-root">
                  <AstTree node={result.ast} />
                </ul>
              ) : (
                <p className="muted">AST generation is disabled.</p>
              )
            ) : null}

            {view === 'tokens' ? <TokenTable tokens={result.tokens} /> : null}
          </div>
        </article>
      </section>
    </main>
  );
}
