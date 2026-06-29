// Logo/mascotte CyberLeo come SVG inline: scala in modo nitido a ogni
// dimensione e sostituisce l'emoji 🦁 usata in precedenza come logo.
// La criniera di fibre ottiche (firma del personaggio) si illumina a turno.
export default function Logo({ className = 'w-10 h-10', animated = true }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="CyberLeo"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Criniera di fibre ottiche */}
      <g
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className={animated ? 'cyberleo-mane' : ''}
      >
        <path d="M25 35 Q18 23 30 18" stroke="#0099FF" style={{ animationDelay: '0s' }} />
        <path d="M35 24 Q34 12 46 13" stroke="#00D4FF" style={{ animationDelay: '0.2s' }} />
        <path d="M50 19 Q55 8 62 14" stroke="#FF6B35" style={{ animationDelay: '0.4s' }} />
        <path d="M65 24 Q71 13 77 19" stroke="#7C5CFF" style={{ animationDelay: '0.6s' }} />
        <path d="M76 35 Q88 30 82 41" stroke="#00D4FF" style={{ animationDelay: '0.8s' }} />
      </g>

      {/* Testa */}
      <circle cx="50" cy="52" r="40" fill="#FFB800" />
      <circle cx="50" cy="58" r="27" fill="#FF6B35" />

      {/* Occhi */}
      <circle cx="40" cy="48" r="6" fill="#fff" />
      <circle cx="60" cy="48" r="6" fill="#fff" />
      <circle cx="41" cy="49" r="3" fill="#2D2D2D" />
      <circle cx="61" cy="49" r="3" fill="#2D2D2D" />

      {/* Naso e bocca */}
      <ellipse cx="50" cy="60" rx="5" ry="3.5" fill="#2D2D2D" />
      <path d="M42 67 Q50 74 58 67" stroke="#2D2D2D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
