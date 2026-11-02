# Prompt — Landing page di presentazione e iscrizione per ASSOVITA.it

## Ruolo

Sei un senior product designer e front-end developer. Devi realizzare la pagina pubblica di presentazione del progetto **ASSOVITA.it**, la piattaforma gestionale online per associazioni (ASD, APS, ODV, associazioni culturali, musicali e sportive). La pagina deve spiegare in modo chiaro cosa fa il sistema, come funziona operativamente e permettere a chi la visita di **registrare la propria associazione** direttamente dal sito.

## Obiettivo della pagina

1. Far capire in 10 secondi a un presidente o segretario di associazione che ASSOVITA gli toglie il lavoro amministrativo ripetitivo (soci, tessere, quote, ricevute, rendiconto).
2. Spiegare le funzionalità operative con esempi concreti, non slogan.
3. Convertire: portare l'utente al modulo di registrazione e fargli completare l'iscrizione.

## Pubblico

Presidenti, segretari, tesorieri e istruttori di piccole e medie associazioni italiane. Poca familiarità con software gestionali, molta con WhatsApp, Excel e carta. Linguaggio: italiano semplice, diretto, senza anglicismi inutili.

## Identità visiva (vincolante)

- **Nome**: scrivere sempre `ASSOVITA.it`. Nel marchio testuale "ASSO" è in teal, "VITA" in arancione, ".it" in blu navy.
- **Logo**: usare il file `logo.jpg` fornito (libro aperto con figure stilizzate che alzano le braccia, sfumatura teal → arancione). Va posizionato in header e nel footer. Non ridisegnarlo e non alterarne i colori.
- **Palette** estratta dal logo:
  - Teal primario `#1088A0`, teal chiaro `#1AAAB3`, acquamarina `#46B2B2`
  - Arancione primario `#FD8E56`, arancione caldo `#FF994F`, pesca `#E59163`
  - Navy `#21608B` (testi forti, ".it")
  - Fondo chiaro `#F4F6F8`, superficie bianca `#FFFFFF`, testo `#1E2A38`
  - Sfumatura di marca: teal → arancione, usata con parsimonia (una sola volta nell'hero o nel CTA finale).
- **Tono**: pulito, accogliente, istituzionale ma vivo. Niente dark pattern, niente countdown, niente finte recensioni.
- **Tipografia**: un display sans geometrico e arrotondato per i titoli (coerente con il lettering del logo), un sans leggibile per il corpo. Caricare da Google Fonts con fallback di sistema.
- Deve essere leggibile anche in tema scuro: definire i colori come token CSS e fornire la variante dark.

## Struttura della pagina (ordine obbligatorio)

1. **Header** sticky: logo, voci "Funzionalità", "Come funziona", "Ruoli", "Prezzi", "Domande", pulsante "Registra la tua associazione".
2. **Hero**: titolo, sottotitolo, due pulsanti (primario "Registra la tua associazione", secondario "Scopri come funziona"), più una **anteprima stilizzata della dashboard** realizzata in HTML/CSS (non immagine): card con numero soci attivi, quote del mese incassate, tessere in scadenza, prossime attività. Usare dati di esempio chiaramente segnati come tali.
3. **Il problema che risolve**: tre situazioni reali (tessere rinnovate a mano, ricevute su carta, rendiconto di fine anno ricostruito da Excel) e come ASSOVITA le risolve.
4. **Funzionalità operative** (griglia di schede, ciascuna con titolo, descrizione di 2–3 righe ed esempio concreto):
   - Anagrafica soci con stato (attivo, sospeso, in attesa di rinnovo), documenti e privacy
   - Tesseramento con numero tessera progressivo automatico e tessera digitale
   - Quote e pagamenti: dovuti mensili o annuali, incasso con registrazione metodo di pagamento, promemoria automatici per i morosi
   - Ricevute numerate in automatico, generate in PDF e inviate via email
   - Corsi, lezioni e attività: calendario, iscrizioni, presenze, compensi istruttori
   - Comunicazioni: email e WhatsApp ai soci con filtri (per corso, per stato, per scadenza)
   - Rendiconto e prima nota: entrate/uscite per centro di costo, export per il commercialista, formato adatto al rendiconto ETS
   - Ruoli e permessi: Amministratore, Segreteria, Tesoriere, Istruttore, Socio
   - Multi-associazione: un solo accesso per chi gestisce più enti
5. **Come funziona in 4 passi** (sequenza reale): 1) Registri l'associazione 2) Importi o inserisci i soci 3) Imposti quote e attività 4) Incassi, emetti ricevute e invii comunicazioni. Mostrare cosa succede in automatico a ogni passo.
6. **Ruoli**: tabella o schede che spiegano cosa vede e cosa può fare ogni ruolo.
7. **Sicurezza e conformità**: dati in Europa, backup giornaliero, accesso con password e autenticazione a due fattori opzionale, GDPR, esportazione dei dati in qualunque momento.
8. **Prezzi**: piano Gratuito (fino a 50 soci, funzioni base), piano Associazione (soci illimitati, ricevute PDF, comunicazioni, rendiconto), piano Rete (multi-associazione, ruoli avanzati, supporto prioritario). Indicare "prezzi indicativi, IVA esclusa" e non inventare cifre precise se non fornite: usare la dicitura "da definire" oppure fasce.
9. **Domande frequenti**: 6 domande reali (serve installare qualcosa? posso importare i soci da Excel? i dati sono miei? funziona da telefono? posso disdire? chi vede i dati?).
10. **Modulo di registrazione** (sezione con ancora `#registrati`):
    - Campi: nome associazione, tipologia (select: ASD, APS, ODV, Culturale, Altro), codice fiscale associazione (opzionale), nome e cognome del referente, email, telefono, password, conferma password, checkbox privacy obbligatoria, checkbox newsletter facoltativa.
    - Validazione lato client con messaggi chiari e in italiano sotto ogni campo.
    - Indicatore di robustezza della password.
    - Invio: `fetch` in POST verso un endpoint configurabile in un unico punto (costante `REGISTER_ENDPOINT`, valore predefinito `/api/register`), con stato di caricamento, messaggio di successo ("Controlla la tua email per confermare l'account") e gestione degli errori di rete.
    - Il submit deve usare `preventDefault()`; nessun `action` sul form.
