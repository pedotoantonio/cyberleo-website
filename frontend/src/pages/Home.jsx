import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Play, Shield, Sparkles, ChevronRight, Star } from 'lucide-react';

export default function Home() {
  const [featuredStories, setFeaturedStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stories/featured')
      .then(res => res.json())
      .then(data => {
        setFeaturedStories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stories:', err);
        setLoading(false);
      });
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: 'Storie Divertenti',
      description: 'Avventure emozionanti nella Città Digitale con CyberLeo e i suoi amici!',
      color: 'from-cyberleo-gold to-cyberleo-orange',
      link: '/storie',
      image: '/images/heroes/cookie-privacy.jpg'
    },
    {
      icon: Users,
      title: 'Personaggi Simpatici',
      description: 'Conosci CyberLeo, Bitty, Firewall Fred e tutti gli altri!',
      color: 'from-cyberleo-blue to-cyberleo-cyan',
      link: '/personaggi',
      image: '/images/heroes/amici-online.jpg'
    },
    {
      icon: Shield,
      title: 'Impara Giocando',
      description: 'Scopri come navigare in sicurezza e proteggere i tuoi dati!',
      color: 'from-cyberleo-green to-emerald-500',
      link: '/storie',
      image: '/images/heroes/firewall-fred.jpg'
    },
    {
      icon: Play,
      title: 'Video Animati',
      description: 'Guarda i video delle avventure di CyberLeo!',
      color: 'from-cyberleo-purple to-cyberleo-pink',
      link: '/video',
      image: '/images/heroes/identita-digitale.jpg'
    }
  ];

  const safetyTips = [
    { emoji: '🔐', tip: 'Usa password forti e segrete' },
    { emoji: '🚫', tip: 'Non cliccare link sospetti' },
    { emoji: '🤫', tip: 'Non condividere dati personali' },
    { emoji: '👨‍👩‍👧', tip: 'Chiedi sempre ai genitori' }
  ];

  // Function to get the correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // If it's a relative path starting with /uploads, prepend the antoniopedoto.it domain
    if (imageUrl.startsWith('/uploads/')) {
      return `https://antoniopedoto.it${imageUrl}`;
    }
    return imageUrl;
  };

  return (
    <div className="bg-sparkle overflow-hidden">
      {/* Hero Section with Real Image */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/heroes/cyberleo-hero.jpg"
            alt="CyberLeo Hero"
            className="w-full h-full object-cover"
          />
          {/* Overlay brand-tinted per leggibilità (al posto del nero puro) */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyberleo-dark/85 via-cyberleo-dark/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyberleo-warm via-transparent to-cyberleo-blue/15" />
        </div>

        {/* Motivo a fibre ottiche (firma del brand) */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none h-2/3">
          <svg className="w-full h-full" viewBox="0 0 1440 480" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" strokeWidth="3" strokeLinecap="round" className="cyberleo-mane">
              <path d="M120 480 C 160 320 60 240 180 90" stroke="#FFB800" opacity="0.55" style={{ animationDelay: '0s' }} />
              <path d="M340 480 C 300 340 420 260 320 120" stroke="#00D4FF" opacity="0.5" style={{ animationDelay: '0.3s' }} />
              <path d="M560 480 C 600 320 520 220 640 110" stroke="#0099FF" opacity="0.5" style={{ animationDelay: '0.6s' }} />
              <path d="M820 480 C 780 330 900 250 800 130" stroke="#FF6B35" opacity="0.5" style={{ animationDelay: '0.9s' }} />
              <path d="M1080 480 C 1120 320 1020 230 1160 100" stroke="#7C5CFF" opacity="0.45" style={{ animationDelay: '1.2s' }} />
              <path d="M1300 480 C 1260 340 1360 260 1280 140" stroke="#00D4FF" opacity="0.45" style={{ animationDelay: '1.5s' }} />
            </g>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full mb-6 shadow-lg">
              <Sparkles className="w-5 h-5 text-cyberleo-gold animate-pulse" />
              <span className="font-semibold text-cyberleo-orange">Nuove avventure ogni giorno!</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-6 drop-shadow-lg">
              Benvenuto nelle{' '}
              <span className="bg-gradient-to-r from-cyberleo-gold via-cyberleo-orange to-cyberleo-gold bg-clip-text text-transparent">
                Avventure Digitali
              </span>{' '}
              di CyberLeo!
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow">
              Unisciti a CyberLeo, il coraggioso leoncino con la criniera di fibre ottiche,
              e scopri come navigare in sicurezza nel mondo digitale!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/storie" className="btn-cyberleo inline-flex items-center justify-center gap-2 text-lg px-8 py-4">
                <BookOpen className="w-6 h-6" />
                Leggi le Storie
              </Link>
              <Link to="/personaggi" className="btn-cyberleo-blue inline-flex items-center justify-center gap-2 text-lg px-8 py-4">
                <Users className="w-6 h-6" />
                Conosci i Personaggi
              </Link>
            </div>

            {/* Safety Tips Pills */}
            <div className="mt-10 flex flex-wrap gap-3">
              {safetyTips.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform cursor-default"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">{item.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section with Images */}
      <section className="py-20 bg-gradient-to-b from-cyberleo-warm to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-gray-800 mb-4">
              Cosa troverai su CyberLeo
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un mondo di avventure per imparare la sicurezza informatica divertendosi!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image background */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-60 group-hover:opacity-40 transition-opacity`} />
                  <div className={`absolute top-4 left-4 w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold font-display text-gray-800 mb-2 group-hover:text-cyberleo-orange transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-cyberleo-orange font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Scopri di più <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold font-display text-gray-800">
                Ultime Storie
              </h2>
              <p className="text-gray-600 mt-2">Le avventure più recenti di CyberLeo</p>
            </div>
            <Link to="/storie" className="flex items-center gap-2 bg-cyberleo-gold/10 text-cyberleo-orange font-semibold px-6 py-3 rounded-full hover:bg-cyberleo-gold/20 transition-colors">
              Vedi tutte <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-20 h-20 border-4 border-cyberleo-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : featuredStories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredStories.map((story, index) => (
                <Link
                  key={story.id}
                  to={`/storie/${story.slug}`}
                  className={`story-card group ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <div className="relative h-56 bg-gradient-to-br from-cyberleo-warm to-cyberleo-gold/20 overflow-hidden">
                    {story.image_url ? (
                      <img
                        src={getImageUrl(story.image_url)}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyberleo-gold to-cyberleo-orange">
                        <span className="text-8xl">🦁</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* New badge for first story */}
                    {index === 0 && (
                      <div className="absolute top-4 right-4 bg-cyberleo-orange text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Star className="w-4 h-4" fill="currentColor" /> Nuova!
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-display text-gray-800 mb-3 group-hover:text-cyberleo-orange transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {story.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-cyberleo-orange font-semibold">
                      Leggi la storia <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-cyberleo-warm/50 rounded-3xl">
              <span className="text-8xl mb-6 block">📚</span>
              <h3 className="text-2xl font-bold font-display text-gray-800 mb-2">Le storie stanno arrivando!</h3>
              <p className="text-xl text-gray-600">Torna presto per leggere le avventure di CyberLeo.</p>
            </div>
          )}
        </div>
      </section>

      {/* Characters Preview Section */}
      <section className="py-20 bg-gradient-to-br from-cyberleo-blue via-cyberleo-cyan to-cyberleo-blue relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
              I Protagonisti
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Incontra gli eroi che proteggono la Città Digitale!
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { img: '/images/avatars/cyberleo.png', name: 'CyberLeo', ring: 'ring-cyberleo-gold' },
              { img: '/images/avatars/bitty.png', name: 'Bitty', ring: 'ring-red-400' },
              { img: '/images/avatars/firewall_fred.png', name: 'Firewall Fred', ring: 'ring-blue-500' },
              { img: '/images/avatars/password_penny.png', name: 'Password Penny', ring: 'ring-pink-400' },
              { img: '/images/avatars/cloud_clara.png', name: 'Cloud Clara', ring: 'ring-sky-300' },
              { img: '/images/avatars/spammy.png', name: 'Spammy', ring: 'ring-purple-400' },
            ].map((char, i) => (
              <Link
                to="/personaggi"
                key={i}
                className="group flex flex-col items-center"
              >
                <div className={`w-24 h-24 rounded-full bg-white shadow-xl ring-4 ${char.ring} overflow-hidden group-hover:scale-110 transition-transform`}>
                  <img
                    src={char.img}
                    alt={char.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="mt-2 text-white font-semibold text-sm">{char.name}</span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/personaggi" className="inline-flex items-center gap-2 bg-white text-cyberleo-blue px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
              Scopri tutti i personaggi
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section with Background Image */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/heroes/password-penny.jpg"
            alt="CyberLeo Adventure"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyberleo-orange/90 to-cyberleo-gold/90" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            Pronto per l'avventura?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Unisciti a CyberLeo e ai suoi amici per imparare a navigare in sicurezza nel mondo digitale!
          </p>
          <Link to="/storie" className="inline-flex items-center gap-3 bg-white text-cyberleo-orange px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 transition-transform">
            Inizia a Leggere <ChevronRight className="w-7 h-7" />
          </Link>
        </div>
      </section>
    </div>
  );
}
