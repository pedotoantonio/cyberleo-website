import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Play, Users, LogOut, Settings, Plus, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('cyberleo_token');
  const username = localStorage.getItem('cyberleo_username');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('cyberleo_token');
          localStorage.removeItem('cyberleo_username');
          navigate('/admin/login');
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setStats(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('cyberleo_token');
    localStorage.removeItem('cyberleo_username');
    navigate('/admin/login');
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦁</span>
            <div>
              <h1 className="text-xl font-bold font-display text-gray-800">
                CyberLeo Admin
              </h1>
              <p className="text-sm text-gray-500">Benvenuto, {username}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-cyberleo-blue transition-colors"
            >
              Vai al sito
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Esci
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-cyberleo-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyberleo-gold/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-cyberleo-orange" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Storie Totali</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalStories}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pubblicate</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.publishedStories}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Video</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalVideos}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="text-xl font-bold font-display text-gray-800 mb-4">
          Azioni Rapide
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/stories"
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 bg-cyberleo-gold/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-cyberleo-orange" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Gestisci Storie</h3>
            <p className="text-sm text-gray-500">
              Visualizza, modifica e pubblica le storie di CyberLeo
            </p>
          </Link>

          <div className="bg-white rounded-2xl p-6 shadow-sm opacity-60">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Play className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Gestisci Video</h3>
            <p className="text-sm text-gray-500">
              Prossimamente disponibile
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm opacity-60">
            <div className="w-12 h-12 bg-cyberleo-blue/20 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-cyberleo-blue" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Personaggi</h3>
            <p className="text-sm text-gray-500">
              I personaggi sono gestiti dal codice
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm opacity-60">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Impostazioni</h3>
            <p className="text-sm text-gray-500">
              Prossimamente disponibile
            </p>
          </div>
        </div>

        {/* Info box */}
        <div className="mt-8 bg-cyberleo-warm border border-cyberleo-gold/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">💡</span>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Suggerimento</h3>
              <p className="text-gray-600">
                Le storie di CyberLeo vengono generate automaticamente dal sistema
                article-generator e pubblicate ogni ora. Puoi comunque modificare
                o aggiungere storie manualmente da questa dashboard.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
