import React, { useState } from 'react';
import { HelpCircle, Clock, CheckCircle, AlertOctagon, Scale, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export const RTIProcessGuide = () => {
  const [openStep, setOpenStep] = useState(null);

  const toggleAccordion = (index) => {
    setOpenStep(openStep === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 my-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Scale className="w-3.5 h-3.5" />
          <span>Statutory Process Guide</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          Understanding the RTI Application & Appeal Timeline
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          A step-by-step citizen guide based on official provisions of the Right to Information Act, 2005.
        </p>
      </div>

      {/* Embedded Flowchart Image */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
        <span className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          Official Statutory Lifecycle Flowchart
        </span>
        <img
          src="/assets/rti_process_flowchart.png"
          alt="RTI Application Statutory Process Flowchart"
          className="max-w-full h-auto rounded-lg shadow-lg border border-slate-700 bg-white"
        />
      </div>

      {/* Plain English Timeline Breakdown */}
      <div className="space-y-4 pt-2">
        <h4 className="text-lg font-extrabold text-slate-900">
          Detailed Stage-by-Stage Explanation
        </h4>

        <div className="space-y-3">
          
          {/* Stage 1 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleAccordion(1)}
              className="w-full bg-slate-50 hover:bg-slate-100 p-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-mono font-bold">1</span>
                <span>Stage 1: Initial RTI Request (30 Days Limit)</span>
              </div>
              {openStep === 1 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            {(openStep === 1 || openStep === null) && (
              <div className="p-4 bg-white text-xs sm:text-sm text-slate-700 space-y-2 border-t border-slate-100">
                <p><strong>Timeline:</strong> The Public Information Officer (CPIO) MUST reply within <strong>30 days</strong> of receiving your request.</p>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded-r-md">
                  <p><strong>Outcomes:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-1 text-slate-700">
                    <li><strong className="text-emerald-700">Reply Received & Satisfied:</strong> Process completed cleanly!</li>
                    <li><strong className="text-amber-700">5-Day Department Transfer:</strong> If filed with wrong public authority, CPIO must transfer it within 5 days under Section 6(3). Target authority then gets 30 days.</li>
                    <li><strong className="text-red-700">No Reply / Not Satisfied:</strong> You have statutory right to file a First Appeal within 30 days.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Stage 2 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleAccordion(2)}
              className="w-full bg-slate-50 hover:bg-slate-100 p-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-mono font-bold">2</span>
                <span>Stage 2: First Appeal (Internal Departmental Review)</span>
              </div>
              {openStep === 2 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            {openStep === 2 && (
              <div className="p-4 bg-white text-xs sm:text-sm text-slate-700 space-y-2 border-t border-slate-100">
                <p><strong>Filing Window:</strong> File within <strong>30 days</strong> if no reply was received or if reply was unsatisfactory.</p>
                <p><strong>Decision Timeline:</strong> First Appellate Authority (FAA) must decide within <strong>30 days</strong> (extendable up to 45 days for special reasons).</p>
                <div className="bg-amber-50 border-l-4 border-amber-600 p-3 rounded-r-md">
                  <p><strong>Outcomes:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-1 text-slate-700">
                    <li><strong className="text-emerald-700">Satisfied:</strong> Order issued to CPIO to release records.</li>
                    <li><strong className="text-red-700">Not Satisfied or No Decision:</strong> Proceed to Second Appeal.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Stage 3 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleAccordion(3)}
              className="w-full bg-slate-50 hover:bg-slate-100 p-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-mono font-bold">3</span>
                <span>Stage 3: Second Appeal (Central / State Information Commission)</span>
              </div>
              {openStep === 3 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            {openStep === 3 && (
              <div className="p-4 bg-white text-xs sm:text-sm text-slate-700 space-y-2 border-t border-slate-100">
                <p><strong>Filing Window:</strong> Must be filed within <strong>90 days</strong> from First Appeal decision or expiry date.</p>
                <p><strong>Authority:</strong> Central Information Commission (CIC) for Central Govt or State Information Commission (SIC) for State Govt.</p>
                <p><strong>Powers:</strong> Can impose penalties up to Rs 25,000 on defaulting CPIO officers under Section 20 of RTI Act 2005.</p>
              </div>
            )}
          </div>

          {/* Stage 4 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleAccordion(4)}
              className="w-full bg-slate-50 hover:bg-slate-100 p-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-mono font-bold">4</span>
                <span>Alternative: Section 18 Direct Complaint to CIC</span>
              </div>
              {openStep === 4 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            {openStep === 4 && (
              <div className="p-4 bg-white text-xs sm:text-sm text-slate-700 space-y-2 border-t border-slate-100">
                <p>If a CPIO refuses to receive an RTI application, charges unreasonable fees, or deliberately provides false/misleading information, you can file a direct complaint under <strong>Section 18</strong> to the Information Commission.</p>
                <p><strong>Time Limit:</strong> No strict statutory time limit, but recommended as early as possible.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
