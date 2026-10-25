import React, { useState } from 'react';
import { MessageSquare, Send, Camera } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatDate } from '../../utils/formatters';
import { Message } from '../../types';

export const ClientMessagesPage: React.FC = () => {
  const { user } = useAuth();
  const clientId = user?.id || 'client-1';

  const conversations = dataService.getConversations(clientId);
  const [selectedConvoId, setSelectedConvoId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>(() =>
    selectedConvoId ? dataService.getMessages(selectedConvoId) : []
  );

  const activeConvo = conversations.find(c => c.id === selectedConvoId);

  const handleSelectConvo = (id: string) => {
    setSelectedConvoId(id);
    setMessages(dataService.getMessages(id));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedConvoId) return;

    dataService.sendMessage(selectedConvoId, clientId, 'client', text.trim());
    setText('');
    setMessages(dataService.getMessages(selectedConvoId));
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden flex h-[78vh]">
      {/* Conversations List */}
      <div className="w-80 border-r border-neutral-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-neutral-900">Photographer Chats</h2>
          <span className="text-[11px] font-semibold text-neutral-400">{conversations.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-neutral-400">No active conversations</div>
          ) : (
            conversations.map(c => (
              <button
                key={c.id}
                onClick={() => handleSelectConvo(c.id)}
                className={`w-full text-left p-4 flex items-center space-x-3 transition-colors ${
                  selectedConvoId === c.id ? 'bg-blue-50/70 border-l-2 border-blue-600' : 'hover:bg-neutral-50'
                }`}
              >
                <img
                  src={c.photographerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                  alt={c.photographerStudio}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-neutral-900 truncate">{c.photographerStudio}</span>
                    <span className="text-[10px] text-neutral-400">{formatDate(c.lastMessageAt)}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 truncate mt-0.5">{c.lastMessageText}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Thread */}
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-50/40">
        {activeConvo ? (
          <>
            <div className="p-4 bg-white border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={activeConvo.photographerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                  alt={activeConvo.photographerStudio}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-xs text-neutral-900">{activeConvo.photographerStudio}</h3>
                  <span className="text-[10px] text-neutral-400 capitalize">
                    {activeConvo.relatedType} conversation
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {messages.map(msg => {
                const isMe = msg.senderRole === 'client';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-xs space-y-1 ${
                        isMe
                          ? 'bg-neutral-900 text-white rounded-br-xs'
                          : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-xs'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className={`text-[9px] text-right ${isMe ? 'text-neutral-400' : 'text-neutral-400'}`}>
                        {formatDate(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t border-neutral-200 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Message photographer..."
                value={text}
                onChange={e => setText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-neutral-400">
            Select a conversation on the left
          </div>
        )}
      </div>
    </div>
  );
};
