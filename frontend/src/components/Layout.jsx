import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', emoji: '🏠' },
    { name: 'Storie', href: '/storie', emoji: '📚' },
    { name: 'Personaggi', href: '/personaggi', emoji: '🦁' },
    { name: 'Video', href: '/video', emoji: '🎬' },
    { name: 'Genitori', href: '/genitori', emoji: '👨‍👩‍👧‍👦' },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-cyberleo-gold via-cyberleo-orange to-cyberleo-gold shadow-lg">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <span className="text-4xl">🦁</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyberleo-cyan rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white font-display tracking-tight">
                  CyberLeo
                </span>
                <span className="text-xs text-white/80 -mt-1">
                  Avventure Digitali
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isActive(item.href)
                      ? 'bg-white text-cyberleo-orange shadow-lg scale-105'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/20 text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-2xl font-semibold transition-all ${
                    isActive(item.href)
                      ? 'bg-white text-cyberleo-orange'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <span className="mr-2">{item.emoji}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Fiber optic effect bar */}
        <div className="h-1 fiber-glow" />
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-cyberleo-gold via-cyberleo-orange to-cyberleo-gold text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                <span className="text-4xl">🦁</span>
                <span className="text-2xl font-bold font-display">CyberLeo</span>
              </div>
              <p className="text-white/90">
                Impara la sicurezza informatica con le avventure di CyberLeo, il leoncino dalle fibre ottiche!
              </p>
            </div>

            {/* Links */}
            <div className="text-center">
              <h3 className="font-bold text-lg mb-4 font-display">Esplora</h3>
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block hover:underline"
                  >
                    {item.emoji} {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Safety badge */}
            <div className="text-center md:text-right">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Sito sicuro per bambini</span>
              </div>
              <p className="mt-4 text-sm text-white/80">
                Un progetto di <a href="https://antoniopedoto.it" className="underline">antoniopedoto.it</a>
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/30 text-center text-sm text-white/80">
            <p className="mb-2">2024-2026 CyberLeo. Tutti i diritti riservati.</p>
            <Link to="/privacy" className="hover:underline">
              Privacy e Cookie Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
