import React, { useState } from 'react';
import { Users, Plus, Phone, Mail, MapPin, DollarSign, Calendar, Edit3, X, Save } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatLKR, formatDate } from '../../utils/formatters';
import { ClientRecord } from '../../types';

export const StudioClientsPage: React.FC = () => {
  const { user } = useAuth();
  const photographerId = user?.id || 'photo-1';

  const [clients, setClients] = useState<ClientRecord[]>(() =>
    dataService.getClients(photographerId)
  );

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.addClientRecord({
      photographerId,
      name,
      email,
      phone,
      address,
      notes,
      pastBookingsCount: 0,
      upcomingBookingsCount: 1,
      totalSpentLkr: 0,
    });
    setClients(dataService.getClients(photographerId));
    setAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setNotes('');
  };

  const handleUpdateNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    dataService.updateClientRecord(editingClient.id, { notes: editingClient.notes });
    setClients(dataService.getClients(photographerId));
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Private Client Directory (CRM)</h1>
          <p className="text-xs text-neutral-500">
            Maintain private shoot preferences, communication notes, and client lifetime revenue in LKR.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add Client Record</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div
            key={client.id}
            className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 font-bold text-sm flex items-center justify-center border border-amber-200">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">{client.name}</h3>
                    <span className="text-[11px] text-neutral-400">Client since {formatDate(client.createdAt)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setEditingClient(client)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
                  title="Edit private notes"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                {client.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{client.address}</span>
                  </div>
                )}
              </div>

              {/* Private Notes Card */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Private Studio Notes
                </div>
                <p className="text-neutral-700 italic line-clamp-3 leading-relaxed">
                  {client.notes || 'No private notes yet.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-neutral-400 block">Total Spent</span>
                <span className="font-extrabold text-neutral-900">{formatLKR(client.totalSpentLkr)}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-neutral-400 block">Bookings</span>
                <span className="font-bold text-neutral-700">
                  {client.upcomingBookingsCount} upcoming / {client.pastBookingsCount} past
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Notes Modal */}
      {editingClient && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <button
              onClick={() => setEditingClient(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-neutral-900">Edit Private Client Notes</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              These notes are visible strictly to your studio and never shared with the client.
            </p>

            <form onSubmit={handleUpdateNotes} className="mt-4 space-y-4">
              <textarea
                rows={5}
                value={editingClient.notes || ''}
                onChange={e => setEditingClient({ ...editingClient, notes: e.target.value })}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold"
              >
                Save Private Notes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-neutral-900">Add Client Record</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Store client contact info and custom shoot notes in your private database.
            </p>

            <form onSubmit={handleAddClient} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Malith Weerakoon"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+94 77 123 4567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="malith@example.lk"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Location / Address</label>
                <input
                  type="text"
                  placeholder="Colombo 04"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Private Notes</label>
                <textarea
                  rows={3}
                  placeholder="Preferences, aesthetic choices, family relations..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Save Client Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
