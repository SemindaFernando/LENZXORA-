import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Mail, Phone, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-sm mt-auto border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white">
                <Camera className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                LENZ<span className="text-amber-500">XORA</span>
              </span>
            </Link>
            <p className="text-neutral-400 leading-relaxed text-xs sm:text-sm max-w-sm">
              The dual-sided marketplace and business operating system for Sri Lankan photographers, filmmakers, and clients. Discover talent, compare transparent packages, and manage bookings seamlessly.
            </p>
            <div className="flex flex-col space-y-2 text-xs text-neutral-400 pt-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Colombo • Kandy • Galle • Negombo • Matara • Jaffna</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@lenzxora.lk</span>
              </div>
            </div>
          </div>

          {/* For Clients */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">For Clients</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/photographers" className="hover:text-white transition-colors">
                  Find a Photographer
                </Link>
              </li>
              <li>
                <Link to="/budget-requests" className="hover:text-white transition-colors">
                  Browse Budget Requests
                </Link>
              </li>
              <li>
                <Link to="/budget-requests/new" className="hover:text-white transition-colors">
                  Post a Free Request
                </Link>
              </li>
              <li>
                <Link to="/client" className="hover:text-white transition-colors">
                  Client Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* For Photographers */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">For Photographers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Join as Creator
                </Link>
              </li>
              <li>
                <Link to="/studio" className="hover:text-white transition-colors">
                  Photographer Studio
                </Link>
              </li>
              <li>
                <Link to="/studio/calendar" className="hover:text-white transition-colors">
                  Calendar & Availability
                </Link>
              </li>
              <li>
                <Link to="/studio/editing" className="hover:text-white transition-colors">
                  Editing Kanban Workflow
                </Link>
              </li>
              <li>
                <Link to="/studio/finance" className="hover:text-white transition-colors">
                  LKR Income & Expenses
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/photographers?category=Weddings" className="hover:text-white transition-colors">
                  Weddings & Poruwa
                </Link>
              </li>
              <li>
                <Link to="/photographers?category=Portraits" className="hover:text-white transition-colors">
                  Portraits & Pre-Shoots
                </Link>
              </li>
              <li>
                <Link to="/photographers?category=Birthdays" className="hover:text-white transition-colors">
                  Birthdays & Milestones
                </Link>
              </li>
              <li>
                <Link to="/photographers?category=Events" className="hover:text-white transition-colors">
                  Corporate & Concerts
                </Link>
              </li>
              <li>
                <Link to="/photographers?category=Videography" className="hover:text-white transition-colors">
                  4K Drone & Cinematography
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800/80 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-400 gap-4">
          <div className="flex items-center space-x-1">
            <span>© {new Date().getFullYear()} LENZXORA Sri Lanka. Built for creators.</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <span className="flex items-center text-amber-500">
              <ShieldCheck className="w-4 h-4 mr-1" />
              Verified Escrow & Payment Tracking
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
