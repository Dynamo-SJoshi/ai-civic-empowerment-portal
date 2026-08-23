import React, { useState, useEffect, useRef } from 'react';
import { sanitizeInput, hasInvalidChars } from '../utils/sanitizer';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speechRecognition';
import { generateFilingPlan } from '../utils/geminiApi';
import { ExportView } from './ExportView';
import { RTIProcessGuide } from './RTIProcessGuide';
import { CENTRAL_DEPARTMENTS } from '../data/departments';
import { Mic, MicOff, Sparkles, Building2, ListChecks, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, FileText, Check, ShieldAlert, Play, ExternalLink, ChevronDown, Edit3 } from 'lucide-react';

export const AIGuidedFiling = ({ onBackToDashboard }) => {
  // Input State
  const [userStory, setUserStory] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [sanitizerNotice, setSanitizerNotice] = useState(false);

  // AI Loading & Result State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null); // { department, filing_plan, rti_draft }

  // Action Plan Checklist State
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);
  const [isDeptConfirmed, setIsDeptConfirmed] = useState(true);
  const [selectedDeptName, setSelectedDeptName] = useState('');
  const [showAuthorityOverride, setShowAuthorityOverride] = useState(false);
  const [customDeptInput, setCustomDeptInput] = useState('');

  const recognizerRef = useRef(null);

  useEffect(() => {
    setSpeechSupported(isSpeechRecognitionSupported());
  }, []);

  const [speechError, setSpeechError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Web Speech API Microphone Toggle
  const toggleListening = () => {
    setSpeechError(null);
    setValidationError(null);

    if (!speechSupported) {
      setSpeechError('Speech recognition is not supported in this browser. Please type your story in the text area.');
      return;
    }

    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
    } else {
      const recognizer = createSpeechRecognizer({
        onResult: (transcript) => {
          setUserStory(prev => {
            const combined = prev ? `${prev} ${transcript}` : transcript;
            return sanitizeInput(combined);
          });
        },
        onError: (errObj) => {
          console.warn('Speech error:', errObj);
          setSpeechError(errObj?.message || 'Microphone access was denied or unavailable.');
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });

      if (recognizer) {
        recognizerRef.current = recognizer;
        try {
          recognizer.start();
          setIsListening(true);
        } catch (e) {
          console.error(e);
          setSpeechError('Failed to start microphone. Please check browser permissions.');
          setIsListening(false);
        }
      }
    }
  };

  // Textarea input handler with strict character sanitization
  const handleStoryChange = (e) => {
    setValidationError(null);
    const rawVal = e.target.value;
    if (hasInvalidChars(rawVal)) {
      setSanitizerNotice(true);
      setTimeout(() => setSanitizerNotice(false), 3000);
    }
    setUserStory(sanitizeInput(rawVal));
  };

  // Submit & Call AI Processing Logic
  const handleGeneratePlan = async () => {
    if (!userStory.trim()) {
      setValidationError('Please describe your issue in the text box before generating a filing plan.');
      return;
    }

    if (isListening && recognizerRef.current) {
      recognizerRef.current.stop();
      setIsListening(false);
    }

    setIsLoading(true);
    setLoadingStep(1);

    const stepTimer1 = setTimeout(() => setLoadingStep(2), 600);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 1200);

    try {
      const aiResult = await generateFilingPlan(userStory);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      setResult(aiResult);
      setSelectedDeptName(aiResult.department);
      setIsDeptConfirmed(true);
      setShowAuthorityOverride(false);
      setCompletedSteps([false, false, false]);
      setIsLoading(false);
    } catch (err) {
      console.error('AI Generation Error:', err);
      setIsLoading(false);
    }
  };

  const handleOverrideDepartment = (deptName) => {
    if (deptName === 'custom') {
      if (customDeptInput.trim()) {
        const cleanCustom = sanitizeInput(customDeptInput.trim());
        setSelectedDeptName(cleanCustom);
        updateDraftDepartment(cleanCustom);
      }
    } else {
      setSelectedDeptName(deptName);
      updateDraftDepartment(deptName);
    }
    setIsDeptConfirmed(true);
  };

  const updateDraftDepartment = (newDeptName) => {
    if (!result || !result.rti_draft) return;
    // Dynamically replace department addressee lines in the draft
    const updatedDraft = result.rti_draft.replace(
      /The Central Public Information Officer \(CPIO\)\n[^\n]+\nGovernment of India/g,
      `The Central Public Information Officer (CPIO)\n${newDeptName}\nGovernment of India`
    );
    setResult(prev => ({
      ...prev,
      department: newDeptName,
      rti_draft: updatedDraft
    }));
  };

  const toggleChecklistStep = (index) => {
    setCompletedSteps(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleReset = () => {
    setResult(null);
    setUserStory('');
    setCompletedSteps([false, false, false]);
    setShowAuthorityOverride(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Navigation & Back Button */}
      <div className="mb-4">
        <button
          onClick={onBackToDashboard}
          className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Main Dashboard
        </button>
      </div>

      {/* TOP REDIRECT BANNER: RTI FORM TUTORIAL VIDEO */}
      <div className="mb-6 bg-gradient-to-r from-red-900/95 via-slate-900 to-red-950 text-white rounded-2xl p-4 sm:p-5 border border-red-800/60 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold bg-red-500/30 text-red-300 border border-red-400/30 px-2 py-0.5 rounded uppercase tracking-wider">
                Video Guide
              </span>
              <span className="text-xs text-slate-300">1-Min Quick Tutorial</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
              How to Fill Up the RTI Form (Official Portal Walkthrough)
            </h4>
          </div>
        </div>

        <a
          href="https://youtube.com/shorts/1nXRsjMHteQ?si=X-a9pms_4ISqT4H_"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 shadow-md border border-red-500/50"
        >
          <span>Watch Tutorial Video</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Title Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            AI Guided RTI Filing Assistant
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Explain your issue in plain words or by voice. AI routes the authority, creates an action plan, and drafts your RTI.
          </p>
        </div>

        <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Gemini Civic Intelligence Enabled
        </span>
      </div>

      {/* VIEW 1: VOICE & TEXT INPUT UI ("Tell us your issue.") */}
      {!result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                Tell us your issue.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Describe what happened, any delayed service, or official information you need.
              </p>
            </div>

            {/* PROMINENT "SPEAK TO EXPLAIN" BUTTON */}
            <button
              type="button"
              onClick={toggleListening}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 shadow-sm ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse border border-red-500'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Listening... Click to Stop</span>
                </>
              ) : (
                <>
                  <span>🎙️ Speak to Explain</span>
                </>
              )}
            </button>
          </div>

          {/* Sample Prompts */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Sample Stories:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "My train ticket refund for PNR 4820193810 is pending for over 45 days despite cancellation.",
                "BSNL broadband line in locality has been down for 2 weeks with no technician response.",
                "Filed loan subsidy grievance with SBI bank 3 months ago but no action taken report provided.",
                "Passport reissue application submitted on May 10th still showing under review at RPO."
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUserStory(sanitizeInput(sample))}
                  className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200 hover:border-blue-300 text-xs px-3 py-1.5 rounded-lg transition font-medium text-left"
                >
                  "{sample.substring(0, 45)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Speech & Validation Error Banners */}
          {speechError && (
            <div className="bg-red-50 text-red-800 border border-red-200 p-3.5 rounded-xl text-xs flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{speechError}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setSpeechError(null)}
                className="text-xs font-bold text-red-700 hover:text-red-900 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {validationError && (
            <div className="bg-amber-50 text-amber-900 border border-amber-300 p-3.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Sanitizer Notice */}
          {sanitizerNotice && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Sanitization: Unsupported symbols or quotes were automatically stripped.</span>
            </div>
          )}

          {/* TEXTAREA FOR USER STORY */}
          <div className="relative">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-semibold text-slate-700">Describe Your Problem / Story:</span>
              <span className="font-mono text-[11px] text-slate-400">
                {userStory.length} characters typed
              </span>
            </div>

            <textarea
              rows={8}
              value={userStory}
              onChange={handleStoryChange}
              placeholder="e.g. I booked a train ticket via IRCTC on June 12th. The train was cancelled by railways due to maintenance. I applied for TDR refund immediately, but Rs 1,450 has not been credited to my bank account..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-slate-900 text-sm rounded-xl p-4 font-sans leading-relaxed transition"
            />

            {isListening && (
              <div className="mt-2 bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-lg flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span>Microphone active: Speak clearly into your microphone...</span>
              </div>
            )}
          </div>

          {/* GENERATE FILING PLAN BUTTON */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleGeneratePlan}
              disabled={!userStory.trim() || isLoading}
              className={`w-full sm:w-auto font-bold py-3.5 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-2.5 text-sm ${
                !userStory.trim()
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-blue-700/20'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Filing Plan</span>
            </button>
          </div>

          {/* AI PROCESSING LOADING STATE */}
          {isLoading && (
            <div className="mt-6 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-blue-300">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  Analyzing Civic Issue with Gemini AI Legal Assistant...
                </span>
                <span className="font-mono text-amber-400">Step {loadingStep} of 3</span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-amber-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(loadingStep / 3) * 100}%` }}
                ></div>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                {loadingStep >= 1 && <p>✓ Identifying responsible Central Government Public Authority...</p>}
                {loadingStep >= 2 && <p>✓ Structuring 3-step citizen action checklist...</p>}
                {loadingStep >= 3 && <p>✓ Drafting legal RTI request under Section 6(1) of RTI Act 2005...</p>}
              </div>
            </div>
          )}

        </div>
      )}

      {/* VIEW 2: DYNAMIC OUTPUT DISPLAY (3 SECTIONS) */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Top Reset Banner */}
          <div className="flex items-center justify-between bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold">AI Civic Analysis Complete</span>
            </div>

            <button
              onClick={handleReset}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Start New Query
            </button>
          </div>

          {/* SECTION 1: RECOMMENDED AUTHORITY (WITH BACKDOOR MANUAL OVERRIDE DROPDOWN) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider block">
                    Section 1: Recommended Public Authority
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                    Target: {selectedDeptName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Central Government Ministry designated for your grievance.
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS: CONFIRM OR BACKDOOR OVERRIDE */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsDeptConfirmed(!isDeptConfirmed)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 ${
                    isDeptConfirmed
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {isDeptConfirmed ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirmed</span>
                    </>
                  ) : (
                    <span>Confirm Target</span>
                  )}
                </button>

                {/* BACKDOOR OVERRIDE TOGGLE BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowAuthorityOverride(!showAuthorityOverride)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3.5 py-2.5 rounded-xl text-xs border border-slate-300 transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-700" />
                  <span>Change Authority</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* BACKDOOR OVERRIDE DROPDOWN SELECTOR */}
            {showAuthorityOverride && (
              <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Override Target Central Authority:
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    (Manual Backdoor Selection)
                  </span>
                </div>

                <select
                  value={selectedDeptName}
                  onChange={(e) => handleOverrideDepartment(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl p-3 font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                >
                  {CENTRAL_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name} [{dept.code}] — {dept.portalSection}
                    </option>
                  ))}
                </select>

                {(selectedDeptName === 'None / Other Department (Type Manually)' || selectedDeptName === 'Central Government Authority (Custom)' || selectedDeptName === 'custom') && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 animate-fadeIn">
                    <input
                      type="text"
                      value={customDeptInput}
                      onChange={(e) => setCustomDeptInput(sanitizeInput(e.target.value))}
                      placeholder="Manually type specific department name (e.g. CVC, NDMA)..."
                      className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:ring-2 focus:ring-blue-600 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => handleOverrideDepartment('custom')}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-3 rounded-xl text-xs shrink-0 shadow transition"
                    >
                      Apply Custom Name
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 2: YOUR ACTION PLAN (3-STEP CHECKLIST) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider block">
                Section 2: Your Action Plan
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-indigo-600" />
                3-Step Filing Checklist
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Follow these exact steps before submitting on the central portal:
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {result.filing_plan.map((stepText, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklistStep(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    completedSteps[idx]
                      ? 'bg-emerald-50/60 border-emerald-300 text-slate-800'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-900'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border mt-0.5 transition ${
                    completedSteps[idx]
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-slate-300 text-transparent'
                  }`}>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                      Step {idx + 1}
                    </span>
                    <p className={`text-sm font-medium leading-relaxed ${completedSteps[idx] ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                      {stepText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: RTI DRAFT (WITH STRICT FORMAT CONTAINER & WARNINGS) */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">
                Section 3: Formal Legal RTI Draft
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                RTI Application Text (RTI Act 2005 Compliant)
              </h3>
            </div>

            <ExportView
              formattedText={result.rti_draft}
              department={{ name: selectedDeptName, code: 'CENTRAL' }}
              rawInput={userStory}
              onReset={handleReset}
            />
          </div>

        </div>
      )}

      {/* Statutory RTI Process & Appeal Flowchart Guide */}
      <div className="mt-10">
        <RTIProcessGuide />
      </div>

    </div>
  );
};
