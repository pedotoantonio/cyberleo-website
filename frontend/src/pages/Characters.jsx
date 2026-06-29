import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Sparkles, X, Shield, Star, Heart } from 'lucide-react';

// Immagini dei personaggi - generate con AI per consistenza visiva
const characterImages = {
  'CyberLeo': '/images/characters/cyberleo.jpg',
  'Password Penny': '/images/characters/password_penny.jpg',
  'Firewall Fred': '/images/characters/firewall_fred.jpg',
  'Bitty': '/images/characters/bitty.jpg',
  'Cloud Clara': '/images/characters/cloud_clara.jpg',
  'Spammy': '/images/characters/spammy.jpg',
  'Virus Vic': '/images/characters/virus_vic.jpg',
  'Hacker Hugo': '/images/characters/hacker_hugo.jpg',
};

// Colori per sfondo gradient
const characterGradients = {
  'CyberLeo': 'from-amber-400 to-orange-500',
  'Password Penny': 'from-pink-400 to-purple-500',
  'Firewall Fred': 'from-blue-400 to-indigo-500',
  'Bitty': 'from-red-400 to-pink-500',
  'Cloud Clara': 'from-cyan-400 to-blue-500',
  'Spammy': 'from-purple-400 to-indigo-500',
  'Virus Vic': 'from-green-400 to-emerald-500',
  'Hacker Hugo': 'from-gray-600 to-gray-800',
};

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/characters')
      .then(res => res.json())
      .then(data => {
        setCharacters(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching characters:', err);
        setLoading(false);
      });
  }, []);

  // Chiudi la modale con il tasto Esc
  useEffect(() => {
    if (!selectedCharacter) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedCharacter(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedCharacter]);

  const getCharacterImage = (name) => {
    return characterImages[name] || '/images/heroes/cyberleo-hero.jpg';
  };

  const getGradient = (name) => {
    return characterGradients[name] || 'from-cyberleo-gold to-cyberleo-orange';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/heroes/cyberleo-hero.jpg)',
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-amber-50" />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyberleo-gold rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full mb-6 shadow-lg">
            <Users className="w-6 h-6 text-cyberleo-blue" />
            <span className="font-bold text-cyberleo-orange text-lg">I Nostri Eroi</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-4 drop-shadow-lg">
            I Personaggi di CyberLeo
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-3xl drop-shadow-md">
            Scopri tutti gli amici che aiutano CyberLeo a proteggere la Città Digitale!
          </p>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V100H0V50Z"
              className="fill-amber-50"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Intro Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-cyberleo-gold/20">
              <Shield className="w-10 h-10 text-cyberleo-blue mx-auto mb-3" />
              <h3 className="font-bold text-gray-800">Protezione</h3>
              <p className="text-sm text-gray-600">Difendono la sicurezza</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-cyberleo-gold/20">
              <Star className="w-10 h-10 text-cyberleo-gold mx-auto mb-3" />
              <h3 className="font-bold text-gray-800">Avventura</h3>
              <p className="text-sm text-gray-600">Vivono storie emozionanti</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-cyberleo-gold/20">
              <Heart className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800">Amicizia</h3>
              <p className="text-sm text-gray-600">Insieme sono più forti</p>
            </div>
          </div>
        </div>

        {/* Characters Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 border-4 border-cyberleo-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600 font-semibold">Caricamento personaggi...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {characters.map((character, index) => (
              <div
                key={character.id}
                onClick={() => setSelectedCharacter(character)}
                className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  {/* Character Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getCharacterImage(character.name)}
                      alt={character.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${getGradient(character.name)} opacity-40`} />

                    {/* Emoji badge */}
                    <div
                      className="absolute bottom-4 right-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
                      style={{ backgroundColor: character.color || '#FFB800' }}
                    >
                      <span className="text-3xl">{character.emoji}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-display text-gray-800 mb-1">
                      {character.name}
                    </h3>
                    <p
                      className="text-sm font-bold mb-3 uppercase tracking-wide"
                      style={{ color: character.color || '#0099FF' }}
                    >
                      {character.role}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {character.description}
                    </p>

                    {/* Skills preview */}
                    <div className="flex flex-wrap gap-1">
                      {character.skills?.slice(0, 2).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: (character.color || '#FFB800') + '20',
                            color: character.color || '#FFB800'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 flex items-center justify-center gap-2 text-cyberleo-blue font-bold group-hover:text-cyberleo-orange transition-colors">
                      <Sparkles className="w-5 h-5" />
                      <span>Scopri di più</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 relative overflow-hidden rounded-3xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/heroes/identita-digitale.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyberleo-blue/90 to-cyberleo-cyan/80" />

          <div className="relative z-10 p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Vuoi conoscere le loro avventure?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Leggi tutte le storie di CyberLeo e dei suoi amici nella sezione Storie!
            </p>
            <Link
              to="/storie"
              className="inline-flex items-center gap-3 bg-white text-cyberleo-blue px-8 py-4 rounded-full font-bold text-lg hover:bg-cyberleo-gold hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-6 h-6" />
              Leggi le Storie
            </Link>
          </div>
        </div>
      </div>

      {/* Character Modal */}
      {selectedCharacter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedCharacter(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedCharacter.name}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header with image */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={getCharacterImage(selectedCharacter.name)}
                alt={selectedCharacter.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${getGradient(selectedCharacter.name)} opacity-50`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <button
                onClick={() => setSelectedCharacter(null)}
                aria-label="Chiudi"
                className="absolute top-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              {/* Character info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-4 border-white"
                    style={{ backgroundColor: selectedCharacter.color || '#FFB800' }}
                  >
                    <span className="text-4xl">{selectedCharacter.emoji}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold font-display drop-shadow-lg">
                      {selectedCharacter.name}
                    </h2>
                    <p className="text-lg font-semibold opacity-90">
                      {selectedCharacter.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal content */}
            <div className="p-8 overflow-y-auto max-h-[50vh]">
              <div className="mb-6">
                <h3 className="font-bold font-display text-gray-800 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-cyberleo-gold" />
                  Chi sono
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {selectedCharacter.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold font-display text-gray-800 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Personalità
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedCharacter.personality}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold font-display text-gray-800 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyberleo-blue" />
                  Le mie abilità
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCharacter.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-bold shadow-sm"
                      style={{
                        backgroundColor: (selectedCharacter.color || '#FFB800') + '20',
                        color: selectedCharacter.color || '#FFB800'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedCharacter(null)}
                className="w-full mt-4 bg-gradient-to-r from-cyberleo-gold to-cyberleo-orange text-white py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
