# deploy-assets

Contenuto statico caricato **così com'è** nella root del sito live cyberleo.it
dal workflow `.github/workflows/deploy-assets.yml` (via rsync/SSH).

La struttura di cartelle qui dentro rispecchia la root del sito:

```
images/logo-cyberleo.png     -> /images/logo-cyberleo.png   (logo header, prima mancante/404)
favicon.ico, favicon-*.png   -> /favicon.*                  (favicon, prima mancanti/404)
images/book/cover.jpg        -> /images/book/cover.jpg       (watermark Gemini rimosso)
images/book/storia-1..9.jpeg -> /images/book/storia-*.jpeg   (watermark Gemini rimosso)
```

Per aggiungere/aggiornare un asset del sito: metti il file qui nel percorso
corretto (relativo alla root del sito) e fai push — il workflow lo pubblica.
Il deploy **non cancella** file esistenti sul server (rsync senza `--delete`).
