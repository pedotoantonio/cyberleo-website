import { Link } from 'react-router-dom';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { Cookie, Shield, X } from 'lucide-react';

export default function CookieBanner() {
  const { showBanner, acceptAll, acceptEssential } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40">
      {/* Banner */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-bounce-in">
        {/* Header con CyberLeo */}
        <div className="bg-gradient-to-r from-cyberleo-gold to-cyberleo-orange p-4 text-white">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🦁</span>
            <div>
              <h2 className="text-xl font-bold font-display">Ciao amico!</h2>
              <p className="text-sm text-white/90">CyberLeo ha qualcosa da dirti</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-2xl">
              <Cookie className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Cosa sono i cookie?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                I cookie sono come dei piccoli appunti che il sito web salva sul tuo computer.
                Ci aiutano a ricordare le tue preferenze e a far funzionare il sito meglio!
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-4 flex items-start gap-3">
            <Shield className="w-6 h-6 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm text-green-800 font-medium">
                Tranquillo! CyberLeo usa solo cookie necessari per far funzionare il sito.
                Non condividiamo nulla con nessuno!
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <Link to="/privacy" className="text-cyberleo-orange hover:underline">
              Leggi di più con mamma e papà
            </Link>
          </div>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={acceptEssential}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Solo necessari
          </button>
          <button
            onClick={acceptAll}
            className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyberleo-gold to-cyberleo-orange text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Va bene!
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
