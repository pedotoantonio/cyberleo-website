import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Cookie, Lock, Mail, Heart } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyberleo-light to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyberleo-gold to-cyberleo-orange text-white py-8">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Torna alla Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Shield className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">Privacy e Cookie</h1>
              <p className="text-white/90">Come proteggiamo le tue informazioni</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Per i bambini */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🦁</span>
            <h2 className="text-2xl font-bold text-gray-800 font-display">
              Ciao piccolo esploratore!
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            CyberLeo tiene molto alla tua sicurezza! Ecco cosa devi sapere:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <span className="text-gray-700">
                <strong>Non chiediamo il tuo nome</strong> - puoi giocare e leggere le storie senza dirci chi sei!
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🍪</span>
              <span className="text-gray-700">
                <strong>I cookie</strong> sono come piccoli appunti che ci aiutano a ricordare che colore preferisci o dove eri rimasto nella storia.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">👨‍👩‍👧</span>
              <span className="text-gray-700">
                <strong>Chiedi ai tuoi genitori</strong> se hai domande! Possono leggere le informazioni qui sotto.
              </span>
            </li>
          </ul>
        </div>

        {/* Per i genitori */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Informativa per i genitori
            </h2>
          </div>

          <div className="space-y-6 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Titolare del trattamento</h3>
              <p>
                Antonio Pedoto<br />
                Email: antonio.pedoto@gmail.com<br />
                Sito: antoniopedoto.it
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Dati raccolti</h3>
              <p>
                CyberLeo.it non raccoglie dati personali identificativi. Non richiediamo registrazione,
                email, nome o altri dati personali. I bambini possono fruire dei contenuti in completo anonimato.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Cookie utilizzati</h3>
              <p className="mb-2">Utilizziamo esclusivamente cookie tecnici necessari:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Cookie di sessione</strong> - per far funzionare il sito (scadono alla chiusura del browser)</li>
                <li><strong>Cookie di preferenze</strong> - per ricordare tema e lingua (durata: 1 anno)</li>
              </ul>
              <p className="mt-2 text-sm">
                Non utilizziamo cookie di profilazione, tracciamento o marketing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Protezione dei minori</h3>
              <p>
                Questo sito e progettato per essere fruito dai bambini con la supervisione dei genitori.
                Non raccogliamo consapevolmente informazioni personali da minori di 16 anni.
                Se siete genitori e ritenete che vostro figlio ci abbia fornito informazioni personali,
                contattateci per la rimozione immediata.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Diritti degli interessati</h3>
              <p>
                Ai sensi del GDPR (Regolamento UE 2016/679), avete diritto di:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Accesso ai vostri dati personali</li>
                <li>Rettifica dei dati inesatti</li>
                <li>Cancellazione dei dati</li>
                <li>Limitazione del trattamento</li>
                <li>Portabilita dei dati</li>
                <li>Opposizione al trattamento</li>
                <li>Reclamo al Garante per la Protezione dei Dati Personali</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Contatti</h3>
              <p>
                Per qualsiasi domanda sulla privacy, potete contattarci a:
              </p>
              <a
                href="mailto:antonio.pedoto@gmail.com"
                className="inline-flex items-center gap-2 text-cyberleo-orange hover:underline mt-2"
              >
                <Mail className="w-4 h-4" />
                antonio.pedoto@gmail.com
              </a>
            </div>

            <div className="text-sm text-gray-500">
              Ultimo aggiornamento: Aprile 2026
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyberleo-gold to-cyberleo-orange text-white rounded-2xl font-semibold hover:opacity-90 transition-opacity"
          >
            <span className="text-xl">🦁</span>
            Torna alle avventure!
          </Link>
        </div>
      </div>
    </div>
  );
}
