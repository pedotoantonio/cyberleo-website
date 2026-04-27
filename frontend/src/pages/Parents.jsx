import { Shield, BookOpen, Users, Mail, ExternalLink, Check } from 'lucide-react';

export default function Parents() {
  const safetyTopics = [
    "Password sicure e segrete",
    "Come riconoscere link sospetti",
    "Privacy e dati personali",
    "Cyberbullismo e come difendersi",
    "Download sicuri",
    "Email phishing",
    "Amici online e sconosciuti",
    "Tempo davanti allo schermo",
    "Backup dei dati",
    "Aggiornamenti di sicurezza",
    "WiFi pubblico",
    "Giochi online sicuri"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyberleo-blue to-cyberleo-cyan text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Informazioni per Genitori</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Benvenuti Genitori!
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              CyberLeo è un progetto educativo che insegna ai bambini la sicurezza informatica
              attraverso storie divertenti e personaggi simpatici. Scoprite come funziona e
              come potete accompagnare i vostri figli in questa avventura digitale.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold font-display text-gray-800 mb-6">
                  Chi è CyberLeo?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  CyberLeo è un coraggioso leoncino digitale con una criniera speciale fatta di
                  fibre ottiche luminose. Vive nella Città Digitale insieme ai suoi amici e
                  protegge tutti i bambini dai pericoli del mondo online.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Attraverso storie avvincenti e personaggi memorabili, CyberLeo insegna ai
                  bambini concetti importanti sulla sicurezza informatica in modo semplice,
                  divertente e mai spaventoso.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Ogni storia affronta un tema diverso, dalla creazione di password sicure
                  al riconoscimento di email sospette, sempre con un approccio positivo e
                  rassicurante.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-cyberleo-gold to-cyberleo-orange rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-[140px]">🦁</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
                Cosa impareranno i vostri figli
              </h2>
              <p className="text-xl text-gray-600">
                CyberLeo affronta i temi più importanti della sicurezza online per bambini
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {safetyTopics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to use Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-gray-800 mb-8 text-center">
              Come utilizzare CyberLeo
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-cyberleo-gold/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-cyberleo-orange" />
                </div>
                <h3 className="font-bold font-display text-gray-800 mb-2">
                  1. Leggete insieme
                </h3>
                <p className="text-gray-600">
                  Leggete le storie insieme ai vostri figli. Questo vi permetterà di
                  discutere i temi trattati e rispondere alle loro domande.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-cyberleo-blue/20 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-cyberleo-blue" />
                </div>
                <h3 className="font-bold font-display text-gray-800 mb-2">
                  2. Discutete i temi
                </h3>
                <p className="text-gray-600">
                  Ogni storia contiene una sezione "Ricorda!" con i punti chiave.
                  Usatela per aprire una discussione con i vostri figli.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold font-display text-gray-800 mb-2">
                  3. Applicate nella vita reale
                </h3>
                <p className="text-gray-600">
                  Aiutate i vostri figli ad applicare ciò che hanno imparato quando
                  usano dispositivi digitali nella vita quotidiana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="py-16 bg-gradient-to-r from-cyberleo-gold/10 to-cyberleo-orange/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
              Un ambiente sicuro per i bambini
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              CyberLeo.it è progettato per essere un ambiente completamente sicuro:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Nessuna pubblicità o contenuto sponsorizzato</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Nessun tracciamento o raccolta dati dei minori</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Contenuti sempre appropriati per l'età</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Nessun link esterno non sicuro</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
              Domande o Suggerimenti?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Siamo sempre felici di ricevere feedback dai genitori.
              CyberLeo è un progetto di antoniopedoto.it
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@antoniopedoto.it"
                className="btn-cyberleo-blue inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Contattaci
              </a>
              <a
                href="https://antoniopedoto.it"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyberleo inline-flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Visita antoniopedoto.it
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
