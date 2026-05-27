#!/usr/bin/env node
// Genera 42 HTML statici ottimizzati per i crawler social.
// Serviti da nginx solo quando User-Agent corrisponde a FB/Twitter/WA/LinkedIn/...
// così gli utenti veri continuano a vedere la SPA React.
//
// Uso (sul VPS, dalla root del repo o dalla cartella dist):
//   node tools/generate-prerendered.mjs --out /path/del/sito/prerendered
//
// Idempotente: rigenerabile a ogni deploy.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, SITE } from './seo-pages.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) acc.push([cur.replace(/^--/, ''), arr[i + 1]]);
    return acc;
  }, [])
);

const OUT = path.resolve(args.out || path.join(__dirname, '..', 'frontend', 'public', 'prerendered'));
console.log(`[prerender] output: ${OUT}`);

const esc = (s = '') =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

function jsonLdFor(page) {
  const isHome = page.path === '/';
  const url = `${SITE.origin}${page.path}`;

  const websiteNode = {
    '@type': 'WebSite',
    '@id': `${SITE.origin}/#website`,
    url: `${SITE.origin}/`,
    name: SITE.name,
    description: `${SITE.brandTitle} — ${SITE.brandTagline}`,
    inLanguage: 'it',
    publisher: { '@id': `${SITE.origin}/autore#person` },
  };

  const authorNode = {
    '@type': 'Person',
    '@id': `${SITE.origin}/autore#person`,
    name: SITE.author,
    url: 'https://antoniopedoto.it',
    sameAs: ['https://antoniopedoto.it'],
  };

  const bookNode = {
    '@type': 'Book',
    '@id': `${SITE.origin}/libro#book`,
    name: SITE.brandTitle,
    alternateName: 'Storie fantastiche per crescere sicuri nel CyberMondo',
    bookFormat: 'https://schema.org/Paperback',
    inLanguage: 'it',
    numberOfPages: 159,
    author: { '@id': `${SITE.origin}/autore#person` },
    image: SITE.defaultImage,
    description:
      'Il primo volume delle Avventure di CyberLeo: nove storie illustrate che insegnano la sicurezza digitale ai bambini di 7-10 anni attraverso un leoncino con la criniera di fibre ottiche e i suoi quattro amici.',
    url: `${SITE.origin}/libro`,
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 7, suggestedMaxAge: 10 },
    publisher: { '@type': 'Person', name: SITE.author },
    datePublished: '2026',
  };

  const graph = [websiteNode, authorNode];

  if (page.path === '/libro') {
    graph.push(bookNode);
  } else if (page.type === 'article') {
    graph.push({
      '@type': 'Article',
      headline: page.title,
      description: page.description,
      url,
      image: page.image,
      inLanguage: 'it',
      isPartOf: { '@id': `${SITE.origin}/libro#book` },
      author: { '@id': `${SITE.origin}/autore#person` },
    });
  } else if (page.type === 'profile') {
    graph.push({
      '@type': 'Person',
      name: page.h1,
      description: page.description,
      url,
      image: page.image,
      affiliation: { '@id': `${SITE.origin}/libro#book` },
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function renderPage(page) {
  const url = `${SITE.origin}${page.path}`;
  const ogType = page.type === 'profile' ? 'profile' : page.type === 'article' ? 'article' : page.type === 'book' ? 'book' : 'website';

  return `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/cyberleo-icon.svg" />
    <link rel="apple-touch-icon" href="/cyberleo-icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#FFB800" />

    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <meta name="author" content="${esc(SITE.author)}" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="index, follow" />

    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:image" content="${esc(page.image)}" />
    <meta property="og:image:alt" content="${esc(page.title)}" />
    <meta property="og:site_name" content="${esc(SITE.name)}" />
    <meta property="og:locale" content="it_IT" />
    ${ogType === 'book' || ogType === 'article' ? `<meta property="book:author" content="${esc(SITE.author)}" />` : ''}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${esc(page.image)}" />

    <script type="application/ld+json">
${jsonLdFor(page)}
    </script>
  </head>
  <body style="font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #1f1f1f;">
    <header>
      <h1 style="margin: 0 0 0.5rem; font-size: 2rem;">${esc(page.h1 || page.title)}</h1>
      <p style="color: #555; margin: 0 0 1.5rem;">${esc(page.intro || page.description)}</p>
    </header>
    <main>
      <p>${esc(page.description)}</p>
      <p style="margin-top: 1.5rem;">
        <a href="${url}" rel="canonical">Apri questa pagina su cyberleo.it →</a>
      </p>
    </main>
    <nav style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.9rem;">
      <strong>Altre sezioni del CyberMondo:</strong>
      <ul style="list-style: none; padding: 0; margin: 0.5rem 0; columns: 2;">
        <li><a href="${SITE.origin}/">Home</a></li>
        <li><a href="${SITE.origin}/libro">Il libro</a></li>
        <li><a href="${SITE.origin}/autore">L'autore</a></li>
        <li><a href="${SITE.origin}/anteprime">Anteprime sonore</a></li>
        <li><a href="${SITE.origin}/sei-difese">Le sei difese</a></li>
        <li><a href="${SITE.origin}/personaggi">Personaggi</a></li>
        <li><a href="${SITE.origin}/diploma">Diploma di Custode</a></li>
        <li><a href="${SITE.origin}/genitori">Per i genitori</a></li>
        <li><a href="${SITE.origin}/insegnanti">Per gli insegnanti</a></li>
        <li><a href="${SITE.origin}/glossarietto">Glossarietto</a></li>
      </ul>
    </nav>
    <footer style="margin-top: 2rem; color: #888; font-size: 0.85rem;">
      © ${new Date().getFullYear()} ${esc(SITE.author)} — ${esc(SITE.brandTitle)}
    </footer>
  </body>
</html>
`;
}

function writePage(page) {
  const filePath = page.path === '/'
    ? path.join(OUT, 'index.html')
    : path.join(OUT, page.path.replace(/^\//, ''), 'index.html');

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, renderPage(page), 'utf8');
  return filePath;
}

fs.mkdirSync(OUT, { recursive: true });
let count = 0;
for (const page of PAGES) {
  const fp = writePage(page);
  count++;
  console.log(`[prerender] ${page.path}  →  ${path.relative(OUT, fp)}`);
}
console.log(`\n[prerender] done: ${count} pages in ${OUT}`);
