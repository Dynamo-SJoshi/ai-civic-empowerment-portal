import React from 'react';
import { FileText, ShieldAlert, ExternalLink, ArrowRight, CheckCircle2, ShieldCheck, Scale, Layers, ShoppingBag } from 'lucide-react';

export const Dashboard = ({ onSelectRTI, onSelectSchemeReader, onSelectConsumerRights }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Welcome Banner */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-200 shadow-sm">
          <Scale className="w-3.5 h-3.5" />
          <span>Civic Rights & Transparency Suite</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Your Legal Action
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-600">
          Fast, accessible, and structured public tools to exercise your statutory rights, resolve consumer disputes, discover welfare schemes, and protect your agreements.
        </p>
      </div>

      {/* Primary Action Cards Grid (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        
        {/* CARD 1: AI Guided RTI Filing */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <FileText className="w-6 h-6" />
              </div>
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-600" />
                Voice & AI
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              AI Guided RTI Filing
            </h3>
            
            <p className="mt-2 text-slate-600 text-xs leading-relaxed">
              Describe your issue in plain words or by voice. Gemini AI automatically routes the Central Public Authority, creates a 3-step action plan, and drafts your RTI.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                🎙️ Native Speech-to-Text
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                Central Ministry routing & checklist
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                3,000 char validation & PDF download
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
              onClick={onSelectRTI}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 group/btn text-xs"
            >
              <span>Start RTI Application</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* CARD 2: Scheme Eligibility Reader */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Layers className="w-6 h-6" />
              </div>
              <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                AI Reasoning
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
              Scheme Eligibility Reader
            </h3>
            
            <p className="mt-2 text-slate-600 text-xs leading-relaxed">
              Describe your background by text or voice. Instantly match eligible Central & State welfare schemes, scholarships, healthcare benefits, and required documents.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                🎙️ Voice input & profile tags
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                Eligibility checklist & document lists
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                Direct links to official portals
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
              onClick={onSelectSchemeReader}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 group/btn text-xs"
            >
              <span>Find Eligible Schemes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* CARD 3: Consumer Rights Navigator */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-600" />
                CPA 2019 Protection
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
              Consumer Rights Navigator
            </h3>
            
            <p className="mt-2 text-slate-600 text-xs leading-relaxed">
              Resolve disputes with sellers, brands, or service providers. Generate formal legal notices and navigate consumer court filings (e-Daakhil).
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                🎙️ Voice input & category chips
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                15-Day Pre-litigation Legal Notice PDF
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                3-Tier escalation: Notice → NCH → e-Daakhil
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
              onClick={onSelectConsumerRights}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 group/btn text-xs"
            >
              <span>Resolve Dispute</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* CARD 4: AI Contract Risk Scanner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center border border-slate-200 group-hover:bg-slate-800 group-hover:text-white transition-colors duration-300">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                External Tool
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
              AI Contract Risk Scanner
            </h3>
            
            <p className="mt-2 text-slate-600 text-xs leading-relaxed">
              Analyze your lease or employment agreement for legal pitfalls. Instantly scan legal documents for one-sided clauses, hidden penalties, and unfair terms before signing.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0"></span>
                Lease & employment agreement analysis
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0"></span>
                Flags high-risk indemnities & penalties
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0"></span>
                Instant plain-English risk breakdown
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <a
              href="https://ai-contract-risk-scanner.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 group/btn text-center inline-block text-xs"
            >
              <span>Launch Risk Scanner</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

      </div>

      {/* Info Callout Section */}
      <div className="mt-16 max-w-5xl mx-auto bg-slate-900 text-slate-300 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-900/50 text-blue-400 rounded-xl border border-blue-700/50">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Guaranteed Privacy & Data Security</h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Rights Navigator runs entirely client-side in your browser. We never store, log, or transmit your RTI draft inputs, consumer dispute notices, or personally identifiable information to external servers.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 font-mono">
            RTI Act & CPA 2019 Compliant
          </span>
        </div>
      </div>
    </div>
  );
};