11. **CTA finale** con la sfumatura di marca.
12. **Footer**: logo, link legali (Privacy, Cookie, Termini), contatti come testo selezionabile, "© 2026 ASSOVITA.it".

## Requisiti tecnici

- Un unico file `index.html` autonomo: CSS e JS inline, nessun framework. Il logo è referenziato come `logo.jpg` nella stessa cartella.
- Il file non deve contenere `<!DOCTYPE>`, `<html>`, `<head>` o `<body>`: inizia con `<title>ASSOVITA.it</title>`, `<meta name="claude:viewport-fit-sides" content="cover">`, i link ai font e lo `<style>`.
- Responsive: perfetto a 400px, 768px e 1280px. Nessuno scroll orizzontale. Gutter laterale `max(16px, env(safe-area-inset-left, 0px))` / `max(16px, env(safe-area-inset-right, 0px))` sui wrapper interni di ogni fascia; padding verticale con `padding-block`.
- Header sticky con `top: env(safe-area-inset-top, 0px)`.
- Token colore su `:root`, ridefiniti per il tema scuro sia sotto `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` sia sotto `:root[data-theme="dark"]`, con `color-scheme: dark`. `body` con background esplicito dal token.
- Accessibilità: contrasto AA, focus visibile, label associate ai campi, `aria-expanded` sulle FAQ, `prefers-reduced-motion` rispettato.
- Tutto il testo visibile deve essere presente al caricamento (nessuna sezione lasciata a `opacity: 0` in attesa di scroll).
- Nessun `alert()`/`confirm()`; i messaggi vanno nella pagina.
- Niente lorem ipsum, niente testimonianze inventate, niente numeri di clienti inventati.

## Criteri di accettazione

- Un presidente di associazione capisce entro la prima schermata cosa fa il sistema e come iscriversi.
- Ogni funzionalità ha un esempio concreto (es. "la ricevuta n. 2026/0147 viene generata e inviata a mario.rossi@…").
- Il modulo si compila e si invia senza errori in console; con endpoint non raggiungibile mostra un messaggio di errore comprensibile.
- La pagina resta leggibile in tema chiaro e scuro.
- Nessun elemento del logo o dei colori di marca viene alterato.
