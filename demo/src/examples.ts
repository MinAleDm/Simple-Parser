export interface DemoExample {
  id: string;
  title: string;
  description: string;
  html: string;
}

export const DEMO_EXAMPLES: DemoExample[] = [
  {
    id: 'enterprise-portal',
    title: 'Корпоративный портал',
    description: 'Сложный HTML с формами, таблицей, медиа, скриптами и контактами.',
    html: `<!doctype html>
<html lang="ru">
  <head>
    <title>NovaBoard — портал команды аналитики</title>
    <meta name="description" content="Единый портал для управления релизами, алертами и отчётами по продукту." />
    <meta name="keywords" content="analytics, release, monitoring, dashboard" />
    <meta property="og:title" content="NovaBoard Portal" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://portal.novaboard.dev" />
    <link rel="canonical" href="https://portal.novaboard.dev" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "NovaBoard",
        "url": "https://portal.novaboard.dev",
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "support@novaboard.dev",
          "telephone": "+7 495 000 00 01"
        }
      }
    </script>
  </head>
  <body>
    <header>
      <h1>NovaBoard Portal</h1>
      <h2>Контроль инцидентов и релизов в реальном времени</h2>
      <nav>
        <a href="/overview">Обзор</a>
        <a href="/incidents">Инциденты</a>
        <a href="/releases">Релизы</a>
        <a href="https://github.com/MinAleDm/Simple-Parser">GitHub</a>
      </nav>
    </header>
    <main>
      <section id="kpi">
        <h3>Ключевые метрики</h3>
        <ul>
          <li>Uptime: 99.98%</li>
          <li>MTTR: 17m</li>
          <li>Ошибки 5xx за сутки: 42</li>
        </ul>
      </section>

      <section id="release-plan">
        <h3>План релиза 2.4.0</h3>
        <table>
          <thead>
            <tr>
              <th>Компонент</th>
              <th>Статус</th>
              <th>Ответственный</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>API Gateway</td>
              <td>Ready</td>
              <td>platform@novaboard.dev</td>
            </tr>
            <tr>
              <td>Billing Worker</td>
              <td>QA</td>
              <td>qa@novaboard.dev</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="feedback">
        <h3>Сообщить о проблеме</h3>
        <form action="/tickets" method="post">
          <label>
            Email
            <input type="email" name="email" required />
          </label>
          <label>
            Приоритет
            <select name="priority">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <label>
            Описание
            <textarea name="description"></textarea>
          </label>
          <button type="submit">Создать тикет</button>
        </form>
      </section>

      <aside>
        <p>Связаться с дежурной сменой: noc@novaboard.dev</p>
        <p>Телефон SLA: +7 495 000 00 02</p>
      </aside>

      <img src="/assets/portal-dashboard.png" alt="Панель мониторинга" />
    </main>
    <footer>
      <p>&copy; 2026 NovaBoard</p>
      <a href="mailto:support@novaboard.dev">support@novaboard.dev</a>
      <a href="tel:+74950000001">+7 495 000 00 01</a>
    </footer>
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
