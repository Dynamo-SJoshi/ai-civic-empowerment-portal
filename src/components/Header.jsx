import React from 'react';
import { Landmark, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';
import { GoogleTranslate } from './GoogleTranslate';

export const Header = ({ onNavigateHome, currentView }) => {
  return (
    <header className="bg-slate-900 text-white shadow-lg border-b border-slate-800">
      {/* Top Govt Tri-color Accent Bar */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="bg-blue-800/80 p-2.5 rounded-lg border border-blue-600/50 text-blue-200 group-hover:bg-blue-700 transition">
              <Landmark className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-blue-200 transition">
                  Rights Navigator
                </h1>
                <span className="bg-amber-400/20 text-amber-300 text-xs font-semibold px-2 py-0.5 rounded border border-amber-400/30">
                  CIVIC TECH
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Central Government RTI Request Helper & Legal Empowerment Portal
              </p>
            </div>
          </div>

          {/* Quick Actions & Portal Status */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            {/* Google Translate Integration */}
            <GoogleTranslate />

            <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official RTI Format</span>
            </div>

            {currentView !== 'dashboard' && (
              <button
                onClick={onNavigateHome}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-md font-medium text-xs border border-slate-700 transition flex items-center gap-1.5"
              >
                ← Back to Dashboard
              </button>
            )}

            <a
              href="https://rtionline.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-md font-medium text-xs transition flex items-center gap-1 shadow-sm"
            >
              <span>rtionline.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};
