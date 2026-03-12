export interface DemoExample {
  id: string;
  title: string;
  description: string;
  html: string;
}

export const DEMO_EXAMPLES: DemoExample[] = [
  {
    id: 'landing',
    title: 'Landing Page',
    description: 'Typical product page with metadata and contacts.',
    html: `<!doctype html>
<html lang="en">
  <head>
    <title>Acme Analytics</title>
    <meta name="description" content="Track your product metrics in real-time." />
  </head>
  <body>
    <header>
      <h1>Acme Analytics</h1>
      <h2>Data visibility for distributed teams</h2>
    </header>
    <main>
      <p>Email us at hello@acme.dev or support@acme.dev</p>
      <a href="/contact">Contact team</a>
      <a href="https://github.com/acme">GitHub</a>
      <img src="hero.png" />
    </main>
  </body>
</html>`
  },
  {
    id: 'blog',
    title: 'Blog Article',
    description: 'More headings and rich text sample.',
    html: `<!doctype html>
<html lang="en">
  <head>
    <title>Engineering Blog</title>
    <meta name="description" content="Architecture lessons from production systems" />
    <meta name="keywords" content="architecture, testing, parser" />
  </head>
  <body>
    <article>
      <h1>Architecture Lessons</h1>
      <h2>Keep modules focused</h2>
      <p>This article explains why clear boundaries improve maintainability.</p>
      <h2>Measure before scaling</h2>
      <p>Contact +44 20 7946 0958 for consulting.</p>
      <a href="#comments">Jump to comments</a>
    </article>
  </body>
</html>`
  },
  {
    id: 'minimal',
    title: 'Minimal HTML',
    description: 'Small snippet to inspect tokenization quickly.',
    html: `<div><h1>Hello parser</h1><p>Fast feedback loop.</p></div>`
  },
  {
    id: 'checkout',
    title: 'Checkout Form',
    description: 'Form-heavy page to inspect structure metrics.',
    html: `<!doctype html>
<html lang="en">
  <head>
    <title>Checkout</title>
    <meta name="description" content="Checkout form demo" />
  </head>
  <body>
    <main>
      <h1>Checkout</h1>
      <form action="/pay" method="post">
        <label>
          Email
          <input type="email" name="email" />
        </label>
        <label>
          Country
          <select name="country">
            <option>US</option>
            <option>DE</option>
          </select>
        </label>
        <label>
          Notes
          <textarea name="notes"></textarea>
        </label>
        <button type="submit">Pay now</button>
      </form>
      <ul>
        <li>SSL secured</li>
        <li>Instant receipt</li>
      </ul>
    </main>
  </body>
</html>`
  }
];
