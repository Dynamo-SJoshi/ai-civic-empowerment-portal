import React, { useState, useEffect, useRef } from 'react';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speechRecognition';
import { sanitizeInput } from '../utils/sanitizer';
import { analyzeDispute } from '../utils/consumerDisputeEngine';
import { DisputeResults } from './DisputeResults';
import { 
  ShieldAlert, Search, Mic, MicOff, Sparkles, ArrowLeft, 
  Scale, RefreshCw, ShoppingBag, Truck, Wrench, Plane, CreditCard, Landmark
} from 'lucide-react';

export const RightsNavigator = ({ onBackToDashboard }) => {
  const [userNarrative, setUserNarrative] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [disputeResult, setDisputeResult] = useState(null);

  const recognizerRef = useRef(null);

  useEffect(() => {
    setSpeechSupported(isSpeechRecognitionSupported());
  }, []);

  const [speechError, setSpeechError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Speech Recognition Toggle
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
          setUserNarrative(prev => {
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

  // Quick-Select Tag Chips
  const handleTagClick = (tagText) => {
    setValidationError(null);
    setUserNarrative(prev => {
      const cleanPrev = prev.trim();
      if (!cleanPrev) return tagText;
      if (cleanPrev.toLowerCase().includes(tagText.toLowerCase())) return prev;
      return `${cleanPrev}, ${tagText}`;
    });
  };

  // Submit & Analyze Dispute Narrative
  const handleAnalyzeDispute = async () => {
    if (!userNarrative.trim()) {
      setValidationError('Please describe your consumer grievance in the text box before analyzing.');
      return;
    }

    if (isListening && recognizerRef.current) {
      recognizerRef.current.stop();
      setIsListening(false);
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeDispute(userNarrative);
      setDisputeResult(result);
    } catch (err) {
      console.error('Error analyzing consumer dispute:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUserNarrative('');
    setDisputeResult(null);
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
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-amber-700" />
                CONSUMER PROTECTION ACT, 2019
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Consumer Dispute Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Resolve grievances with brands, e-commerce sellers, and service providers. Build pre-litigation legal notices & court filings.
            </p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 shrink-0 hidden sm:block">
            <ShoppingBag className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* INTAKE FORM */}
      {!disputeResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <label className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Describe What Went Wrong
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Include company name, product/service purchased, defect/issue, amount paid, and customer support response.
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
                  <span>🎙️ Voice Input</span>
                </>
              )}
            </button>
          </div>

          {/* TEXTAREA */}
          <div>
            <textarea
              rows={6}
              value={userNarrative}
              onChange={(e) => setUserNarrative(sanitizeInput(e.target.value))}
              placeholder="e.g., I bought a laptop worth ₹45,000 from XYZ Retailer. The motherboard stopped working within 2 months under warranty. The service center refuses repair claiming unauthorized modification, which is false."
              className="w-full bg-slate-50 border border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500 text-slate-900 text-sm rounded-xl p-4 leading-relaxed transition font-sans"
            />
            {isListening && (
              <div className="mt-2 bg-red-50 text-red-700 border border-red-200 p-2.5 rounded-lg text-xs flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span>Microphone active: Speak your complaint into the microphone...</span>
              </div>
            )}
          </div>

          {/* QUICK-SELECT DISPUTE CATEGORIES */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Dispute Categories:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "E-Commerce Delivery",
                "Defective Appliance/Gadget",
                "Warranty Denial",
                "Flight/Travel Refund",
                "Unfair Subscription Charge"
              ].map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 text-xs px-3.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1"
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
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
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
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* PRIMARY ACTION BUTTON */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleAnalyzeDispute}
              disabled={!userNarrative.trim() || isAnalyzing}
              className={`w-full sm:w-auto font-bold py-3.5 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-2.5 text-sm ${
                !userNarrative.trim() || isAnalyzing
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 text-white animate-spin" />
                  <span>Analyzing CPA 2019 Rights & Drafting Notice...</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  <span>Analyze My Rights & Build Action Plan</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* RESULTS ESCALATION DASHBOARD */}
      {disputeResult && (
        <DisputeResults
          results={disputeResult}
          userNarrative={userNarrative}
          onReset={handleReset}
        />
      )}

    </div>
  );
};
