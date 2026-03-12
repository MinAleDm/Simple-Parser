import { useEffect, useMemo, useState } from 'react';
import { parseHtml, type ParseResult } from 'simple-parser';

import { AstTree } from './components/AstTree';
import { TokenTable } from './components/TokenTable';
import { DEMO_EXAMPLES } from './examples';

type ResultView = 'json' | 'tree' | 'tokens';
type AppPage = 'home' | 'demo';

interface RunHistoryEntry {
  id: string;
  source: string;
  timestamp: string;
  headings: number;
  links: number;
  words: number;
  tokens: number;
}

const STORAGE_KEY = 'simple-parser:demo-runs';
const INITIAL_EXAMPLE = DEMO_EXAMPLES[0];

function runParse(input: string): ParseResult {
  return parseHtml(input, {
    includeAst: true,
    includeTokens: true,
    normalizeWhitespace: true
  });
}

function resolvePageFromHash(hash: string): AppPage {
  const normalized = hash.replace(/^#\/?/, '').toLowerCase();
  return normalized === 'demo' ? 'demo' : 'home';
}

function createRunEntry(result: ParseResult, source: string): RunHistoryEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    source,
    timestamp: new Date().toISOString(),
    headings: result.headings.total,
    links: result.links.total,
    words: result.text.wordCount,
    tokens: result.tokens.length
  };
}

const INITIAL_RESULT = runParse(INITIAL_EXAMPLE.html);

