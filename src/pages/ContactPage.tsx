import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm text-neutral-500 mt-2">
          Have inquiries about platform verification, partnerships, or studio management? We’re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <Mail className="w-5 h-5 text-amber-500" />
            <div className="font-bold text-xs text-neutral-900">Email Support</div>
            <div className="text-xs text-neutral-600">support@creatorflow.lk</div>
            <div className="text-[11px] text-neutral-400">Response within 24 hours</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <Phone className="w-5 h-5 text-amber-500" />
            <div className="font-bold text-xs text-neutral-900">Hotline</div>
            <div className="text-xs text-neutral-600">+94 11 234 5678</div>
            <div className="text-[11px] text-neutral-400">Mon - Fri, 9am - 6pm IST</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            <div className="font-bold text-xs text-neutral-900">Headquarters</div>
            <div className="text-xs text-neutral-600">Colombo 03, Sri Lanka</div>
            <div className="text-[11px] text-neutral-400">Island-wide support network</div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-base text-neutral-900">Message Received</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Thank you for contacting CreatorFlow. Our team will review your inquiry and follow up shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Priyantha Jayawardena"
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="priyantha@domain.lk"
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="How can we assist you?"
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
