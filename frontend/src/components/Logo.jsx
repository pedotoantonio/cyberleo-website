// Logo/mascotte CyberLeo: usa il ritaglio circolare del personaggio reale
// (lo stesso delle illustrazioni del libro) così l'icona del brand combacia
// con CyberLeo come appare nelle storie.
export default function Logo({ className = 'w-10 h-10' }) {
  return (
    <img
      src="/images/avatars/cyberleo_head.png"
      alt="CyberLeo"
      className={`${className} object-contain`}
      width="512"
      height="512"
    />
  );
}
