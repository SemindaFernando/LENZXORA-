import React, { useState } from 'react';
import { Camera, Save, MapPin, Globe, DollarSign, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { PhotographyCategory } from '../../types';

export const StudioProfilePage: React.FC = () => {
  const { user } = useAuth();
  const photographerId = user?.id || 'photo-1';
  const profile = dataService.getPhotographerById(photographerId);

  const [studioName, setStudioName] = useState(profile?.studioName || '');
  const [tagline, setTagline] = useState(profile?.tagline || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || 'Colombo');
  const [serviceAreas, setServiceAreas] = useState(profile?.serviceAreas.join(', ') || '');
  const [startingPriceLkr, setStartingPriceLkr] = useState(profile?.startingPriceLkr || 25000);
  const [experienceYears, setExperienceYears] = useState(profile?.experienceYears || 5);
  const [equipment, setEquipment] = useState(profile?.equipment || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [instagram, setInstagram] = useState(profile?.instagram || '');
  const [coverUrl, setCoverUrl] = useState(profile?.coverUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updatePhotographerProfile(photographerId, {
      studioName,
      tagline,
      bio,
      location,
      serviceAreas: serviceAreas.split(',').map(s => s.trim()).filter(Boolean),
      startingPriceLkr: Number(startingPriceLkr),
      experienceYears: Number(experienceYears),
      equipment,
      website,
      instagram,
      coverUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Edit Studio Profile</h1>
          <p className="text-xs text-neutral-500">
            Keep your public studio details, prices, and locations up to date.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
        {/* Cover Preview & input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Cover Banner Image URL
          </label>
          <input
            type="text"
            value={coverUrl}
            onChange={e => setCoverUrl(e.target.value)}
            className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
          />
          {coverUrl && (
            <div className="mt-2 h-36 rounded-xl overflow-hidden border">
              <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Studio Name *
            </label>
            <input
              type="text"
              required
              value={studioName}
              onChange={e => setStudioName(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Tagline *
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Studio Biography *
          </label>
          <textarea
            rows={4}
            required
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Primary Location *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Starting Price (LKR) *
            </label>
            <input
              type="number"
              step="1000"
              required
              value={startingPriceLkr}
              onChange={e => setStartingPriceLkr(Number(e.target.value))}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Experience (Years) *
            </label>
            <input
              type="number"
              min="1"
              required
              value={experienceYears}
              onChange={e => setExperienceYears(Number(e.target.value))}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Service Areas (comma separated)
          </label>
          <input
            type="text"
            value={serviceAreas}
            onChange={e => setServiceAreas(e.target.value)}
            placeholder="Colombo, Gampaha, Negombo, Galle"
            className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Cameras & Strobe Equipment List
          </label>
          <textarea
            rows={2}
            value={equipment}
            onChange={e => setEquipment(e.target.value)}
            placeholder="Sony A7IV, Canon R6 Mark II, Godox AD600 Pro, DJI RS3..."
            className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Website
            </label>
            <input
              type="text"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://yourstudio.lk"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Instagram Handle
            </label>
            <input
              type="text"
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
              placeholder="@yourstudiogram"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
