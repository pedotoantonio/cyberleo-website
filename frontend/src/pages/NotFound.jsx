import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sparkle flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative inline-block mb-8">
          <span className="text-[150px] block">🦁</span>
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-cyberleo-gold rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-3xl">❓</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-800 mb-4">
          Ops! Pagina non trovata
        </h1>

        <p className="text-xl text-gray-600 max-w-md mx-auto mb-8">
          CyberLeo ha cercato ovunque ma non riesce a trovare questa pagina.
          Forse si è persa nella Città Digitale!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-cyberleo inline-flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Torna alla Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-cyberleo-blue inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Torna Indietro
          </button>
        </div>
      </div>
    </div>
  );
}
