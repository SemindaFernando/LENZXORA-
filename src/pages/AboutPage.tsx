import React from 'react';
import { Camera, ShieldCheck, Heart, Sparkles, MapPin, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider">
          About CreatorFlow Sri Lanka
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
          Empowering Sri Lanka’s Visual Artists & Clients
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
          CreatorFlow was born to solve two critical problems: helping clients discover trustworthy, verified photographers with transparent LKR pricing, and providing creative studios with a powerful operating system to manage bookings, shoot schedules, editing deadlines, and cash flow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">Tailored for Sri Lanka</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            From Poruwa ceremonies in Kandy and Galle beach destination shoots to commercial hospitality in Colombo, CreatorFlow supports island-wide discovery in Sri Lankan Rupees.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">Transparency & Trust</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            No hidden markups or fake reviews. Verified portfolios, binding quotations, and direct client-photographer messaging keep every agreement crystal clear.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">Studio Operating System</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Photographers manage their calendar, editing workflow stages, customer relationships, and LKR payment settlements in one private, secure workspace.
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 text-white p-8 sm:p-12 rounded-3xl text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to explore or join the platform?</h2>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto">
          Whether you are hosting an unforgettable milestone or running a full-time photo studio, CreatorFlow is built for you.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/photographers"
            className="px-6 py-3 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300"
          >
            Find a Photographer
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-neutral-800 text-white font-bold text-xs hover:bg-neutral-700 border border-neutral-700"
          >
            Join as a Photographer
          </Link>
        </div>
      </div>
    </div>
  );
};
