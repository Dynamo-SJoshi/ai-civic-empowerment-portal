import React, { useState } from 'react';
import { Copy, Check, Download, AlertTriangle, CreditCard, ExternalLink, RefreshCw, FileCheck2, ShieldAlert } from 'lucide-react';
import { generateRTIPdf } from '../utils/pdfGenerator';

export const ExportView = ({ formattedText, department, rawInput, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const characterCount = formattedText ? formattedText.length : 0;
  const isOverLimit = characterCount > 3000;

  const handleCopy = async () => {
    if (isOverLimit) return;
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownloadPDF = () => {
    const filename = generateRTIPdf(formattedText, department.name);
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Result Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-xl font-bold text-white">AI RTI Formatting Complete</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Formatted for: <strong className="text-amber-400 font-semibold">{department.name}</strong> ({department.code})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
              isOverLimit 
                ? 'bg-purple-900/60 text-purple-200 border-purple-500/50' 
                : 'bg-emerald-900/60 text-emerald-200 border-emerald-500/50'
            }`}>
              {characterCount.toLocaleString()} / 3,000 Chars
            </span>

            <button
              onClick={onReset}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Edit Request
            </button>
          </div>
        </div>

        {/* Character Count Alert Banner */}
        {isOverLimit ? (
          <div className="mt-6 bg-purple-950/80 border border-purple-600/60 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-purple-200">Character Limit Exceeded ({characterCount.toLocaleString()} Chars)</h4>
              <p className="text-xs text-purple-300 mt-1">
                The central RTI online text area only permits up to 3,000 characters. Per validation logic, a <strong>downloadable PDF application</strong> has been prepared for attachment.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              Formatted text is under 3,000 characters. You may copy directly or download as PDF.
            </span>
          </div>
        )}
      </div>

      {/* Formatted Output Display */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Official RTI Request Document
          </span>

          <div className="flex items-center gap-3">
            {/* Copy Button (Only for text <= 3,000 chars) */}
            {!isOverLimit ? (
              <button
                onClick={handleCopy}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow transition flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            ) : (
              <span className="text-xs text-slate-500 italic bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300">
                Copy disabled (&gt;3,000 chars - Use PDF)
              </span>
            )}

            {/* PDF Generation & Download Button */}
            <button
              onClick={handleDownloadPDF}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                isOverLimit 
                  ? 'bg-purple-700 hover:bg-purple-800 text-white shadow-lg animate-bounce'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              {pdfDownloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF Document</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Text Area / Code Box */}
        <div className="p-6 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto max-h-[450px] whitespace-pre-wrap select-all">
          {formattedText}
        </div>
      </div>

      {/* MANDATORY CIVIC INSTRUCTIONS & WARNING BOXES */}
      <div className="space-y-4">
        <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          Mandatory Portal Filing Instructions & Civic Warnings
        </h4>

        {/* 1. High-Visibility Privacy Warning Box */}
        <div className="bg-amber-50 border-2 border-amber-400/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="text-base font-bold text-amber-950 uppercase tracking-wide">
                Privacy Warning
              </h5>
              <p className="text-sm font-semibold text-amber-900 leading-relaxed">
                Do NOT upload your Aadhaar Card or PAN Card to the portal. Only attach a BPL (Below Poverty Line) card if claiming a fee exemption.
              </p>
            </div>
          </div>
        </div>

        {/* 2. High-Visibility Payment Warning Box */}
        <div className="bg-blue-50 border-2 border-blue-400/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="text-base font-bold text-blue-950 uppercase tracking-wide">
                Payment Warning
              </h5>
              <p className="text-sm font-semibold text-blue-900 leading-relaxed">
                After paying on the official portal, if your registration number doesn't generate immediately, wait 24-48 working hours. Do not pay again. For issues, contact <a href="mailto:helprtionline-dopt@nic.in" className="underline text-blue-800 hover:text-blue-950 font-bold">helprtionline-dopt@nic.in</a>.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Final External Link Button */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h5 className="text-base font-bold text-slate-900">Ready to Submit Your Application?</h5>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            You will be redirected to the official Central RTI Portal (DoPT, Government of India).
          </p>
        </div>

        <a
          href="https://rtionline.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-center text-sm"
        >
          <span>Proceed to rtionline.gov.in</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
};
