# ASSOVITA.it — pagina di presentazione e registrazione

Landing page statica del gestionale per associazioni ASSOVITA.it.

- `index.html` — pagina completa, autonoma (CSS e JS inline, solo Google Fonts come risorsa esterna)
- `logo.jpg` — logo completo (usato nel footer)
- `logo-symbol.jpg` — solo il simbolo (usato nell'header)
- `PROMPT.md` — prompt di progettazione con requisiti, palette e struttura

## Pubblicazione

Il workflow `.github/workflows/assovita-pages.yml` pubblica questa cartella su GitHub Pages a ogni push
(indirizzo: https://pedotoantonio.github.io/cyberleo-website/). La cartella può comunque essere servita così com'è
da qualunque web server statico (nginx, Apache, Netlify) o dal dominio assovita.it.

Il modulo di registrazione invia una `POST` JSON all'endpoint definito dalla costante `REGISTER_ENDPOINT`
all'inizio dello script in `index.html` (valore predefinito `/api/register`). Campi inviati:
`associationName, associationType, associationTaxCode, contactName, email, phone, password, privacyAccepted, newsletter`.
Il backend deve rispondere con stato 2xx in caso di successo; in caso di errore può restituire `{ "message": "..." }`
che viene mostrato all'utente.
