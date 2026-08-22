import React, { useState, useEffect } from 'react';
import { CENTRAL_DEPARTMENTS, SAMPLE_TEMPLATES } from '../data/departments';
import { sanitizeInput, hasInvalidChars } from '../utils/sanitizer';
import { ExportView } from './ExportView';
import { Building2, FileEdit, Sparkles, AlertCircle, CheckCircle2, ChevronRight, HelpCircle, FileText, ArrowLeft, ShieldAlert } from 'lucide-react';

export const RTIFormFiller = ({ onBackToDashboard }) => {
  // Form Steps: 1 = Department, 2 = Grievance, 3 = Formatting/Result
  const [step, setStep] = useState(1);
  const [selectedDeptId, setSelectedDeptId] = useState(CENTRAL_DEPARTMENTS[0].id);
  const [customDeptName, setCustomDeptName] = useState('');
  const [rawText, setRawText] = useState('');
  const [sanitizedWarning, setSanitizedWarning] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [formattingProgress, setFormattingProgress] = useState(0);
  const [formattedText, setFormattedText] = useState('');

  const selectedDepartment = CENTRAL_DEPARTMENTS.find(d => d.id === selectedDeptId) || CENTRAL_DEPARTMENTS[0];
  
  const effectiveDeptName = selectedDeptId === 'none' && customDeptName.trim()
    ? customDeptName.trim()
    : (selectedDeptId === 'none' ? 'Central Government Authority (Custom)' : selectedDepartment.name);

  // Real-time character count
  const characterCount = rawText.length;
  const maxLimit = 3000;
  const isOverLimit = characterCount > maxLimit;

  // Handle Input Change with strict character sanitization
  const handleTextChange = (e) => {
    const inputValue = e.target.value;
    
    // Check if input contained unsanitized chars (quotes, emojis, etc.)
    if (hasInvalidChars(inputValue)) {
      setSanitizedWarning(true);
      setTimeout(() => setSanitizedWarning(false), 3500);
    }

    // Automatically strip quotes, emojis, and unsupported characters
    const cleanValue = sanitizeInput(inputValue);
    setRawText(cleanValue);
  };

  // Load sample template into textarea
  const handleSelectTemplate = (templateText) => {
    const cleanTemplate = sanitizeInput(templateText);
    setRawText(cleanTemplate);
  };

  // AI Formatting Simulation
  const handleFormatForPortal = () => {
    if (!rawText.trim()) return;

    setIsFormatting(true);
    setFormattingProgress(15);

    // Simulate AI legal formatting steps
    const timer1 = setTimeout(() => setFormattingProgress(45), 400);
    const timer2 = setTimeout(() => setFormattingProgress(75), 800);
    const timer3 = setTimeout(() => {
      setFormattingProgress(100);
      
      // Structure formal legal RTI request
      const formatted = generateRTIFormat(rawText, effectiveDeptName, selectedDepartment.code);
      setFormattedText(formatted);
      setIsFormatting(false);
      setStep(3);
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  // Generate structured legal RTI output compliant with RTI Act 2005
  const generateRTIFormat = (input, deptName, deptCode) => {
    const sanitizedInput = sanitizeInput(input);
    const todayStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const output = `APPLICATION FOR SEEKING INFORMATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

To:
The Central Public Information Officer (CPIO)
${deptName}
Government of India
[Department Code / Section: ${deptCode}]

Date: ${todayStr}

Subject: Request for Official Information under Section 6(1) of the RTI Act, 2005.

Sir / Madam,

I am a citizen of India requesting the following specific public information under Section 6(1) of the Right to Information Act, 2005:

----------------------------------------------------------------------
PARTICULARS OF INFORMATION REQUESTED:
----------------------------------------------------------------------
${sanitizedInput}

----------------------------------------------------------------------
STATUTORY UNDERTAKINGS & DECLARATIONS:
----------------------------------------------------------------------
1. I state that the information sought above falls within the public domain and does not fall under any exemptions specified under Section 8 or 9 of the RTI Act, 2005.
2. I am a Citizen of India and my identity particulars are available as required under Section 3 of the Act.
3. Fee Details: Prescribed RTI Application fee of Rs.10 has been paid online via the Central RTI Portal (rtionline.gov.in) payment gateway.
4. Mode of Reply: Please transmit the requested certified records/information electronically to my portal account or by speed post.

Yours faithfully,
[Applicant Name Placeholder]
[Contact Email / Mobile Placeholder]
[Postal Address Placeholder]`;

    // Ensure strict final character sanitization
    return sanitizeInput(output);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Navigation & Step Indicator */}
      <div className="mb-8">
        <button
          onClick={onBackToDashboard}
          className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-semibold flex items-center gap-1.5 mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Main Dashboard
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-700" />
              RTI Form Filler (Central Government)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Draft, sanitize, and format your RTI request for central ministries
            </p>
          </div>

          {/* Stepper pills */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 border ${
              step === 1 
                ? 'bg-blue-700 text-white border-blue-700 shadow-sm' 
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <span>1. Department</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 border ${
              step === 2 
                ? 'bg-blue-700 text-white border-blue-700 shadow-sm' 
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <span>2. Grievance</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 border ${
              step === 3 
                ? 'bg-blue-700 text-white border-blue-700 shadow-sm' 
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <span>3. Export</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: Central Department Routing */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <label className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-700" />
                Step 1: Select Target Central Authority
              </label>

              {/* STRICT MANDATORY LABEL */}
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                (Central Government Authorities Only)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600">
              Select the Central Government Ministry, Public Department, or Commission to which your RTI application will be addressed.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Target Public Authority Dropdown:
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3.5 font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
              >
                {CENTRAL_DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} [{dept.code}] — {dept.portalSection}
                  </option>
                ))}
              </select>
            </div>

            {selectedDeptId === 'none' && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Specify Central Authority Name (Manually Type):
                </label>
                <input
                  type="text"
                  value={customDeptName}
                  onChange={(e) => setCustomDeptName(sanitizeInput(e.target.value))}
                  placeholder="e.g. Central Vigilance Commission (CVC) or Specific Authority Name"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
                />
              </div>
            )}

            {/* Department Summary Card */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Targeted Authority Selected
                </h4>
                <p className="text-sm font-bold text-blue-900 mt-0.5">
                  {effectiveDeptName}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Section / Sub-unit: {selectedDepartment.portalSection} | Department Code: {selectedDepartment.code}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm"
            >
              <span>Continue to Step 2: Request Drafting</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: The Grievance/Question Input */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <label className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-blue-700" />
                Step 2: Type Your Grievance / Question
              </label>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Describe clearly what information, files, or certified records you wish to request.
              </p>
            </div>

            {/* LIVE CHARACTER COUNTER */}
            <div className="shrink-0 flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                isOverLimit 
                  ? 'bg-purple-100 text-purple-800 border-purple-300' 
                  : characterCount > 2500 
                  ? 'bg-amber-100 text-amber-800 border-amber-300' 
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                {characterCount.toLocaleString()} / {maxLimit.toLocaleString()} chars
              </span>
            </div>
          </div>

          {/* Quick Template Prompts */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Quick Starting Templates (Optional):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl.text)}
                  className="text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 p-3 rounded-xl transition text-xs font-medium text-slate-700 hover:text-blue-900"
                >
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    {tmpl.title}
                  </div>
                  <div className="line-clamp-2 text-slate-500 text-[11px]">
                    {tmpl.text}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sanitization Warning Toast */}
          {sanitizedWarning && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl p-3 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Sanitization Notice:</strong> Quotes, emojis, or unsupported special characters were automatically removed per strict portal rules.
              </span>
            </div>
          )}

          {/* TEXTAREA WITH STRICT CHARACTER SANITIZATION */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-semibold text-slate-700">Request Text Box:</span>
              <span className="font-mono text-[11px] text-slate-400">
                Allowed: A-Z, a-z, 0-9, , . - _ ( ) / @ : & ? \ %
              </span>
            </div>
            <textarea
              rows={8}
              value={rawText}
              onChange={handleTextChange}
              placeholder="Type your request points clearly (e.g. 1. Provide progress report of application dated... 2. Provide certified copies of notings...)"
              className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl p-4 font-mono leading-relaxed focus:ring-2 transition ${
                isOverLimit 
                  ? 'border-purple-400 focus:ring-purple-500 bg-purple-50/30' 
                  : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'
              }`}
            />
          </div>

          {/* Over Limit PDF Notice */}
          {isOverLimit && (
            <div className="bg-purple-50 border border-purple-300 text-purple-900 rounded-xl p-4 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-purple-950">Notice: Over 3,000 Characters ({characterCount.toLocaleString()})</h5>
                <p className="mt-0.5 text-purple-800">
                  The central online portal text box limits input to 3,000 characters. When formatted, Rights Navigator will automatically generate a downloadable PDF for portal attachment.
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setStep(1)}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-5 rounded-xl transition text-xs"
            >
              ← Back to Step 1
            </button>

            {/* STEP 3 AI DRAFTING SIMULATION BUTTON */}
            <button
              onClick={handleFormatForPortal}
              disabled={!rawText.trim() || isFormatting}
              className={`w-full sm:w-auto font-bold py-3.5 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-2.5 text-sm ${
                !rawText.trim() 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-blue-700/20'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Format for RTI Portal</span>
            </button>
          </div>

          {/* Loading Overlay during AI formatting simulation */}
          {isFormatting && (
            <div className="mt-6 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-blue-300">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
                  Simulating AI Legal Framing & Formatting...
                </span>
                <span className="font-mono">{formattingProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-amber-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${formattingProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 text-center italic">
                Applying RTI Act 2005 legal preamble, CPIO routing for {effectiveDeptName}, and character sanitization rules...
              </p>
            </div>
          )}

        </div>
      )}

      {/* STEP 3: Export and Warnings View */}
      {step === 3 && (
        <ExportView
          formattedText={formattedText}
          department={selectedDepartment}
          rawInput={rawText}
          onReset={() => setStep(2)}
        />
      )}

    </div>
  );
};
