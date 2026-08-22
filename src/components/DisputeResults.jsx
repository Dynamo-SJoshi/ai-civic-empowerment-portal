import React, { useState } from 'react';
import { generateRTIPdf } from '../utils/pdfGenerator';
import { 
  ShieldAlert, CheckCircle2, Copy, Download, ExternalLink, 
  PhoneCall, Scale, ArrowRight, AlertTriangle, FileText, 
  RefreshCw, Sparkles, Building2, Clock, Landmark
} from 'lucide-react';

export const DisputeResults = ({ results, userNarrative, onReset }) => {
  const { violation_summary, recommended_claim, formal_notice_text, edaakhil_guidance, source } = results || {};

  const [noticeText, setNoticeText] = useState(formal_notice_text || '');
  const [copied, setCopied] = useState(false);

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(noticeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPDF = () => {
    generateRTIPdf(
      noticeText, 
      'Consumer_Grievance_Officer'
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Summary Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              Consumer Protection Act, 2019
            </span>
            <span className="text-xs text-slate-400">Analysis Source: {source}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Consumer Rights & Legal Action Plan
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Grievance: "<strong className="text-amber-300">{userNarrative}</strong>"
          </p>
        </div>

        <button
          onClick={onReset}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Start New Query
        </button>
      </div>

      {/* TOP CARD: PLAIN-ENGLISH RIGHTS ASSESSMENT */}
      <div className="bg-white rounded-2xl border-2 border-amber-500/80 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
          <h4 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
            Legal Violations & Recommended Claim Assessment
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detected Legal Violation */}
          <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl space-y-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
              Statutory Violation
            </span>
            <h5 className="text-base font-bold text-slate-900">
              {violation_summary}
            </h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Under CPA 2019, sellers and service providers are strictly liable for supplying defective goods, failing to honor statutory warranties, or providing deficient services.
            </p>
          </div>

          {/* Recommended Legal Claim */}
          <div className="bg-emerald-50/80 border border-emerald-200 p-5 rounded-2xl space-y-2">
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
              Recommended Claim & Remedies
            </span>
            <h5 className="text-base font-bold text-slate-900">
              {recommended_claim}
            </h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are entitled to demand full monetary refund, replacement, plus compensation for mental agony, harassment, and legal expenses.
            </p>
          </div>
        </div>
      </div>

      {/* 3-TIER ESCALATION LADDER UI */}
      <div className="space-y-6">
        <h4 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-blue-700" />
          Multi-Stage Consumer Escalation Ladder
        </h4>

        {/* TIER 1: FORMAL LEGAL NOTICE (IMMEDIATE ACTION) */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-lg overflow-hidden">
          <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center font-extrabold text-xs">
                1
              </span>
              <div>
                <h5 className="font-extrabold text-base text-white">
                  Tier 1: Pre-Litigation Formal Legal Notice (Immediate Action)
                </h5>
                <span className="text-xs text-blue-200">
                  Mandatory first step under Consumer Protection Act, 2019
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Warning Banner */}
            <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">15-Day Statutory Rectification Deadline:</strong>
                Send this formal legal notice to the seller or brand's official Grievance Officer (via email or Speed Post) and allow 15 days to respond before filing in court.
              </div>
            </div>

            {/* Editable Notice Container */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-700" />
                  Pre-Litigation Legal Notice Draft (Editable):
                </label>
                <span className="text-xs text-slate-400">
                  {noticeText.length} characters
                </span>
              </div>

              <textarea
                rows={12}
                value={noticeText}
                onChange={(e) => setNoticeText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm rounded-xl p-4 font-mono leading-relaxed focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            {/* Actions: Copy & PDF Download */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={handleCopyNotice}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3 rounded-xl text-xs border border-slate-300 transition flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Copy Notice Text</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadPDF}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Notice PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* TIER 2: NATIONAL CONSUMER HELPLINE (NCH) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center font-extrabold text-xs">
              2
            </span>
            <div>
              <h5 className="font-extrabold text-lg text-slate-900">
                Tier 2: Register Grievance on National Consumer Helpline (NCH)
              </h5>
              <p className="text-xs text-slate-500">
                Pre-litigation conciliation service by Department of Consumer Affairs
              </p>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-blue-950 uppercase tracking-wider block">
                📞 Toll-Free Helpline:
              </span>
              <p className="text-sm font-extrabold text-blue-900 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-700" />
                Call 1915 or SMS to 8800001915
              </p>
              <p className="text-slate-600">
                Available 8:00 AM to 8:00 PM on all national working days (Hindi & English).
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-blue-950 uppercase tracking-wider block">
                🌐 Online NCH Grievance Portal:
              </span>
              <a
                href="https://consumerhelpline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg text-xs transition shadow-sm"
              >
                <span>Visit consumerhelpline.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-slate-600">
                Register online to track company response with official NCH Docket Number.
              </p>
            </div>
          </div>
        </div>

        {/* TIER 3: CONSUMER COURT FILING (E-JAGRITI, FORMERLY E-DAAKHIL) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-extrabold text-xs">
              3
            </span>
            <div>
              <h5 className="font-extrabold text-lg text-slate-900">
                Tier 3: File Online in Consumer Court (e-Jagriti, formerly e-Daakhil)
              </h5>
              <p className="text-xs text-slate-500">
                Unified 2025 Portal for Statutory Filing before District Consumer Disputes Redressal Commission
              </p>
            </div>
          </div>

          {/* Key Highlight Banner */}
          <div className="bg-emerald-50 border-2 border-emerald-500/80 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-extrabold text-emerald-950">
                Zero Court Fee Required for Claims up to ₹5,00,000 (Rs 5 Lakhs)!
              </span>
            </div>
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
              No Lawyer Mandatory
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p className="font-semibold text-slate-900">
              {edaakhil_guidance}
            </p>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider block">
                Quick Steps to File on e-Jagriti (formerly e-Daakhil):
              </span>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
                <li>Register as a Citizen on <strong>e-jagriti.gov.in</strong> using Aadhaar / mobile OTP.</li>
                <li>Upload PDF of your transaction invoice, customer support emails, and Tier 1 Legal Notice copy.</li>
                <li>Submit to your local District Commission (Jurisdiction where consumer resides or where office is located).</li>
              </ol>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <a
              href="https://e-jagriti.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-7 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-xs sm:text-sm"
            >
              <span>Proceed to e-Jagriti Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
