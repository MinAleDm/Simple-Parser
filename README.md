# Simple Parser

<div>
  <a href="https://github.com/MinAleDm/Simple-Parser/actions/workflows/ci.yml"><img src="https://github.com/MinAleDm/Simple-Parser/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/MinAleDm/Simple-Parser/actions/workflows/deploy-pages.yml"><img src="https://github.com/MinAleDm/Simple-Parser/actions/workflows/deploy-pages.yml/badge.svg" alt="Deploy Pages" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
</div>

Современный монорепозиторий для анализа HTML: типизированное ядро парсера, CLI-инструмент, интерактивное демо на React + Vite, тесты и CI/CD.

`Simple Parser` полезен и для быстрой ручной проверки HTML, и для автоматизированного аудита страниц в скриптах или CI-пайплайнах. Проект объединяет библиотеку, CLI и демо-интерфейс, чтобы одинаково удобно работать и в коде, и через UI.

Парсер возвращает единый типизированный отчёт: от метаданных страницы и ссылок до структуры документа, текстовых метрик, токенов и AST. Это помогает быстрее находить проблемы в разметке, контенте и SEO-сигналах.

## Ссылки

- Демо (GitHub Pages): https://minaledm.github.io/Simple-Parser/
- Архитектура: [docs/architecture.md](docs/architecture.md)
- Использование: [docs/usage.md](docs/usage.md)

## Что умеет парсер

`simple-parser` возвращает структурированный результат:

- метаданные: `title`, `description`, `keywords`, `canonicalUrl`, `language`
- заголовки: статистика `h1..h6` и список найденных заголовков
- контакты: email, телефоны, контактные ссылки
- ссылки: `internal`, `external`, `anchor`, `mailto`, `tel`
- медиа: изображения, изображения без `alt`, скрипты, стили
- структура страницы: списки, таблицы, формы, контролы форм, кнопки
- текстовые метрики: количество слов/символов, оценка времени чтения
- токены HTML
- AST-дерево

## Структура репозитория

- `core/` — библиотека парсера и CLI
- `demo/` — интерактивный frontend (Vite + React)
- `docs/` — документация и примеры
- `tests/` — unit-тесты
- `.github/workflows/` — CI и деплой на GitHub Pages

## Быстрый старт

```bash
npm install
npm run dev
```

## Скрипты

```bash
npm run build        # сборка core + demo
npm run test         # запуск тестов
npm run lint         # линтинг
npm run format       # форматирование
npm run cli -- "<h1>Привет</h1>"
```

## CLI

```bash
npx simple-parser "<h1>Hello</h1>"
npx simple-parser "https://example.com"
npx simple-parser report --url https://example.com --output report.html
npx simple-parser chart --url https://example.com --output chart.html
```

## Использование как библиотеки

```ts
import { parseHtml, parseUrl } from 'simple-parser';

const resultFromHtml = parseHtml('<h1>Hello</h1>');
const resultFromUrl = await parseUrl('https://example.com');
```

## Демо

В демо-приложении можно:

- вводить HTML вручную
- выбирать готовые примеры
- запускать парсер кнопкой
- смотреть результат в форматах JSON / Tree View / Tokens
- копировать JSON одним кликом

## Лицензия

MIT — см. [LICENSE](LICENSE).
