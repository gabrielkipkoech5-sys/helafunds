
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  Info, 
  ArrowRight, 
  PieChart as PieChartIcon, 
  History, 
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
  Menu,
  X
} from 'lucide-react';
import { LoanDetails, AIAdvice, CalculationResult } from './types';
import { calculateLoan, formatCurrency, formatPercent } from './utils/calculations';
import { getFinancialAdvice } from './services/geminiService';
import { StatCard } from './components/StatCard';
import { LoanChart } from './components/LoanChart';

const App: React.FC = () => {
  const [details, setDetails] = useState<LoanDetails>({
    principal: 250000,
    interestRate: 6.5,
    termYears: 30,
    monthlyIncome: 6500,
    monthlyExpenses: 4200,
  });

  const [aiAdvice, setAIAdvice] = useState<AIAdvice | null>(null);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const result = useMemo(() => calculateLoan(details), [details]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const runAIAnalysis = async () => {
    setIsAIAnalyzing(true);
    setAIAdvice(null);
    try {
      const advice = await getFinancialAdvice(details);
      setAIAdvice(advice);
    } catch (error) {
      console.error(error);
      alert("AI Analysis failed. Please check your network or try again.");
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Calculator className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-slate-800 tracking-tight">LendSmart AI</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Controls */}
      <aside className={`
        fixed inset-0 z-40 lg:relative lg:z-0 lg:block
        bg-white border-r border-slate-200 w-full lg:w-[400px] xl:w-[450px]
        transform transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <div className="hidden lg:flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Calculator className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900 tracking-tight">LendSmart AI</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Financial Simulation Engine</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> Loan Parameters
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Principal Amount ($)</label>
                  <input
                    type="number"
                    name="principal"
                    value={details.principal}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    placeholder="e.g. 250000"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-slate-400">$10k</span>
                    <input 
                      type="range" min="10000" max="1000000" step="5000" 
                      name="principal" value={details.principal} onChange={handleInputChange}
                      className="w-3/4 accent-indigo-600"
                    />
                    <span className="text-xs text-slate-400">$1M</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Annual Interest Rate (%)</label>
                  <input
                    type="number"
                    name="interestRate"
                    value={details.interestRate}
                    onChange={handleInputChange}
                    step="0.1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    placeholder="e.g. 6.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Loan Term (Years)</label>
                  <select
                    name="termYears"
                    value={details.termYears}
                    onChange={(e) => setDetails(prev => ({ ...prev, termYears: parseInt(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  >
                    {[5, 10, 15, 20, 25, 30, 40].map(yr => (
                      <option key={yr} value={yr}>{yr} Years</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Financial Context (Optional)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Monthly Income</label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={details.monthlyIncome}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Monthly Expenses</label>
                  <input
                    type="number"
                    name="monthlyExpenses"
                    value={details.monthlyExpenses}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
            </section>

            <button 
              onClick={runAIAnalysis}
              disabled={isAIAnalyzing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-xl py-4 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
            >
              {isAIAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Financials...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze with Gemini AI
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 bg-slate-50 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              label="Estimated Monthly Payment" 
              value={formatCurrency(result.monthlyPayment)}
              icon={<TrendingUp className="w-5 h-5" />}
              trend={{ value: `${((result.monthlyPayment / (details.monthlyIncome || 1)) * 100).toFixed(1)}% of income`, isPositive: (result.monthlyPayment / (details.monthlyIncome || 1)) < 0.3 }}
            />
            <StatCard 
              label="Total Principal" 
              value={formatCurrency(details.principal)}
              icon={<CheckCircle2 className="w-5 h-5" />}
            />
            <StatCard 
              label="Total Interest Payable" 
              value={formatCurrency(result.totalInterest)}
              icon={<PieChartIcon className="w-5 h-5" />}
              trend={{ value: `${((result.totalInterest / details.principal) * 100).toFixed(1)}% of loan size`, isPositive: false }}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Chart Area */}
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Payment Breakdown Over Time</h3>
                    <p className="text-sm text-slate-500">How your monthly principal vs. interest changes</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                      <span className="text-xs font-medium text-slate-600">Principal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      <span className="text-xs font-medium text-slate-600">Interest</span>
                    </div>
                  </div>
                </div>
                <LoanChart data={result.schedule} />
              </div>

              {/* Amortization Table Preview */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Amortization Schedule</h3>
                  <button className="text-sm font-semibold text-indigo-600 flex items-center gap-1">
                    Export CSV <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Month</th>
                        <th className="px-6 py-4">Principal</th>
                        <th className="px-6 py-4">Interest</th>
                        <th className="px-6 py-4">Total Interest</th>
                        <th className="px-6 py-4">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {result.schedule.slice(0, 12).map((item) => (
                        <tr key={item.month} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">Mo {item.month}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(item.principal)}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(item.interest)}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(item.totalInterest)}</td>
                          <td className="px-6 py-4 text-sm text-indigo-600 font-semibold">{formatCurrency(item.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.schedule.length > 12 && (
                    <div className="p-4 bg-slate-50 text-center text-slate-400 text-sm">
                      Showing first 12 months. {result.schedule.length - 12} more periods remaining.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Advisory Side Panel */}
            <div className="xl:col-span-1">
              <div className="bg-indigo-950 rounded-3xl p-8 text-white h-full relative overflow-hidden">
                {/* Background flare */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 blur-[100px] -mr-32 -mt-32"></div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-400/30">
                      <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">AI Financial Advisor</h3>
                      <p className="text-indigo-300 text-sm">Gemini Analysis</p>
                    </div>
                  </div>

                  {!aiAdvice && !isAIAnalyzing && (
                    <div className="text-center py-10 space-y-4">
                      <Zap className="w-12 h-12 text-indigo-400/50 mx-auto" />
                      <p className="text-indigo-200">Get deep insights into your loan risk, affordability, and overall financial health.</p>
                      <button 
                        onClick={runAIAnalysis}
                        className="bg-white text-indigo-900 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
                      >
                        Start Analysis
                      </button>
                    </div>
                  )}

                  {isAIAnalyzing && (
                    <div className="text-center py-12 space-y-4">
                      <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mx-auto" />
                      <p className="text-indigo-100 font-medium">Calculating risk vectors...</p>
                      <div className="w-full bg-indigo-900/50 h-1 rounded-full overflow-hidden">
                        <div className="bg-indigo-400 h-full animate-progress" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  )}

                  {aiAdvice && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div>
                          <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1">Risk Score</p>
                          <p className="text-3xl font-black">{aiAdvice.riskScore}<span className="text-lg text-indigo-400">/10</span></p>
                        </div>
                        <div className="text-right">
                          <div className={`
                            inline-block px-3 py-1 rounded-full text-xs font-bold uppercase 
                            ${aiAdvice.riskScore <= 4 ? 'bg-emerald-500/20 text-emerald-400' : 
                              aiAdvice.riskScore <= 7 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}
                          `}>
                            {aiAdvice.verdict}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-indigo-200 mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Benefits
                        </h4>
                        <ul className="space-y-3">
                          {aiAdvice.pros.map((pro, i) => (
                            <li key={i} className="flex gap-3 text-sm text-indigo-50">
                              <span className="w-5 h-5 bg-emerald-500/20 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-emerald-400 font-bold">✓</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-indigo-200 mb-4 flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-400" /> Potential Risks
                        </h4>
                        <ul className="space-y-3">
                          {aiAdvice.cons.map((con, i) => (
                            <li key={i} className="flex gap-3 text-sm text-indigo-50">
                              <span className="w-5 h-5 bg-rose-500/20 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-rose-400 font-bold">!</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 italic text-sm text-indigo-100 leading-relaxed">
                        &quot;{aiAdvice.recommendation}&quot;
                      </div>

                      <button 
                        onClick={runAIAnalysis}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-indigo-300 transition-colors uppercase tracking-widest"
                      >
                        Refresh Analysis
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Tailwind animation extension */}
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
