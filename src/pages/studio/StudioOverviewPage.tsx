import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Film,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Users,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Briefcase,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatLKR, formatDate } from '../../utils/formatters';

export const StudioOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const photographerId = user?.id || 'photo-1';

  const photographer = dataService.getPhotographerById(photographerId);
  const bookings = dataService.getBookings(photographerId, 'photographer');
  const calendarEvents = dataService.getCalendarEvents(photographerId);
  const editingProjects = dataService.getEditingProjects(photographerId);
  const payments = dataService.getPayments(photographerId);
  const expenses = dataService.getExpenses(photographerId);
  const offers = dataService.getOffersByPhotographer(photographerId);
  const conversations = dataService.getConversations(photographerId);

  // Financial calculations
  const totalIncome = payments.reduce((sum, p) => sum + p.amountLkr, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amountLkr, 0);
  const netProfit = totalIncome - totalExpenses;

  const totalOutstanding = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'in_progress')
    .reduce((sum, b) => sum + b.outstandingBalanceLkr, 0);

  const activeEditingCount = editingProjects.filter(p => p.stage !== 'final_delivery').length;
  const upcomingDeadlines = editingProjects
    .filter(p => p.stage !== 'final_delivery')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  const upcomingBookings = bookings
    .filter(b => b.status === 'confirmed')
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3);

  // Monthly Revenue Chart Mock Data
  const monthlyData = [
    { month: 'May', income: 180000, expenses: 45000 },
    { month: 'Jun', income: 220000, expenses: 60000 },
    { month: 'Jul', income: 310000, expenses: 85000 },
    { month: 'Aug', income: 280000, expenses: 55000 },
    { month: 'Sep', income: 240000, expenses: 50000 },
    { month: 'Oct', income: totalIncome, expenses: totalExpenses },
  ];

  return (
    <div className="space-y-8">
      {/* Studio Header Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
              {photographer?.studioName || 'Your Photography Studio'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
              Active Studio
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Studio Operating System • Location: {photographer?.location || 'Sri Lanka'} • {photographer?.ratingAvg || 5.0} ★ ({photographer?.reviewCount || 0} reviews)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/studio/requests"
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Discover Client Requests</span>
          </Link>
          <Link
            to={`/photographers/${photographerId}`}
            target="_blank"
            className="px-3.5 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Public Profile
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-500">
            <span>Total Collected Income</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">
            {formatLKR(totalIncome)}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Net Profit: {formatLKR(netProfit)}</span>
          </div>
        </div>

        {/* Outstanding Receivables */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-500">
            <span>Pending Receivables</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">
            {formatLKR(totalOutstanding)}
          </div>
          <div className="text-[11px] text-neutral-400">
            Across {bookings.filter(b => b.outstandingBalanceLkr > 0).length} active client shoots
          </div>
        </div>

        {/* Active Editing Jobs */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-500">
            <span>Active Editing Projects</span>
            <Film className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">
            {activeEditingCount}
          </div>
          <div className="text-[11px] text-purple-600">
            In post-production pipeline
          </div>
        </div>

        {/* Confirmed Shoots */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-500">
            <span>Confirmed Shoots</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">
            {bookings.length}
          </div>
          <div className="text-[11px] text-blue-600">
            {offers.filter(o => o.status === 'pending').length} pending submitted offers
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Shoots & Financial Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Financial Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Financial Growth (LKR)</h3>
              <p className="text-xs text-neutral-400">Monthly gross income vs operational expenses</p>
            </div>
            <Link to="/studio/finance" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
              Detailed Ledger →
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `Rs.${v / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [formatLKR(Number(value)), '']}
                  contentStyle={{ backgroundColor: '#171717', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="income" name="Income" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Upcoming Deadlines */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-sm text-neutral-900 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Upcoming Deadlines</span>
              </h3>
              <Link to="/studio/editing" className="text-xs text-amber-600 font-semibold hover:text-amber-700">
                Kanban
              </Link>
            </div>

            <div className="space-y-3 mt-4">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-neutral-400 py-4 text-center">No pending deadlines</p>
              ) : (
                upcomingDeadlines.map(d => (
                  <div key={d.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-neutral-900 truncate max-w-[150px]">
                        {d.title}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        d.priority === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {d.priority}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-500">
                      <span>Due: {formatDate(d.deadline)}</span>
                      <span>{d.progressPercentage}% complete</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full"
                        style={{ width: `${d.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            to="/studio/editing"
            className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl text-center transition-colors block mt-4"
          >
            Open Editing Workflow Manager
          </Link>
        </div>
      </div>

      {/* Two Column Section: Upcoming Shoots & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Shoots */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-sm text-neutral-900">Upcoming Confirmed Shoots</h3>
            <Link to="/studio/bookings" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
              All Bookings →
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingBookings.length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">No upcoming confirmed bookings</p>
            ) : (
              upcomingBookings.map(b => (
                <div
                  key={b.id}
                  className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-neutral-900 block">{b.eventTitle}</span>
                    <div className="text-[11px] text-neutral-500 flex items-center space-x-2">
                      <span>{formatDate(b.eventDate)} ({b.startTime} - {b.endTime})</span>
                      <span>•</span>
                      <span>{b.location}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-neutral-700">
                      Client: {b.clientName}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-xs text-neutral-900">{formatLKR(b.totalAmountLkr)}</div>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Client Messages */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-sm text-neutral-900">Recent Inquiries & Messages</h3>
            <Link to="/studio/messages" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
              View Inbox →
            </Link>
          </div>

          <div className="space-y-3">
            {conversations.length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">No messages yet</p>
            ) : (
              conversations.slice(0, 3).map(conv => (
                <Link
                  key={conv.id}
                  to="/studio/messages"
                  className="p-3.5 bg-neutral-50 hover:bg-neutral-100/70 rounded-2xl border border-neutral-100 flex items-center space-x-3 transition-colors block"
                >
                  <img
                    src={conv.clientAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'}
                    alt={conv.clientName}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-neutral-900 truncate">{conv.clientName}</span>
                      <span className="text-[10px] text-neutral-400">{formatDate(conv.lastMessageAt)}</span>
                    </div>
                    <p className="text-xs text-neutral-500 truncate mt-0.5">{conv.lastMessageText}</p>
                  </div>
                  {conv.unreadCountPhotographer > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
