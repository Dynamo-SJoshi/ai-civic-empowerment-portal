import React, { useEffect } from 'react';
import { Languages } from 'lucide-react';

export const GoogleTranslate = () => {
  useEffect(() => {
    // Define initialization callback
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'hi,bn,te,mr,ta,ur,gu,kn,ml,pa,or,as,mai,sa,doi,gom,mni-Mtei,lus,ne,sat,sd,en',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Check if script is already added
    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <div className="flex items-center gap-2 bg-slate-800/90 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition shadow-sm">
      <Languages className="w-4 h-4 text-amber-400 shrink-0" />
      <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">Translate:</span>
      <div id="google_translate_element" className="google-translate-container"></div>
    </div>
  );
};
