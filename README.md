# 🦁 CyberLeo — Avventure Digitali per Bambini

**CyberLeo.it** è un sito web educativo che insegna la sicurezza informatica ai bambini attraverso storie illustrate, personaggi simpatici e video animati. Il protagonista è **CyberLeo**, un coraggioso leoncino digitale con una criniera luminosa fatta di fibre ottiche, guardiano della Città Digitale.

---

## 📋 Indice

1. [Cos'è il progetto](#-cosè-il-progetto)
2. [Funzionalità principali](#-funzionalità-principali)
3. [I personaggi](#-i-personaggi)
4. [Architettura del sistema](#-architettura-del-sistema)
5. [Tecnologie utilizzate](#-tecnologie-utilizzate)
6. [Struttura del progetto](#-struttura-del-progetto)
7. [Le pagine del sito](#-le-pagine-del-sito)
8. [API del backend](#-api-del-backend)
9. [Lettura vocale e karaoke](#-lettura-vocale-e-karaoke)
10. [Installazione e avvio](#-installazione-e-avvio)
11. [Configurazione](#-configurazione)
12. [Deploy con Docker](#-deploy-con-docker)
13. [Area amministrazione](#-area-amministrazione)
14. [Privacy e cookie](#-privacy-e-cookie)
15. [Sicurezza](#-sicurezza)

---

## 🎯 Cos'è il progetto

CyberLeo è una piattaforma pensata per bambini (e per i loro genitori) con un obiettivo semplice: **imparare a navigare in sicurezza su Internet divertendosi**.

Il sito offre:

- **Storie interattive** in formato "libro illustrato" digitale, con pagine sfogliabili, immagini e audio.
- **Lettura ad alta voce** delle storie, con testo evidenziato parola per parola (effetto karaoke).
- **Personaggi ricorrenti** che rappresentano i concetti della sicurezza informatica (firewall, password, virus, cloud...).
- **Sezione video** con le avventure animate di CyberLeo.
- **Sezione genitori** con consigli pratici sui temi trattati.

I temi educativi coperti includono: password sicure, link sospetti, privacy e dati personali, cyberbullismo, phishing via email, download sicuri, amici online e sconosciuti, tempo davanti allo schermo, backup dei dati, aggiornamenti di sicurezza, WiFi pubblico e giochi online sicuri.

---

## ⭐ Funzionalità principali

| Funzionalità | Descrizione |
|---|---|
| 📖 Storie sfogliabili | Ogni storia è divisa in pagine, con immagini di scena e decorazioni colorate. L'esperienza è a schermo intero, come un vero libro illustrato. |
| 🔊 Lettura vocale | Ogni pagina può essere letta ad alta voce: prima si usano gli audio pre-generati (MP3), altrimenti la Web Speech API del browser come alternativa gratuita. |
| 🎤 Effetto karaoke | Durante la lettura, le parole vengono evidenziate una alla volta, per aiutare i bambini a seguire il testo. |
| 🎚️ Controlli audio | Play, pausa, stop e regolazione della velocità di lettura (da 0.5x a 2x), con velocità predefinita rallentata (0.9x) pensata per i bambini. |
| 🔤 Dimensione testo | Il lettore può ingrandire il testo delle storie per una lettura più comoda. |
| 👨‍👩‍👧 Area genitori | Pagina informativa con l'elenco dei temi di sicurezza trattati e i consigli per gli adulti. |
| 🎬 Video | Elenco dei video pubblicati (integrazione con YouTube tramite ID video). |
| 🔐 Pannello admin | Area riservata protetta da login (JWT) per creare, modificare, pubblicare ed eliminare le storie, con statistiche del sito. |
| 🍪 Cookie banner | Banner di consenso cookie con salvataggio della scelta nel browser (localStorage). |

---

## 🎭 I personaggi

I personaggi sono definiti nel backend (`backend/src/routes/characters.js`) e ognuno rappresenta un concetto di sicurezza informatica:

| Personaggio | Emoji | Ruolo | Concetto rappresentato |
|---|---|---|---|
| **CyberLeo** | 🦁 | Il Protagonista | Guardiano della Città Digitale, insegna la sicurezza |
| **Bitty** | 🐞 | L'Aiutante | I bit e il trasporto delle informazioni |
| **Spammy** | 🦇 | Il Curioso | Lo spam e la curiosità (impara dai suoi errori) |
| **Firewall Fred** | 🐻 | Il Guardiano | Il firewall che blocca i virus alle porte della città |
| **Virus Vic** | 🐛 | Il Dispettoso | I virus informatici (birichino ma non cattivo) |
| **Password Penny** | 🧚 | La Custode | Le password sicure e i segreti |
| **Cloud Clara** | ☁️ | La Custode dei Ricordi | Il cloud, i backup e la conservazione dei dati |
| **Hacker Hugo** | 🐦‍⬛ | Il Furbo | Gli hacker e i punti deboli dei sistemi |

Ogni personaggio ha una descrizione, una personalità, un colore identificativo e delle abilità, oltre a un'immagine in `frontend/public/images/characters/`.

---

## 🏗 Architettura del sistema

Il progetto è diviso in due applicazioni separate che comunicano tramite API REST:

```
                          ┌───────────────────────────┐
  Browser dell'utente ──▶ │  FRONTEND (React + Vite)  │
                          │  servito da Nginx :3001   │
                          └────────────┬──────────────┘
                                       │  /api/* (proxy)
                                       ▼
                          ┌───────────────────────────┐
                          │  BACKEND (Node + Express) │
                          │  porta 8004               │
                          └────────────┬──────────────┘
                                       │
                                       ▼
                          ┌───────────────────────────┐
                          │  PostgreSQL               │
                          │  (database condiviso con  │
                          │   antoniopedoto.it)       │
                          └───────────────────────────┘
```

Punti chiave:

- **Il frontend** è una Single Page Application React, compilata con Vite e servita da Nginx. Nginx inoltra tutte le richieste `/api/*` al backend.
- **Il backend** è un'API REST Express che legge e scrive su PostgreSQL. Le storie di CyberLeo sono articoli del database esistente di antoniopedoto.it, filtrati per **categoria 13** (`CYBERLEO_CATEGORY_ID = 13`).
- **I contenuti multimediali** (immagini di scena, audio MP3, manifest delle pagine) vivono in `frontend/public/uploads/stories/<slug>/` e vengono montati nel container del backend in sola lettura.

### Il file `manifest.json` delle storie

Per ogni storia può esistere un file `manifest.json` nella cartella `uploads/stories/<slug>/`. È la **fonte unica di verità** per la divisione in pagine e contiene, per ogni pagina:

- `page_number` — numero della pagina
- `text` — testo della pagina
- `audio_file` — file audio associato (es. `audio_1.mp3`)
- `image_file` — immagine di scena associata (es. `scene_1.jpg`)

Se il manifest esiste, il backend lo include nella risposta della singola storia (`GET /api/stories/:slug`) insieme al numero totale di pagine.

---

## 🛠 Tecnologie utilizzate

### Frontend

| Tecnologia | Versione | Uso |
|---|---|---|
| React | 18 | Interfaccia utente |
| Vite | 5 | Build e sviluppo |
| React Router | 6 | Navigazione tra pagine |
| Tailwind CSS | 3 | Stili (con palette personalizzata CyberLeo) |
| lucide-react | — | Icone |
| react-markdown | 9 | Rendering del contenuto delle storie |
| date-fns | 4 | Formattazione date |

**Palette colori del brand** (definita in `tailwind.config.js`): oro `#FFB800`, blu `#0099FF`, arancio `#FF6B35`, ciano `#00D4FF`, crema `#FFF8E7`, scuro `#2D2D2D`.
**Font** (Google Fonts): Nunito per i titoli, Quicksand per i testi.

### Backend

| Tecnologia | Versione | Uso |
|---|---|---|
| Node.js | 20 | Runtime (moduli ES) |
| Express | 4 | Server API REST |
| pg | 8 | Connessione a PostgreSQL |
| jsonwebtoken | 9 | Autenticazione admin (JWT, scadenza 24h) |
| bcrypt | 5 | Verifica delle password |
| express-rate-limit | 7 | Limite richieste: 100 ogni 15 minuti |
| cors, dotenv | — | CORS e variabili d'ambiente |

### Infrastruttura

- **Docker + Docker Compose** per il deploy.
- **Nginx** come web server del frontend (gzip, cache degli asset statici per 1 anno, fallback SPA).

---

## 📁 Struttura del progetto

```
cyberleo-website/
├── docker-compose.yml        # Orchestrazione dei due container
├── .gitignore
│
├── frontend/                 # Applicazione React
│   ├── Dockerfile            # Build multi-stage: Node (build) → Nginx (serve)
│   ├── nginx.conf            # Config Nginx: proxy /api, cache, SPA fallback
│   ├── index.html            # Pagina HTML principale (lingua: it)
│   ├── vite.config.js        # Dev server porta 3000, proxy /api → backend:8004
│   ├── tailwind.config.js    # Colori e font del brand CyberLeo
│   ├── public/
│   │   ├── cyberleo-icon.svg # Favicon
│   │   ├── images/
│   │   │   ├── characters/   # Foto dei personaggi (8 immagini)
│   │   │   └── heroes/       # Immagini hero delle sezioni
│   │   └── uploads/          # Contenuti delle storie (non nel repository)
│   │       └── stories/<slug>/
│   │           ├── manifest.json   # Pagine pre-divise della storia
│   │           ├── scene_N.jpg     # Immagini di scena
│   │           └── audio_N.mp3     # Audio pre-generati
│   └── src/
│       ├── main.jsx          # Entry point
│       ├── App.jsx           # Definizione delle rotte
│       ├── index.css         # Stili globali
│       ├── components/
│       │   ├── Layout.jsx        # Header, navigazione e footer
│       │   ├── AudioPlayer.jsx   # Controlli di riproduzione audio
│       │   ├── KaraokeText.jsx   # Testo evidenziato parola per parola
│       │   └── CookieBanner.jsx  # Banner consenso cookie
│       ├── hooks/
│       │   ├── useVoiceReader.js    # Lettura vocale (audio MP3 → Web Speech)
│       │   ├── useVoxtralTTS.js     # Sintesi vocale via API Voxtral (Mistral AI)
│       │   └── useCookieConsent.jsx # Gestione consenso cookie
│       └── pages/
│           ├── Home.jsx          # Homepage con storie in evidenza
│           ├── Stories.jsx       # Elenco storie
│           ├── Story.jsx         # Lettore storia a schermo intero
│           ├── Characters.jsx    # I personaggi
│           ├── Videos.jsx        # I video
│           ├── Parents.jsx       # Sezione genitori
│           ├── Privacy.jsx       # Informativa privacy
│           ├── NotFound.jsx      # Pagina 404
│           └── admin/
│               ├── Login.jsx     # Accesso admin
│               ├── Dashboard.jsx # Statistiche
│               └── Stories.jsx   # Gestione storie
│
└── backend/                  # API REST
    ├── Dockerfile            # Node 20 Alpine
    ├── package.json
    └── src/
        ├── index.js          # Server Express (porta 8004)
        ├── db.js             # Pool di connessioni PostgreSQL
        └── routes/
            ├── stories.js    # Storie pubbliche (con manifest)
            ├── characters.js # Personaggi (dati statici)
            ├── videos.js     # Video pubblicati
            └── admin.js      # Login e gestione contenuti (protetta)
```

---

## 📄 Le pagine del sito

| Percorso | Pagina | Descrizione |
|---|---|---|
| `/` | Home | Presentazione, sezioni principali, storie in evidenza, consigli di sicurezza |
| `/storie` | Storie | Elenco di tutte le storie pubblicate, con paginazione |
| `/storie/:slug` | Storia | Lettore a schermo intero con pagine, immagini, audio e karaoke (fuori dal layout standard) |
| `/personaggi` | Personaggi | Schede di tutti i personaggi |
| `/video` | Video | Elenco dei video pubblicati |
| `/genitori` | Genitori | Informazioni e temi di sicurezza per gli adulti |
| `/privacy` | Privacy | Informativa sulla privacy |
| `/admin/login` | Login admin | Accesso all'area riservata |
| `/admin` | Dashboard | Statistiche: storie totali, pubblicate, video |
| `/admin/stories` | Gestione storie | Creazione, modifica, pubblicazione ed eliminazione |
| `*` | 404 | Pagina non trovata |

---

## 🔌 API del backend

Base URL: `/api` — il backend risponde sulla porta **8004**.

### Endpoint pubblici

| Metodo | Endpoint | Descrizione |
|---|---|---|
| GET | `/api/health` | Stato del servizio |
| GET | `/api/stories` | Elenco storie pubblicate (parametri: `page`, `limit`, default 12 per pagina) |
| GET | `/api/stories/featured` | Le ultime 3 storie pubblicate |
| GET | `/api/stories/:slug` | Singola storia, con le pagine dal `manifest.json` se disponibile |
| GET | `/api/characters` | Tutti i personaggi |
| GET | `/api/characters/:id` | Singolo personaggio |
| GET | `/api/videos` | Elenco video pubblicati (con paginazione; elenco vuoto se la tabella non esiste ancora) |
| GET | `/api/videos/featured` | Gli ultimi 3 video |
| GET | `/api/videos/:id` | Singolo video |

### Endpoint amministrazione (richiedono token JWT)

| Metodo | Endpoint | Descrizione |
|---|---|---|
| POST | `/api/admin/login` | Login: restituisce un token JWT valido 24 ore |
| GET | `/api/admin/stories` | Tutte le storie (anche le bozze) |
| POST | `/api/admin/stories` | Crea una nuova storia |
| PUT | `/api/admin/stories/:id` | Modifica una storia |
| DELETE | `/api/admin/stories/:id` | Elimina una storia |
| GET | `/api/admin/stats` | Statistiche per la dashboard |

Le richieste protette devono includere l'header: `Authorization: Bearer <token>`.

### Note sui dati

- Le storie sono righe della tabella `articles` con `category_id = 13`; solo quelle con `published = true` sono visibili al pubblico.
- Gli URL delle immagini di copertina vengono convertiti automaticamente dal formato `/uploads/articles/cyberleo-*` al formato locale `/uploads/stories/*`.
- I video sono nella tabella `cyberleo_videos` (campi principali: titolo, ID YouTube, percorso file, miniatura, durata); vengono mostrati solo quelli con `upload_status = 'published'`.
- Il login admin usa la tabella `users` esistente del sito antoniopedoto.it (verifica con bcrypt).

---

## 🔊 Lettura vocale e karaoke

Il sistema di lettura ad alta voce funziona per gradi, dal migliore al fallback:

1. **Audio pre-generati** — file MP3 (`audio_N.mp3`) creati in anticipo (Piper TTS / ElevenLabs) e salvati nella cartella della storia. Sono la scelta preferita: qualità alta e nessun costo a runtime.
2. **Voxtral TTS (Mistral AI)** — l'hook `useVoxtralTTS` può generare audio on-demand tramite API (endpoint configurabile con `VITE_VOXTRAL_API_URL`, default `/api/tts`), con cache automatica e supporto al voice cloning della voce di Leo.
3. **Web Speech API** — sintesi vocale del browser come fallback gratuito, con preferenza per le voci italiane (Google italiano, Microsoft Elsa, Alice, Federica).

Durante la riproduzione il componente `KaraokeText` evidenzia la parola corrente, sincronizzata con l'audio (stima di 2,5 parole al secondo quando non ci sono timestamp precisi). La velocità predefinita è **0.9x**, pensata per l'ascolto dei bambini.

---

## 🚀 Installazione e avvio

### Requisiti

- Node.js 20 o superiore
- PostgreSQL raggiungibile (con il database di antoniopedoto.it)
- Docker e Docker Compose (solo per il deploy)

### Sviluppo locale

**1. Backend**

```bash
cd backend
npm install
cp ../.env.example .env   # poi compila i valori reali
npm run dev               # avvia con ricarica automatica sulla porta 8004
```

**2. Frontend**

```bash
cd frontend
npm install
npm run dev               # avvia Vite sulla porta 3000
```

In sviluppo, Vite inoltra automaticamente le chiamate `/api` al backend (vedi `vite.config.js`).

### Build di produzione del frontend

```bash
cd frontend
npm run build             # genera i file statici in frontend/dist
```

---

## ⚙️ Configurazione

Le variabili d'ambiente vanno definite in un file `.env` nella radice del progetto (usato da Docker Compose) o in `backend/.env` per lo sviluppo locale. Vedi `.env.example`:

| Variabile | Obbligatoria | Descrizione |
|---|---|---|
| `DATABASE_URL` | Sì | Stringa di connessione PostgreSQL, es. `postgresql://utente:password@localhost:5432/nomedb` |
| `JWT_SECRET` | Sì (in produzione) | Chiave segreta per firmare i token JWT dell'area admin. **Da cambiare sempre in produzione.** |
| `PORT` | No | Porta del backend (default: `8004`) |
| `VITE_VOXTRAL_API_URL` | No | Endpoint dell'API TTS Voxtral (default: `/api/tts`) |

> ⚠️ Il file `.env` contiene credenziali e **non va mai committato** nel repository (è già escluso da `.gitignore`).

---

## 🐳 Deploy con Docker

Il deploy usa `docker-compose.yml` con due servizi:

| Servizio | Container | Rete | Porta |
|---|---|---|---|
| `frontend` | cyberleo-frontend | bridge | `3001` (host) → `80` (Nginx) |
| `backend` | cyberleo-backend | host | `8004` |

```bash
# Dalla radice del progetto, con il file .env pronto:
docker compose up -d --build
```

Come funziona:

- Il **frontend** viene compilato in un'immagine multi-stage (build con Node, poi servito da Nginx) e pubblicato sulla porta **3001** dell'host.
- Nginx inoltra le richieste `/api/` a `host.docker.internal:8004`, cioè al backend.
- Il **backend** gira in `network_mode: host` per raggiungere il PostgreSQL locale, e monta in sola lettura la cartella `frontend/public/uploads` per leggere i `manifest.json` delle storie.
- Entrambi i container ripartono automaticamente (`restart: unless-stopped`).

Verifica dopo il deploy:

```bash
curl http://localhost:8004/api/health
# → {"status":"ok","service":"cyberleo-api"}
```

---

## 🔑 Area amministrazione

- Accesso da `/admin/login` con le credenziali della tabella `users` (le password sono verificate con bcrypt, mai salvate in chiaro).
- Dopo il login viene emesso un **token JWT valido 24 ore**, da usare in tutte le richieste successive.
- Dalla dashboard si vedono le statistiche (storie totali, pubblicate, video); dalla gestione storie si possono creare, modificare, pubblicare ed eliminare le storie.

---

## 🍪 Privacy e cookie

- Al primo accesso compare un **banner di consenso cookie**; la scelta viene salvata nel browser (chiave `cyberleo_cookie_consent` in localStorage) con la data del consenso.
- La pagina `/privacy` contiene l'informativa completa.
- Il sito è pensato per un pubblico di bambini: non ci sono profilazioni, account utente pubblici o raccolta di dati personali dei piccoli visitatori.

---

## 🛡 Sicurezza

Misure attive nel progetto:

- **Rate limiting**: massimo 100 richieste ogni 15 minuti per client su tutte le API.
- **Autenticazione JWT** con scadenza 24 ore per l'area admin.
- **Password con hash bcrypt** (mai in chiaro).
- **Query parametrizzate** su PostgreSQL (protezione dalle SQL injection).
- **Trust proxy** configurato per il corretto riconoscimento degli IP dietro Nginx.
- **Volume in sola lettura** per i contenuti delle storie montati nel backend.

Raccomandazioni per la produzione:

- Impostare sempre un `JWT_SECRET` robusto e unico (non usare il valore di default).
- Servire il sito tramite HTTPS (reverse proxy con certificato TLS davanti alla porta 3001).
- Mantenere aggiornate le dipendenze npm (`npm audit`).

---

## 📌 Riepilogo rapido

| Cosa | Dove/Come |
|---|---|
| Sito pubblico | Frontend React servito da Nginx sulla porta 3001 |
| API | Express sulla porta 8004, prefisso `/api` |
| Database | PostgreSQL condiviso, storie = `articles` con categoria 13 |
| Contenuti storie | `frontend/public/uploads/stories/<slug>/` (manifest + immagini + audio) |
| Admin | `/admin` con login JWT |
| Deploy | `docker compose up -d --build` dalla radice |
| Dominio | cyberleo.it |
