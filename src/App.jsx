import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AIGuidedFiling } from './components/AIGuidedFiling';
import { SchemeReader } from './components/SchemeReader';
import { RightsNavigator } from './components/RightsNavigator';
import { Landmark, Shield, HeartHandshake, ExternalLink } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'rti_filler' | 'scheme_reader' | 'consumer_rights'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Header Bar */}
      <Header
        currentView={currentView}
        onNavigateHome={() => setCurrentView('dashboard')}
        onNavigateView={(view) => setCurrentView(view)}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        {currentView === 'dashboard' && (
          <Dashboard
            onSelectRTI={() => setCurrentView('rti_filler')}
            onSelectSchemeReader={() => setCurrentView('scheme_reader')}
            onSelectConsumerRights={() => setCurrentView('consumer_rights')}
          />
        )}

        {currentView === 'rti_filler' && (
          <AIGuidedFiling onBackToDashboard={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'scheme_reader' && (
          <SchemeReader onBackToDashboard={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'consumer_rights' && (
          <RightsNavigator onBackToDashboard={() => setCurrentView('dashboard')} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-950 text-amber-400 rounded-lg border border-blue-800">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-white font-bold text-sm block">Rights Navigator</span>
                <span className="text-slate-400 text-xs">Empowering Civic Transparency & Legal Clarity</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-300 font-medium">
              <button 
                onClick={() => setCurrentView('dashboard')} 
                className="hover:text-amber-400 transition"
              >
                Dashboard
              </button>

              <button 
                onClick={() => setCurrentView('rti_filler')} 
                className="hover:text-amber-400 transition"
              >
                AI RTI Filing
              </button>

              <button 
                onClick={() => setCurrentView('scheme_reader')} 
                className="hover:text-amber-400 transition"
              >
                Scheme Eligibility Reader
              </button>

              <button 
                onClick={() => setCurrentView('consumer_rights')} 
                className="hover:text-amber-400 transition"
              >
                Consumer Rights Navigator
              </button>

              <a 
                href="https://ai-contract-risk-scanner.onrender.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-amber-400 transition flex items-center gap-1"
              >
                <span>AI Risk Scanner</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a 
                href="https://rtionline.gov.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-amber-400 transition flex items-center gap-1 text-blue-300"
              >
                <span>rtionline.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <p>
              © {new Date().getFullYear()} Rights Navigator. Designed for citizen empowerment. Not affiliated with DoPT or Government of India.
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Zero Data Tracking
              </span>
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                Open Civic Tech
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
