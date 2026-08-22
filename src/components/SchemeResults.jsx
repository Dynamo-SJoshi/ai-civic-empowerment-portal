import React, { useState } from 'react';
import schemesDatabase from '../data/schemes_db.json';
import { 
  CheckCircle2, XCircle, HelpCircle, ExternalLink, ChevronDown, ChevronUp, 
  RefreshCw, FileCheck, Building2, Sparkles, Send, ShieldCheck
} from 'lucide-react';

export const SchemeResults = ({ results, userPrompt, onUpdateProfile, onReset }) => {
  const [missingInfoInput, setMissingInfoInput] = useState('');
  const [isIneligibleExpanded, setIsIneligibleExpanded] = useState(false);

  const { eligible_schemes = [], ineligible_schemes = [], missing_info = [], source = 'AI_ENGINE' } = results || {};

  // Helper to map scheme ID back to full metadata in schemes_db.json
  const getFullSchemeMeta = (id) => {
    return schemesDatabase.find(s => s.id === id) || null;
  };

  const handleSendAdditionalData = (e) => {
    e.preventDefault();
    if (!missingInfoInput.trim()) return;
    onUpdateProfile(missingInfoInput);
    setMissingInfoInput('');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Summary Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              AI Eligibility Assessment Complete
            </span>
            <span className="text-xs text-slate-400">Source: {source}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Matching Scheme Dashboard
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Based on profile: "<strong className="text-amber-400">{userPrompt}</strong>"
          </p>
        </div>

        <button
          onClick={onReset}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Start New Search
        </button>
      </div>

      {/* 1. ELIGIBLE SCHEMES SECTION (GREEN ACCENTED CARDS) */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h4 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
            Eligible Government Schemes ({eligible_schemes.length})
          </h4>
        </div>

        {eligible_schemes.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 text-sm">
            No fully matching schemes found for this specific combination. Try updating your profile details below.
          </div>
        ) : (
          <div className="space-y-6">
            {eligible_schemes.map((item, idx) => {
              const fullMeta = getFullSchemeMeta(item.id);
              const docsList = fullMeta?.required_documents || item.required_documents || [];
              const portalUrl = fullMeta?.official_portal_url || item.official_portal_url || 'https://myscheme.gov.in';

              return (
                <div
                  key={item.id || idx}
                  className="bg-white rounded-2xl border-2 border-emerald-500/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Top Green Accent Header Bar */}
                  <div className="bg-emerald-500 text-white px-6 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Qualifies for Application
                    </span>
                    <span>{fullMeta?.category || 'Welfare Scheme'}</span>
                  </div>

                  <div className="p-6 sm:p-8 space-y-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
                          <Building2 className="w-3.5 h-3.5 text-blue-700" />
                          <span>{item.department || fullMeta?.department}</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900">
                          {item.name || fullMeta?.name}
                        </h3>
                      </div>

                      <a
                        href={portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center gap-2 shrink-0"
                      >
                        <span>Apply Now</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Qualification Reason Summary */}
                    <div className="bg-emerald-50/80 border border-emerald-200/80 p-4 rounded-xl text-slate-900 text-xs sm:text-sm leading-relaxed">
                      <strong className="text-emerald-900 font-bold block mb-1">
                        Why You Qualify:
                      </strong>
                      {item.qualification_reason || fullMeta?.description}
                    </div>

                    {/* Required Documents Checklist */}
                    {docsList.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-emerald-600" />
                          Required Documents Checklist:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                          {docsList.map((doc, dIdx) => (
                            <li key={dIdx} className="bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl flex items-center gap-2 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. MISSING INFORMATION & CONVERSATIONAL FOLLOW-UP */}
      {missing_info && missing_info.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl border border-amber-300">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-amber-950">
                Additional Information Needed for Complete Verification
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                We need a few more details to determine your eligibility for other specialized schemes:
              </p>
            </div>
          </div>

          <ul className="space-y-2 pl-2">
            {missing_info.map((info, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-amber-900 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                <span>{info}</span>
              </li>
            ))}
          </ul>

          {/* Conversational Follow-Up Data Input Field */}
          <form onSubmit={handleSendAdditionalData} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={missingInfoInput}
              onChange={(e) => setMissingInfoInput(e.target.value)}
              placeholder="Provide missing info (e.g., Annual Income: ₹2 Lakhs, Category: OBC)..."
              className="w-full bg-white border border-amber-300 text-slate-900 text-xs sm:text-sm rounded-xl p-3 focus:ring-2 focus:ring-amber-500 font-medium"
            />
            <button
              type="submit"
              disabled={!missingInfoInput.trim()}
              className={`px-5 py-3 rounded-xl font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 transition ${
                missingInfoInput.trim()
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md'
                  : 'bg-amber-200 text-amber-500 cursor-not-allowed'
              }`}
            >
              <span>Update & Re-Check</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* 3. INELIGIBLE SCHEMES ACCORDION */}
      {ineligible_schemes && ineligible_schemes.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <button
            onClick={() => setIsIneligibleExpanded(!isIneligibleExpanded)}
            className="w-full bg-slate-50 hover:bg-slate-100 px-6 py-4 flex items-center justify-between text-slate-800 text-sm font-extrabold transition border-b border-slate-200"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span>Schemes you do not qualify for ({ineligible_schemes.length}) (Click to expand)</span>
            </div>
            {isIneligibleExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {isIneligibleExpanded && (
            <div className="p-6 space-y-4 bg-slate-50/50 animate-fadeIn">
              {ineligible_schemes.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{item.department}</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 text-red-800 p-2.5 rounded-lg">
                    <strong>Reason for Ineligibility:</strong> {item.disqualification_reason || 'Criteria mismatch.'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
