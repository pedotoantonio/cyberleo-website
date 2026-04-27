import express from 'express';

const router = express.Router();

// CyberLeo characters - static data
const characters = [
  {
    id: 1,
    name: "CyberLeo",
    emoji: "🦁",
    role: "Il Protagonista",
    description: "Un coraggioso leoncino digitale con una criniera luminosa fatta di fibre ottiche colorate. È il guardiano della Città Digitale e aiuta tutti i bambini a navigare in sicurezza nel mondo di Internet.",
    personality: "Coraggioso, gentile, sempre pronto ad aiutare",
    color: "#FFB800",
    skills: ["Proteggere i dati", "Insegnare la sicurezza", "Fare nuove amicizie"]
  },
  {
    id: 2,
    name: "Bitty",
    emoji: "🐞",
    role: "L'Aiutante",
    description: "Una piccola coccinella rossa che trasporta i bit di informazione. È la migliore amica di CyberLeo e lo aiuta in tutte le sue avventure.",
    personality: "Veloce, precisa, sempre allegra",
    color: "#FF4444",
    skills: ["Trasportare messaggi", "Trovare informazioni", "Risolvere problemi"]
  },
  {
    id: 3,
    name: "Spammy",
    emoji: "🦇",
    role: "Il Curioso",
    description: "Un pipistrello curioso che vola nella notte digitale. Spesso combina guai ma impara sempre dai suoi errori.",
    personality: "Curioso, un po' pasticcione, ma dal cuore buono",
    color: "#9933FF",
    skills: ["Esplorare il buio", "Scoprire segreti", "Imparare dagli errori"]
  },
  {
    id: 4,
    name: "Firewall Fred",
    emoji: "🐻",
    role: "Il Guardiano",
    description: "Un grande orso blu che protegge le porte della Città Digitale. Nessun virus può passare quando Fred è di guardia!",
    personality: "Forte, affidabile, protettivo",
    color: "#0099FF",
    skills: ["Bloccare i virus", "Proteggere le porte", "Controllare chi entra"]
  },
  {
    id: 5,
    name: "Virus Vic",
    emoji: "🐛",
    role: "Il Dispettoso",
    description: "Un piccolo vermetto verde che ama fare scherzi e dispetti. Non è davvero cattivo, solo un po' birichino!",
    personality: "Birichino, divertente, vuole solo giocare",
    color: "#33CC33",
    skills: ["Fare scherzi", "Nascondersi bene", "Creare confusione"]
  },
  {
    id: 6,
    name: "Password Penny",
    emoji: "🧚",
    role: "La Custode",
    description: "Una fatina magica che custodisce tutte le password segrete. Solo chi conosce le parole magiche può entrare nei luoghi protetti.",
    personality: "Saggia, misteriosa, molto attenta",
    color: "#FF66B2",
    skills: ["Creare password sicure", "Proteggere i segreti", "Ricordare tutto"]
  },
  {
    id: 7,
    name: "Cloud Clara",
    emoji: "☁️",
    role: "La Custode dei Ricordi",
    description: "Una soffice nuvoletta bianca che conserva tutti i ricordi digitali: foto, video e documenti importanti.",
    personality: "Soffice, gentile, sempre disponibile",
    color: "#87CEEB",
    skills: ["Conservare ricordi", "Fare backup", "Tenere tutto al sicuro"]
  },
  {
    id: 8,
    name: "Hacker Hugo",
    emoji: "🐦‍⬛",
    role: "Il Furbo",
    description: "Un corvo nero molto intelligente che cerca sempre di entrare dove non dovrebbe. Ma CyberLeo lo tiene d'occhio!",
    personality: "Astuto, intelligente, un po' furbetto",
    color: "#333333",
    skills: ["Risolvere enigmi", "Trovare punti deboli", "Essere molto furbo"]
  }
];

// Get all characters
router.get('/', (req, res) => {
  res.json(characters);
});

// Get single character
router.get('/:id', (req, res) => {
  const character = characters.find(c => c.id === parseInt(req.params.id));
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  res.json(character);
});

export default router;
