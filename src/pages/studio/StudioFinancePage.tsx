import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  CreditCard,
  Calendar,
  Receipt,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatLKR, formatDate } from '../../utils/formatters';
import { PaymentRecord, ExpenseRecord, PaymentType, PaymentMethod, ExpenseCategory } from '../../types';

export const StudioFinancePage: React.FC = () => {
  const { user } = useAuth();
  const photographerId = user?.id || 'photo-1';

  const [payments, setPayments] = useState<PaymentRecord[]>(() =>
    dataService.getPayments(photographerId)
  );
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() =>
    dataService.getExpenses(photographerId)
  );

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // Record Payment Form
  const [payClientName, setPayClientName] = useState('');
  const [payAmount, setPayAmount] = useState(25000);
  const [payType, setPayType] = useState<PaymentType>('advance');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('bank_transfer');
  const [payReceiptRef, setPayReceiptRef] = useState('TXN-HNB-001');

  // Record Expense Form
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('equipment');
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState(15000);

  const totalIncome = payments.reduce((sum, p) => sum + p.amountLkr, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amountLkr, 0);
  const netEarnings = totalIncome - totalExpenses;

  const chartData = [
    { month: 'Jun', Income: 140000, Expenses: 35000 },
    { month: 'Jul', Income: 210000, Expenses: 65000 },
    { month: 'Aug', Income: 180000, Expenses: 45000 },
    { month: 'Sep', Income: 200000, Expenses: 84000 },
    { month: 'Oct', Income: totalIncome, Expenses: totalExpenses },
  ];

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.addPayment({
      photographerId,
      clientName: payClientName,
      amountLkr: Number(payAmount),
      paymentType: payType,
      paymentMethod: payMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'completed',
      receiptRef: payReceiptRef,
    });
    setPayments(dataService.getPayments(photographerId));
    setPaymentModalOpen(false);
    setPayClientName('');
  };

  const handleRecordExpense = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.addExpense({
      photographerId,
      category: expCategory,
      description: expDescription,
      amountLkr: Number(expAmount),
      expenseDate: new Date().toISOString().split('T')[0],
    });
    setExpenses(dataService.getExpenses(photographerId));
    setExpenseModalOpen(false);
    setExpDescription('');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Finance & Studio Accounting</h1>
          <p className="text-xs text-neutral-500">
            Track client deposits, balance settlements, operational overhead, and net profit in LKR.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
          >
            <Receipt className="w-3.5 h-3.5 text-neutral-500" />
            <span>Record Expense</span>
          </button>

          <button
            onClick={() => setPaymentModalOpen(true)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Record Client Payment</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-500">
            <span>Gross Revenue (LKR)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">{formatLKR(totalIncome)}</div>
          <span className="text-[11px] text-neutral-400">Total verified client payments</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-500">
            <span>Operating Expenses (LKR)</span>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">{formatLKR(totalExpenses)}</div>
          <span className="text-[11px] text-neutral-400">Gear rentals, travel, assistant crew</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-500">
            <span>Net Studio Profit</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{formatLKR(netEarnings)}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {((netEarnings / (totalIncome || 1)) * 100).toFixed(0)}% Profit Margin
          </span>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-neutral-900">Income vs Expenses Overview (LKR)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `Rs.${v / 1000}k`} />
              <Tooltip
                formatter={(val: any) => [formatLKR(Number(val)), '']}
                contentStyle={{ backgroundColor: '#171717', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="Income" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ledger Lists: Payments & Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payments Table */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-sm text-neutral-900">Received Payments</h3>
            <span className="text-xs text-neutral-400">{payments.length} transactions</span>
          </div>

          <div className="space-y-3">
            {payments.map(pay => (
              <div
                key={pay.id}
                className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-neutral-900">{pay.clientName}</div>
                  <div className="text-[11px] text-neutral-400 capitalize">
                    {pay.paymentType} • {pay.paymentMethod.replace('_', ' ')} • {pay.receiptRef}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-emerald-600 text-sm">+{formatLKR(pay.amountLkr)}</div>
                  <div className="text-[10px] text-neutral-400">{formatDate(pay.paymentDate)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-sm text-neutral-900">Studio Operating Expenses</h3>
            <span className="text-xs text-neutral-400">{expenses.length} records</span>
          </div>

          <div className="space-y-3">
            {expenses.map(exp => (
              <div
                key={exp.id}
                className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-neutral-900">{exp.description}</div>
                  <div className="text-[11px] text-neutral-400 capitalize">Category: {exp.category.replace('_', ' ')}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-neutral-800 text-sm">-{formatLKR(exp.amountLkr)}</div>
                  <div className="text-[10px] text-neutral-400">{formatDate(exp.expenseDate)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-neutral-900">Record Client Payment</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Confirm receipt of advance deposit or final balance payment.
            </p>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Wickramasinghe"
                  value={payClientName}
                  onChange={e => setPayClientName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Amount (LKR) *</label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={payAmount}
                    onChange={e => setPayAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Type</label>
                  <select
                    value={payType}
                    onChange={e => setPayType(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="advance">Advance Deposit</option>
                    <option value="balance">Final Balance</option>
                    <option value="full">Full Settlement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Method</label>
                  <select
                    value={payMethod}
                    onChange={e => setPayMethod(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="bank_transfer">Bank Transfer (SL)</option>
                    <option value="cash">Cash on Hand</option>
                    <option value="card">Credit / Debit Card</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Reference / Slip ID</label>
                  <input
                    type="text"
                    value={payReceiptRef}
                    onChange={e => setPayReceiptRef(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors mt-2"
              >
                Save Payment to Ledger
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Record Expense Modal */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <button
              onClick={() => setExpenseModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-neutral-900">Record Business Expense</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Log operational overhead to monitor net studio margin.
            </p>

            <form onSubmit={handleRecordExpense} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Expense Category *</label>
                <select
                  value={expCategory}
                  onChange={e => setExpCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="equipment">Camera & Lens Rental</option>
                  <option value="assistant_crew">Second Shooter / Lighting Crew</option>
                  <option value="travel">Transport & Highway Tolls</option>
                  <option value="software_storage">Software & Cloud Storage</option>
                  <option value="studio_rent">Studio Rent & Utilities</option>
                  <option value="marketing">Advertising & Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Second shooter honorarium for Galle wedding"
                  value={expDescription}
                  onChange={e => setExpDescription(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Amount (LKR) *</label>
                <input
                  type="number"
                  step="500"
                  required
                  value={expAmount}
                  onChange={e => setExpAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors mt-2"
              >
                Log Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
