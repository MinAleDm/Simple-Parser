export interface DemoExample {
  id: string;
  title: string;
  description: string;
  html: string;
}

export const DEMO_EXAMPLES: DemoExample[] = [
  {
    id: 'landing',
    title: 'Лендинг',
    description: 'Типичная продуктовая страница с метаданными и контактами.',
    html: `<!doctype html>
<html lang="ru">
  <head>
    <title>Acme Аналитика</title>
    <meta name="description" content="Отслеживайте метрики продукта в реальном времени." />
  </head>
  <body>
    <header>
      <h1>Acme Аналитика</h1>
      <h2>Единая видимость данных для распределённых команд</h2>
    </header>
    <main>
      <p>Напишите нам: hello@acme.dev или support@acme.dev</p>
      <a href="/contact">Связаться с командой</a>
      <a href="https://github.com/acme">GitHub</a>
      <img src="hero.png" />
    </main>
  </body>
</html>`
  },
  {
    id: 'blog',
    title: 'Статья блога',
    description: 'Пример с большим числом заголовков и текстом.',
    html: `<!doctype html>
<html lang="ru">
  <head>
    <title>Инженерный блог</title>
    <meta name="description" content="Уроки архитектуры из продакшен-систем" />
    <meta name="keywords" content="архитектура, тестирование, парсер" />
  </head>
  <body>
    <article>
      <h1>Уроки архитектуры</h1>
      <h2>Держите модули сфокусированными</h2>
      <p>Эта статья объясняет, почему чёткие границы улучшают поддерживаемость проекта.</p>
      <h2>Измеряйте до масштабирования</h2>
      <p>Для консультации звоните: +44 20 7946 0958.</p>
      <a href="#comments">Перейти к комментариям</a>
    </article>
  </body>
</html>`
  },
  {
    id: 'minimal',
    title: 'Минимальный HTML',
    description: 'Короткий сниппет для быстрой проверки токенизации.',
    html: `<div><h1>Привет, парсер</h1><p>Быстрый цикл обратной связи.</p></div>`
  },
  {
    id: 'checkout',
    title: 'Форма оплаты',
    description: 'Страница с формами для проверки структурных метрик.',
    html: `<!doctype html>
<html lang="ru">
  <head>
    <title>Оплата</title>
    <meta name="description" content="Демо-форма оформления заказа" />
  </head>
  <body>
    <main>
      <h1>Оформление заказа</h1>
      <form action="/pay" method="post">
        <label>
          Email
          <input type="email" name="email" />
        </label>
        <label>
          Страна
          <select name="country">
            <option>Россия</option>
            <option>Германия</option>
          </select>
        </label>
        <label>
          Комментарий
          <textarea name="notes"></textarea>
        </label>
        <button type="submit">Оплатить</button>
      </form>
      <ul>
        <li>Защищённое SSL-соединение</li>
        <li>Мгновенная квитанция</li>
      </ul>
    </main>
  </body>
</html>`
  }
];
