import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Eye, Clock, Check, X } from 'lucide-react';

export default function AdminStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('cyberleo_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchStories();
  }, [token, navigate]);

  const fetchStories = () => {
    fetch('/api/admin/stories', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('cyberleo_token');
          navigate('/admin/login');
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setStories(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stories:', err);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/stories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setStories(stories.filter(s => s.id !== id));
        setDeleteId(null);
      }
    } catch (err) {
      console.error('Error deleting story:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold font-display text-gray-800">
                Gestione Storie
              </h1>
              <p className="text-sm text-gray-500">
                {stories.length} storie totali
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-cyberleo-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stories.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 font-semibold text-gray-700">Titolo</th>
                  <th className="text-left p-4 font-semibold text-gray-700 hidden md:table-cell">Data</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Stato</th>
                  <th className="text-right p-4 font-semibold text-gray-700">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story) => (
                  <tr key={story.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {story.image_url ? (
                          <img
                            src={story.image_url}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-cyberleo-warm rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📖</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1">
                            {story.title}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {story.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDate(story.created_at)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        story.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {story.status === 'published' ? (
                          <>
                            <Check className="w-3 h-3" />
                            Pubblicata
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Bozza
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/storie/${story.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-cyberleo-blue transition-colors"
                          title="Visualizza"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => setDeleteId(story.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                          title="Elimina"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl">
            <span className="text-6xl mb-4 block">📚</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Nessuna storia trovata
            </h2>
            <p className="text-gray-600">
              Le storie verranno generate automaticamente dal sistema.
            </p>
          </div>
        )}
      </main>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Elimina Storia
              </h3>
              <p className="text-gray-600 mb-6">
                Sei sicuro di voler eliminare questa storia? Questa azione non può essere annullata.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Elimina
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
