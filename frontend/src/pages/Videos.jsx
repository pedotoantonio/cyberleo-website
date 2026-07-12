import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, ExternalLink, X } from 'lucide-react';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Format duration in MM:SS
  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Chiudi la modale con il tasto Esc
  useEffect(() => {
    if (!selectedVideo) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedVideo(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedVideo]);

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        setVideos(data.videos || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching videos:', err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-sparkle py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full mb-4">
            <Play className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-cyberleo-orange">CyberLeo TV</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-800 mb-4">
            Video di CyberLeo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Guarda le avventure animate di CyberLeo e impara divertendoti!
          </p>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-16 h-16 border-4 border-cyberleo-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100">
                  {(video.thumbnail_path || video.thumbnail_url) ? (
                    <img
                      src={video.thumbnail_path || video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500">
                      <span className="text-6xl">🎬</span>
                    </div>
                  )}
                  {/* Duration badge */}
                  {video.duration_seconds && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(video.duration_seconds)}
                    </div>
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-cyberleo-orange ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold font-display text-gray-800 mb-2 group-hover:text-cyberleo-orange transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {formatDate(video.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/50 rounded-3xl">
            <span className="text-8xl mb-6 block">🎬</span>
            <h2 className="text-2xl font-bold font-display text-gray-800 mb-4">
              I video stanno arrivando!
            </h2>
            <p className="text-xl text-gray-600 max-w-md mx-auto mb-8">
              CyberLeo sta preparando nuovi video per te. Nel frattempo, leggi le sue storie!
            </p>
            <Link to="/storie" className="btn-cyberleo inline-flex items-center gap-2">
              Leggi le Storie
            </Link>
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={selectedVideo.title}
              className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedVideo(null)}
                aria-label="Chiudi"
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video player - supports both local and YouTube */}
              <div className="aspect-video bg-black">
                {selectedVideo.video_file_path ? (
                  <video
                    src={selectedVideo.video_file_path}
                    controls
                    autoPlay
                    className="w-full h-full"
                  >
                    Il tuo browser non supporta il tag video.
                  </video>
                ) : selectedVideo.youtube_id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?autoplay=1`}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <span className="text-xl">Video non disponibile</span>
                  </div>
                )}
              </div>

              {/* Video info */}
              <div className="p-6">
                <h2 className="text-2xl font-bold font-display text-gray-800 mb-2">
                  {selectedVideo.title}
                </h2>
                {selectedVideo.topic_id && (
                  <p className="text-gray-600 mb-4">
                    Tema: {selectedVideo.topic_id.replace(/_/g, ' ')}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <span>{formatDate(selectedVideo.created_at)}</span>
                    {selectedVideo.duration_seconds && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(selectedVideo.duration_seconds)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {selectedVideo.youtube_id && (
                      <a
                        href={`https://www.youtube.com/watch?v=${selectedVideo.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-cyberleo-blue hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        YouTube
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="px-4 py-2 bg-gray-100 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Chiudi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
