import React, { useState } from 'react';
import { Package, Plus, Trash2, Edit3, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatLKR } from '../../utils/formatters';
import { ServicePackage, PhotographyCategory } from '../../types';

export const StudioPackagesPage: React.FC = () => {
  const { user } = useAuth();
  const photographerId = user?.id || 'photo-1';

  const [packages, setPackages] = useState<ServicePackage[]>(() =>
    dataService.getPackages(photographerId)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PhotographyCategory>('Weddings');
  const [priceLkr, setPriceLkr] = useState(65000);
  const [durationHours, setDurationHours] = useState(6);
  const [deliverables, setDeliverables] = useState('');
  const [includes, setIncludes] = useState('');
  const [isPopular, setIsPopular] = useState(false);

  const openCreateModal = () => {
    setEditingPkgId(null);
    setTitle('');
    setDescription('');
    setCategory('Weddings');
    setPriceLkr(75000);
    setDurationHours(6);
    setDeliverables('300+ Edited High-Res Photos, Online Cloud Gallery, 1 Photo Enlargement');
    setIncludes('1 Lead Photographer, 1 Assistant, Full Ceremony Coverage');
    setIsPopular(false);
    setModalOpen(true);
  };

  const openEditModal = (pkg: ServicePackage) => {
    setEditingPkgId(pkg.id);
    setTitle(pkg.title);
    setDescription(pkg.description);
    setCategory(pkg.category);
    setPriceLkr(pkg.priceLkr);
    setDurationHours(pkg.durationHours);
    setDeliverables(pkg.deliverables.join(', '));
    setIncludes(pkg.includes.join(', '));
    setIsPopular(pkg.isPopular || false);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPkgId) {
      dataService.updatePackage(editingPkgId, {
        title,
        description,
        category,
        priceLkr: Number(priceLkr),
        durationHours: Number(durationHours),
        deliverables: deliverables.split(',').map(d => d.trim()).filter(Boolean),
        includes: includes.split(',').map(i => i.trim()).filter(Boolean),
        isPopular,
      });
    } else {
      dataService.createPackage({
        photographerId,
        title,
        description,
        category,
        priceLkr: Number(priceLkr),
        durationHours: Number(durationHours),
        deliverables: deliverables.split(',').map(d => d.trim()).filter(Boolean),
        includes: includes.split(',').map(i => i.trim()).filter(Boolean),
        isPopular,
        active: true,
      });
    }

    setPackages(dataService.getPackages(photographerId));
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this package?')) {
      dataService.deletePackage(id);
      setPackages(dataService.getPackages(photographerId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Service Packages & Pricing</h1>
          <p className="text-xs text-neutral-500">
            Publish standard and tiered photography packages in LKR for clients to book.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Create New Package</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className={`bg-white rounded-3xl p-6 border flex flex-col justify-between shadow-xs transition-all ${
              pkg.isPopular ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-neutral-200'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700">
                  {pkg.category}
                </span>
                <div className="flex items-center space-x-1">
                  {pkg.isPopular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-neutral-950 uppercase">
                      Popular
                    </span>
                  )}
                  <button
                    onClick={() => openEditModal(pkg)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
                    title="Edit package"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-1.5 text-red-400 hover:text-red-700 rounded-lg hover:bg-red-50"
                    title="Delete package"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-base text-neutral-900">{pkg.title}</h3>
              <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{pkg.description}</p>

              <div className="my-4 pt-3 border-t border-neutral-100">
                <div className="text-2xl font-extrabold text-neutral-900">{formatLKR(pkg.priceLkr)}</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">{pkg.durationHours} Hours Coverage</div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-neutral-800 block mb-1">Includes:</span>
                  <ul className="space-y-1 text-neutral-600">
                    {pkg.includes.map((inc, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-semibold text-neutral-800 block mb-1">Deliverables:</span>
                  <ul className="space-y-1 text-neutral-600">
                    {pkg.deliverables.map((del, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 text-[11px] text-neutral-400 text-center">
              Active & published on marketplace
            </div>
          </div>
        ))}
      </div>

      {/* Package Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-xl text-neutral-900">
              {editingPkgId ? 'Edit Package' : 'Create New Service Package'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Set clear scope and transparent pricing in Sri Lankan Rupees.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gold Grand Wedding Experience"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of who this package is for..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
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
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={priceLkr}
                    onChange={e => setPriceLkr(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Duration (Hours) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    required
                    value={durationHours}
                    onChange={e => setDurationHours(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  What's Included (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="2 Photographers, Full Poruwa Coverage, Studio Lighting Kit"
                  value={includes}
                  onChange={e => setIncludes(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Deliverables (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="500+ Retouched Images, Luxury Album, Highlight Video"
                  value={deliverables}
                  onChange={e => setDeliverables(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="popCheck"
                  checked={isPopular}
                  onChange={e => setIsPopular(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="popCheck" className="text-xs text-neutral-700 font-semibold cursor-pointer">
                  Mark as "Most Popular" on public profile
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                {editingPkgId ? 'Update Package' : 'Save & Publish Package'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
