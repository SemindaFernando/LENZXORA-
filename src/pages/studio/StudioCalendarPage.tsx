import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  AlertTriangle,
  X,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatDate } from '../../utils/formatters';
import { CalendarEvent, CalendarEventType } from '../../types';

export const StudioCalendarPage: React.FC = () => {
  const { user } = useAuth();
  const photographerId = user?.id || 'photo-1';

  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    dataService.getCalendarEvents(photographerId)
  );
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('agenda');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<CalendarEventType>('booking');
  const [startDate, setStartDate] = useState('2025-05-12');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [notes, setNotes] = useState('');

  // Conflict detection helper
  const bookingDates = events.filter(e => e.eventType === 'booking').map(e => e.startDate);
  const dateCounts: Record<string, number> = {};
  bookingDates.forEach(d => {
    dateCounts[d] = (dateCounts[d] || 0) + 1;
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.addCalendarEvent({
      photographerId,
      title,
      eventType,
      startDate,
      startTime,
      endTime,
      isAllDay: false,
      notes,
    });
    setEvents(dataService.getCalendarEvents(photographerId));
    setAddModalOpen(false);
    setTitle('');
    setNotes('');
  };

  const handleDeleteEvent = (id: string) => {
    dataService.deleteCalendarEvent(id);
    setEvents(dataService.getCalendarEvents(photographerId));
  };

  const getBadgeColor = (type: CalendarEventType) => {
    switch (type) {
      case 'booking':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'meeting':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'deadline':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'unavailable':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Studio Availability & Shoot Calendar</h1>
          <p className="text-xs text-neutral-500">
            Automatically synchronizes confirmed bookings, editing deadlines, and blackout dates.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-neutral-200 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'agenda' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Agenda List
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'month' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Month Overview
            </button>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Event / Block Date</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs bg-white p-3 rounded-2xl border border-neutral-200">
        <span className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Confirmed Shoot</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Client Meeting / Call</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Editing Deadline</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span>Unavailable / Maintenance</span>
        </span>
      </div>

      {/* Agenda View */}
      {viewMode === 'agenda' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-neutral-900">Upcoming Scheduled Engagements</h3>
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">No calendar events</p>
            ) : (
              events
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .map(ev => {
                  const hasConflict = dateCounts[ev.startDate] > 1 && ev.eventType === 'booking';
                  return (
                    <div
                      key={ev.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                        hasConflict
                          ? 'bg-red-50/60 border-red-200'
                          : 'bg-neutral-50 border-neutral-200/80 hover:bg-neutral-100/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getBadgeColor(ev.eventType)}`}>
                            {ev.eventType}
                          </span>
                          <span className="font-bold text-xs text-neutral-900">{ev.title}</span>
                          {hasConflict && (
                            <span className="flex items-center space-x-1 text-[11px] text-red-600 font-bold">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Double-booked</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-neutral-500 pt-0.5">
                          <span>{formatDate(ev.startDate)}</span>
                          {ev.startTime && (
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-neutral-400" />
                              <span>{ev.startTime} - {ev.endTime || 'End'}</span>
                            </span>
                          )}
                          {ev.notes && <span className="italic text-neutral-400">"{ev.notes}"</span>}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                        title="Remove event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* Month Overview Grid View */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-sm text-neutral-900">May 2025 Schedule</h3>
            <span className="text-xs text-neutral-400">Colombo Time (IST)</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-neutral-400 py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const dateStr = `2025-05-${day < 10 ? '0' + day : day}`;
              const dayEvents = events.filter(e => e.startDate === dateStr);

              return (
                <div
                  key={day}
                  className={`min-h-[85px] p-2 rounded-xl border text-left flex flex-col justify-between ${
                    dayEvents.length > 0 ? 'bg-neutral-50 border-neutral-300' : 'bg-white border-neutral-100'
                  }`}
                >
                  <div className="text-xs font-bold text-neutral-700">{day}</div>
                  <div className="space-y-1">
                    {dayEvents.map(e => (
                      <div
                        key={e.id}
                        className={`text-[10px] truncate px-1 py-0.5 rounded font-semibold ${getBadgeColor(e.eventType)}`}
                        title={e.title}
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-neutral-900">Add Calendar Entry</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Reserve dates, schedule client consultations, or block personal days off.
            </p>

            <form onSubmit={handleAddEvent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pre-wedding meeting with Dinithi"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Event Type *
                  </label>
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="booking">Confirmed Shoot</option>
                    <option value="meeting">Consultation / Meeting</option>
                    <option value="deadline">Editing Deadline</option>
                    <option value="unavailable">Blocked / Unavailable</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Location or Notes
                </label>
                <input
                  type="text"
                  placeholder="Zoom link or studio address"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Save to Calendar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
