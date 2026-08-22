import React, { useState, useEffect, useRef } from 'react';
import schemesDatabase from '../data/schemes_db.json';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speechRecognition';
import { sanitizeInput } from '../utils/sanitizer';
import { evaluateEligibility } from '../utils/geminiMatcher';
import { SchemeResults } from './SchemeResults';
import { 
  Search, Mic, MicOff, Sparkles, ArrowLeft, ExternalLink, 
  CheckCircle2, BookOpen, HeartPulse, Sprout, Landmark, 
  FileCheck, ShieldCheck, AlertCircle, RefreshCw, Layers, Globe, Zap
} from 'lucide-react';

export const SchemeReader = ({ onBackToDashboard }) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const recognizerRef = useRef(null);

  useEffect(() => {
    setSpeechSupported(isSpeechRecognitionSupported());
  }, []);

  const [speechError, setSpeechError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Web Speech API Toggle
  const toggleListening = () => {
    setSpeechError(null);
    setValidationError(null);

    if (!speechSupported) {
      setSpeechError('Speech recognition is not supported in this browser. Please type your details in the text box.');
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
          setUserPrompt(prev => {
            const combined = prev ? `${prev} ${transcript}` : transcript;
            return sanitizeInput(combined);
          });
        },
        onError: (errObj) => {
          console.warn('Speech recognition error:', errObj);
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

  // Quick-fill Tag Chips
  const handleTagClick = (tagText) => {
    setValidationError(null);
    setUserPrompt(prev => {
      const cleanPrev = prev.trim();
      if (!cleanPrev) return tagText;
      if (cleanPrev.toLowerCase().includes(tagText.toLowerCase())) return prev;
      return `${cleanPrev}, ${tagText}`;
    });
  };

  // Run Gemini Evaluation Engine
  const runEvaluation = async (promptToRun) => {
    if (!promptToRun.trim()) {
      setValidationError('Please describe your background in the text box before checking eligibility.');
      return;
    }

    if (isListening && recognizerRef.current) {
      recognizerRef.current.stop();
      setIsListening(false);
    }

    setIsAnalyzing(true);

    try {
      const result = await evaluateEligibility(promptToRun, schemesDatabase);
      setEvaluationResult(result);
    } catch (err) {
      console.error('Error during scheme evaluation:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCheckEligibility = () => {
    runEvaluation(userPrompt);
  };

  // Conversational Follow-Up Update
  const handleUpdateProfile = (additionalText) => {
    const updatedPrompt = `${userPrompt}, ${additionalText}`;
    setUserPrompt(updatedPrompt);
    runEvaluation(updatedPrompt);
  };

  const handleReset = () => {
    setUserPrompt('');
    setEvaluationResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Back Navigation */}
      <div className="mb-6">
        <button
          onClick={onBackToDashboard}
          className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-semibold flex items-center gap-1.5 mb-3 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Main Dashboard
        </button>

        {/* HEADER & GUIDANCE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                CIVIC BENEFIT FINDER & AI REASONING ENGINE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Government Scheme Eligibility Finder
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Describe your background in simple words, and AI will identify schemes you qualify for.
            </p>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 shrink-0 hidden sm:block">
            <Layers className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* DYNAMIC INTAKE FORM */}
      {!evaluationResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <label className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-600" />
                Describe Your Profile & Background
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Include details like age, student status, family income, category (SC/ST/OBC/General), or occupation.
              </p>
            </div>

            {/* VOICE INPUT BUTTON */}
            <button
              type="button"
              onClick={toggleListening}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse border border-red-500'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Listening... Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>🎤 Voice Input</span>
                </>
              )}
            </button>
          </div>

          {/* LARGE MULTILINE TEXTAREA */}
          <div>
            <textarea
              rows={6}
              value={userPrompt}
              onChange={(e) => setUserPrompt(sanitizeInput(e.target.value))}
              placeholder="e.g., I am a 19-year-old student from an OBC family with an annual income around 2 Lakhs. What scholarship or education benefits can I get?"
              className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 text-slate-900 text-sm rounded-xl p-4 leading-relaxed transition font-sans"
            />
            {isListening && (
              <div className="mt-2 bg-red-50 text-red-700 border border-red-200 p-2.5 rounded-lg text-xs flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span>Microphone active: Speak your background into the microphone...</span>
              </div>
            )}
          </div>

          {/* QUICK-FILL TAG CHIPS */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Tap Quick Details to Add:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "College Student",
                "Family Income < ₹2.5L",
                "OBC/SC/ST",
                "Health Support",
                "Small Farmer / Landholder",
                "Street Vendor / Trader",
                "Girl Child / Daughter"
              ].map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200 hover:border-indigo-300 text-xs px-3.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1"
                >
                  <span>+ {tag}</span>
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

          {/* ACTION BUTTON WITH ACTIVE LOADING SPINNER */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleCheckEligibility}
              disabled={!userPrompt.trim() || isAnalyzing}
              className={`w-full sm:w-auto font-bold py-3.5 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-2.5 text-sm ${
                !userPrompt.trim() || isAnalyzing
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Analyzing eligibility criteria...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Check My Eligibility</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* RESULTS DISPLAY: ACTION PLAN DASHBOARD */}
      {evaluationResult && (
        <SchemeResults
          results={evaluationResult}
          userPrompt={userPrompt}
          onUpdateProfile={handleUpdateProfile}
          onReset={handleReset}
        />
      )}

    </div>
  );
};
