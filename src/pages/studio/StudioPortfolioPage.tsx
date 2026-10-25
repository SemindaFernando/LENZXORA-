import React, { useState } from 'react';
import { Plus, Trash2, Image, Sparkles, ExternalLink, X, MoveUp, MoveDown } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { PortfolioItem, PhotographyCategory } from '../../types';

export const StudioPortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const photographerId = user?.id || 'photo-1';

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() =>
    dataService.getPortfolio(photographerId)
  );

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PhotographyCategory>('Weddings');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const sampleImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = dataService.addPortfolioItem({
      photographerId,
      title,
      category,
      mediaType,
      url: url || sampleImages[Math.floor(Math.random() * sampleImages.length)],
      description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      displayOrder: portfolio.length + 1,
    });

    setPortfolio(dataService.getPortfolio(photographerId));
    setAddModalOpen(false);
    setTitle('');
    setUrl('');
    setDescription('');
    setTags('');
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio photo?')) {
      dataService.deletePortfolioItem(id);
      setPortfolio(dataService.getPortfolio(photographerId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Portfolio Gallery Manager</h1>
          <p className="text-xs text-neutral-500">
            Showcase your best visual work to prospective clients browsing the Sri Lanka marketplace.
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Upload New Work</span>
        </button>
      </div>

      {portfolio.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-neutral-300 p-12 text-center space-y-3">
          <Image className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="font-bold text-sm text-neutral-800">Your portfolio is currently empty</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Upload high-resolution photographs or video links to start attracting clients.
          </p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
          >
            Add First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="absolute top-3 right-3 p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-700 shadow-sm"
                  title="Delete item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-neutral-900/80 backdrop-blur-xs text-white rounded text-[10px] font-bold uppercase tracking-wider">
                  {item.category}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{item.description}</p>
                  )}
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {item.tags.map(t => (
                      <span key={t} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-neutral-900">Add Portfolio Item</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Publish image to your public showcase. Supports Supabase Storage uploads & direct URLs.
            </p>

            <form onSubmit={handleAddItem} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset Ceremony at Galle Fort"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Weddings">Weddings</option>
                    <option value="Portraits">Portraits</option>
                    <option value="Birthdays">Birthdays</option>
                    <option value="Events">Events</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Videography">Videography</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Media Type
                  </label>
                  <select
                    value={mediaType}
                    onChange={e => setMediaType(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="image">High-Res Image</option>
                    <option value="video">Cinematic Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Image URL / Storage Reference
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or paste image URL"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Leave blank to auto-assign a high-resolution sample image.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief note on camera gear, location, or atmosphere..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Poruwa, Sunset, Candid, Colombo"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Publish to Studio Portfolio
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
