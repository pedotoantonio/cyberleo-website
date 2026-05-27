# Patch SEO per cyberleo.it — istruzioni di deploy

Questa patch risolve l'invisibilità del sito SPA sui motori di ricerca non-Google e sui
crawler social (Facebook, WhatsApp, Telegram, LinkedIn, Bing, DuckDuckGo, ecc.) **senza
toccare il sorgente React in produzione**. Tutto avviene a livello server (nginx) +
una cartella di HTML pre-renderizzati.

## Cosa fa la patch

1. **42 HTML statici pre-renderizzati** (`frontend/public/prerendered/`) — uno per ogni
   URL della sitemap, con `title`, `meta description`, OG, Twitter card, JSON-LD,
   canonical e contenuto base **specifici per pagina**.
2. **nginx riscritto** (`frontend/nginx.conf`) con:
   - bot detection: se `User-Agent` è di un crawler social/preview → servi il
     prerendered. Altrimenti SPA come prima.
   - gzip esteso (+brotli condizionale)
   - HSTS, CSP, X-Frame, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
   - cache headers raffinati: 1 anno su `/assets/*`, no-cache su HTML/sw/manifest
3. **`index.html` allineato al live** (title/og/JSON-LD aggiornati nel sorgente repo).
4. **`robots.txt` + `sitemap.xml`** nel `public/` (così Vite li copia in `dist/`).

## Cosa NON cambia per gli utenti veri

- Esperienza identica: SPA React come adesso.
- Google continua a ricevere e indicizzare la SPA (Google rende JS bene).
- Solo i bot social/preview vedono l'HTML statico.

## Deploy sul VPS — opzione A (consigliata, applica al dist live esistente)

Da fare **sul VPS** dove gira cyberleo.it. Non serve toccare il sorgente React.

```bash
# 1. Trova dove sta il dist live (esempio):
#    - se gira in container: docker exec <container> ls /usr/share/nginx/html
#    - se gira host nginx: /var/www/cyberleo/ o simile
SITE_ROOT=/var/www/cyberleo   # ← adatta al tuo path

# 2. Copia la cartella prerendered/ generata da questa patch
scp -r prerendered/ utente@vps:$SITE_ROOT/

# 3. Copia robots.txt e sitemap.xml (se non già presenti — il live li ha già)
scp robots.txt sitemap.xml utente@vps:$SITE_ROOT/

# 4. Copia il nuovo nginx.conf e lo snippet security-headers.conf
#    nel posto giusto secondo la tua installazione:

# 4a. Se nginx gira in container Docker:
docker cp nginx.conf <container_cyberleo>:/etc/nginx/conf.d/default.conf
docker cp security-headers.conf <container_cyberleo>:/etc/nginx/conf.d/security-headers.conf
docker exec <container_cyberleo> nginx -t
docker exec <container_cyberleo> nginx -s reload

# 4b. Se nginx gira host:
sudo cp nginx.conf /etc/nginx/sites-available/cyberleo.conf
sudo cp security-headers.conf /etc/nginx/conf.d/security-headers.conf
sudo nginx -t
sudo systemctl reload nginx
```

## Deploy sul VPS — opzione B (rebuild del container con questa patch)

Se preferisci rebuild completo:

```bash
cd /path/del/repo/cyberleo-website   # repo aggiornato con la patch
# Assicurati che frontend/public/prerendered/ esista (è committato)
DOCKER_BUILDKIT=0 docker compose build frontend
docker compose up -d frontend
```

## Test post-deploy

Dopo il reload, da qualsiasi client:

```bash
# 1. Utente normale → deve vedere la SPA shell
curl -sI -A "Mozilla/5.0" https://cyberleo.it/personaggi/lunabyte | head -5
# Cache-Control deve essere "no-cache"

# 2. WhatsApp → deve vedere il prerendered con title specifico
curl -sA "WhatsApp/2.23.20.0" https://cyberleo.it/personaggi/lunabyte | grep '<title>'
# → <title>Lunabyte · Personaggio di CyberLeo</title>

# 3. Facebook → idem
curl -sA "facebookexternalhit/1.1" https://cyberleo.it/anteprime/il-diario-di-miko | grep og:title
# → <meta property="og:title" content="Il diario di Miko · CyberLeo (anteprima)" />

# 4. Telegram
curl -sA "TelegramBot (like TwitterBot)" https://cyberleo.it/sei-difese/doppia-chiave | grep og:description

# 5. Security headers
curl -sI https://cyberleo.it/ | grep -iE "strict-transport|x-frame|content-security|x-content"

# 6. Gzip
curl -sI -H "Accept-Encoding: gzip" https://cyberleo.it/assets/index-*.js | grep -i content-encoding

# 7. Verifica social preview UFFICIALE (rinfresca cache di FB/LinkedIn dopo il deploy):
# Facebook:  https://developers.facebook.com/tools/debug/?q=https://cyberleo.it/personaggi/lunabyte
# Twitter:   https://cards-dev.twitter.com/validator
# LinkedIn:  https://www.linkedin.com/post-inspector/inspect/https://cyberleo.it/personaggi/lunabyte
```

## Rigenerare i 42 prerendered (es. dopo aggiunta nuove storie)

I metadata sono in `tools/seo-pages.mjs`. Modifica lì (titoli, description, og:image),
poi:

```bash
node tools/generate-prerendered.mjs --out frontend/public/prerendered
```

Lo script è idempotente e si lancia anche direttamente sul VPS se vuoi rigenerare in
posto:

```bash
node tools/generate-prerendered.mjs --out /var/www/cyberleo/prerendered
```

## Limiti noti

- **og:image** per i personaggi minori (Lunabyte, Spark, Iride, Nonno Ottavio) punta a
  `/images/heroes/<slug>.jpg`: verifica che il path esista nel `public/images/heroes/`
  del live, altrimenti FB/WA mostrano la cover come fallback (sufficiente, ma meno
  personalizzato).
- I villain (FakeFox, Virus Vex, ShadowGlitch) puntano a `/images/characters/<slug>.jpg`.
- Se aggiungi nuove route al sito, **aggiorna `tools/seo-pages.mjs` E `sitemap.xml`**
  prima di rigenerare.
- Brotli è commentato nel nginx.conf: attivalo solo se il binary di nginx ha il modulo
  (controlla con `nginx -V 2>&1 | grep -o brotli`).
- Bing e Yandex sono in lista bot → ricevono l'HTML statico. Se in futuro vorrai farli
  rendere JS come Google, sposta i loro UA nella whitelist (`= 0`).

## Cosa NON ho fatto (per evitare rischi)

- **Non ho modificato il React** di produzione. Il repo GitHub `cyberleo-website` ha
  una versione molto più vecchia del live (8 route vs 42): non l'ho toccato per non
  rischiare un rollback distruttivo al `git pull`. Quando vuoi allineare il repo al
  live, fammi avere il sorgente vero (tar dal VPS o repo aggiornato).
- **Non ho modificato il backend.** La patch è solo frontend nginx + static files.
