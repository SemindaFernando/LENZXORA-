import React, { useState } from 'react';
import { Users, Shield, UserX, UserCheck, Mail } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { formatDate } from '../../utils/formatters';
import { UserProfile } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(() => dataService.getUsers());

  const handleRoleChange = (userId: string, newRole: UserProfile['role']) => {
    dataService.updateUserRole(userId, newRole);
    setUsers(dataService.getUsers());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Platform Users Directory</h1>
        <p className="text-xs text-neutral-400">
          Manage authenticated clients, photographers, and platform moderators.
        </p>
      </div>

      <div className="bg-neutral-950 rounded-3xl border border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-neutral-900/40">
                  <td className="p-4 flex items-center space-x-3">
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'}
                      alt={u.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-white">{u.fullName}</div>
                      <div className="text-[11px] text-neutral-400">{u.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'admin'
                        ? 'bg-purple-900/60 text-purple-300 border border-purple-700'
                        : u.role === 'photographer'
                        ? 'bg-amber-900/50 text-amber-300 border border-amber-700'
                        : 'bg-blue-900/50 text-blue-300 border border-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-400">{u.phone || 'N/A'}</td>
                  <td className="p-4 text-neutral-400">{formatDate(u.createdAt)}</td>
                  <td className="p-4 text-right">
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value as any)}
                      className="p-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white outline-none"
                    >
                      <option value="client">Client</option>
                      <option value="photographer">Photographer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