export function App() {
  const [input, setInput] = useState(INITIAL_EXAMPLE.html);
  const [result, setResult] = useState<ParseResult>(INITIAL_RESULT);
  const [view, setView] = useState<ResultView>('json');
  const [page, setPage] = useState<AppPage>(() => {
    if (typeof window === 'undefined') {
      return 'home';
    }

    return resolvePageFromHash(window.location.hash);
  });
  const [error, setError] = useState<string | null>(null);
  const [runHistory, setRunHistory] = useState<RunHistoryEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = window.localStorage.getItem(STORAGE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);

          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.slice(0, 25) as RunHistoryEntry[];
          }
        }
      } catch {
        // Ignore broken localStorage data and fallback to default history.
      }
    }

    return [createRunEntry(INITIAL_RESULT, `Старт: ${INITIAL_EXAMPLE.title}`)];
  });
  const logoSrc = `${import.meta.env.BASE_URL}favicon.svg`;

  const prettyJson = useMemo(() => JSON.stringify(result, null, 2), [result]);

  useEffect(() => {
    const onHashChange = () => {
      setPage(resolvePageFromHash(window.location.hash));
    };

    onHashChange();
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(runHistory));
    } catch {
      // Ignore localStorage write failures.
    }
  }, [runHistory]);

  const goToPage = (nextPage: AppPage) => {
    window.location.hash = nextPage === 'demo' ? '#demo' : '#home';
    setPage(nextPage);
  };

  const registerRun = (nextResult: ParseResult, source: string) => {
    setRunHistory((previous) => [createRunEntry(nextResult, source), ...previous].slice(0, 25));
  };

  const parseInput = () => {
    try {
      const nextResult = runParse(input);
      setResult(nextResult);
      setError(null);
      registerRun(nextResult, 'Ручной запуск');
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : 'Не удалось разобрать ввод.');
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
    registerRun(parsed, `Пример: ${example.title}`);
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(prettyJson);
  };

  const clearHistory = () => {
    setRunHistory([]);
  };

  return (
    <main className="layout">
      <header className="top-nav card">
        <button className="brand" type="button" onClick={() => goToPage('home')}>
          <img className="brand-logo" src={logoSrc} alt="Логотип Simple Parser" />
          <span>Simple Parser</span>
        </button>

        <div className="main-nav">
          <button
            type="button"
            className={page === 'home' ? 'nav-link active' : 'nav-link'}
            onClick={() => goToPage('home')}
          >
            Главная
          </button>
          <button
            type="button"
            className={page === 'demo' ? 'nav-link active' : 'nav-link'}
            onClick={() => goToPage('demo')}
          >
            Демо
          </button>
          <a
            className="nav-link github-link"
            href="https://github.com/MinAleDm/Simple-Parser"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      {page === 'home' ? (
        <section className="home-layout">
          <article className="card intro-card">
            <p className="eyebrow">Simple Parser</p>
            <h1>Быстрый аудит HTML-разметки в одном инструменте</h1>
            <p className="muted">
              Парсер анализирует метаданные, структуру документа, ссылки, контактные данные, AST и токены.
              На странице демо можно запускать анализ на готовых шаблонах или собственном HTML.
            </p>

            <div className="hero-pills" aria-label="Возможности парсера">
              <span className="pill">Метаданные</span>
              <span className="pill">Заголовки</span>
              <span className="pill">Ссылки</span>
              <span className="pill">AST</span>
              <span className="pill">Токены</span>
              <span className="pill">Структурные метрики</span>
            </div>

            <ul className="intro-list">
              <li>Подходит для ручной проверки HTML перед публикацией.</li>
              <li>Помогает быстро найти проблемы в SEO, контенте и структуре страницы.</li>
              <li>Результат можно смотреть в JSON, древовидном виде и таблице токенов.</li>
            </ul>

            <div className="home-actions">
              <button className="action" type="button" onClick={() => goToPage('demo')}>
                Перейти в демо
              </button>
            </div>
          </article>

          <article className="card runs-card">
            <div className="panel-header">
              <h2>Запуски парсера</h2>
              <button className="action ghost" type="button" onClick={clearHistory}>
                Очистить
              </button>
            </div>

            {runHistory.length === 0 ? (
              <p className="empty-state muted">История пока пустая. Запустите парсер на странице демо.</p>
            ) : (
              <div className="table-wrap">
                <table className="runs-table">
                  <thead>
                    <tr>
                      <th>Источник</th>
                      <th>Время</th>
                      <th>H</th>
                      <th>Ссылки</th>
                      <th>Слова</th>
                      <th>Токены</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runHistory.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.source}</td>
                        <td>{new Date(entry.timestamp).toLocaleString('ru-RU')}</td>
                        <td>{entry.headings}</td>
                        <td>{entry.links}</td>
                        <td>{entry.words}</td>
                        <td>{entry.tokens}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </section>
      ) : (
        <section className="demo-layout">
          <div className="demo-controls">
            <article className="examples card">
              <h2>Примеры</h2>
              <div className="examples-grid">
                {DEMO_EXAMPLES.map((example) => (
                  <button
                    key={example.id}
                    className="example-button"
                    type="button"
                    onClick={() => selectExample(example.id)}
                  >
                    <strong>{example.title}</strong>
                    <span>{example.description}</span>
                  </button>
                ))}
              </div>
            </article>

            <article className="card editor-panel">
              <div className="panel-header">
                <h2>Ввод HTML</h2>
                <button className="action" type="button" onClick={parseInput}>
                  Запустить парсер
                </button>
              </div>
              <textarea
                aria-label="HTML ввод"
                className="editor"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              {error ? <p className="error">{error}</p> : null}
            </article>
          </div>

          <article className="card output-panel">
            <div className="panel-header">
              <h2>Результат</h2>
              <button className="action ghost" type="button" onClick={copyJson}>
                Копировать JSON
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat">
                <span>Заголовки</span>
                <strong>{result.headings.total}</strong>
              </div>
              <div className="stat">
                <span>Ссылки</span>
                <strong>{result.links.total}</strong>
              </div>
              <div className="stat">
                <span>Email</span>
                <strong>{result.contacts.emails.length}</strong>
              </div>
              <div className="stat">
                <span>Слова</span>
                <strong>{result.text.wordCount}</strong>
              </div>
              <div className="stat">
                <span>Формы</span>
                <strong>{result.structure.forms}</strong>
              </div>
              <div className="stat">
                <span>Поля</span>
                <strong>{result.structure.formControls}</strong>
              </div>
            </div>

            <div className="tabs" role="tablist" aria-label="Представления результата">
              <button
                type="button"
                className={view === 'json' ? 'tab active' : 'tab'}
                role="tab"
                onClick={() => setView('json')}
              >
                JSON
              </button>
              <button
                type="button"
                className={view === 'tree' ? 'tab active' : 'tab'}
                role="tab"
                onClick={() => setView('tree')}
              >
                Дерево
              </button>
              <button
                type="button"
                className={view === 'tokens' ? 'tab active' : 'tab'}
                role="tab"
                onClick={() => setView('tokens')}
              >
                Токены
              </button>
            </div>

            <div className="result-body">
              {view === 'json' ? <pre>{prettyJson}</pre> : null}

              {view === 'tree' ? (
                result.ast ? (
                  <ul className="tree-root">
                    <AstTree node={result.ast} />
                  </ul>
                ) : (
                  <p className="muted">Генерация AST отключена.</p>
                )
              ) : null}

              {view === 'tokens' ? <TokenTable tokens={result.tokens} /> : null}
            </div>
          </article>
        </section>
      )}

      <footer className="card site-footer">
        <div className="footer-main">
          <p className="footer-title">Simple Parser Demo</p>
          <p className="muted">Инструмент для быстрой проверки HTML, структуры документа и токенизации.</p>
        </div>
        <div className="footer-links">
          <a href="#home" onClick={() => goToPage('home')}>
            Главная
          </a>
          <a href="#demo" onClick={() => goToPage('demo')}>
            Демо
          </a>
          <a href="https://github.com/MinAleDm/Simple-Parser" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <p className="footer-copy muted">© 2026 Simple Parser</p>
      </footer>
    </main>
  );
}
