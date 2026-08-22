import { sanitizeInput } from './sanitizer';
import { executeGeminiRequestWithKeyStack } from './geminiKeyStack';
import schemesDatabase from '../data/schemes_db.json';

/**
 * Live Government Scheme Search & Real-Time Web Grounding Utility.
 * 
 * 1. Queries Gemini 3.6 Flash API sequentially using 6-key API failover stack to fetch live scheme data.
 * 2. Caches live results in localStorage for offline availability.
 */
export const searchLiveGovernmentSchemes = async (userPrompt) => {
  const liveSystemPrompt = `You are a real-time Government Welfare Scheme Finder. The user will describe their demographic background, income, age, category, or needs. 
  You MUST search live official Government of India portals (myscheme.gov.in, india.gov.in, scholarships.gov.in, pmkisan.gov.in, nha.gov.in, startupindia.gov.in) to identify current, active schemes.
  Return a JSON array of objects with keys:
  1) 'id': unique string
  2) 'name': official scheme name
  3) 'category': scheme category (Education, Healthcare, Agriculture, Livelihood, Financial, Startup)
  4) 'department': Central Ministry or State Department
  5) 'description': clear 2-sentence summary of benefits
  6) 'eligibility': object with { min_age, max_age, max_annual_income_inr, eligible_categories: [], applicable_states: [] }
  7) 'required_documents': array of mandatory document strings
  8) 'official_portal_url': direct official .gov.in application URL`;

  const result = await executeGeminiRequestWithKeyStack(async (apiKey) => {
    const isAIStudioKey = apiKey.startsWith('AIza');
    const headers = { 'Content-Type': 'application/json' };
    
    if (!isAIStudioKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const url = isAIStudioKey
      ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`
      : `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`;

    return fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${liveSystemPrompt}\n\nUser Background Prompt: "${userPrompt}"` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      })
    });
  });

  if (result.ok && result.data) {
    const rawJsonStr = result.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawJsonStr) {
      try {
        const parsed = JSON.parse(rawJsonStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          try {
            localStorage.setItem('cached_live_schemes', JSON.stringify(parsed));
            localStorage.setItem('cached_schemes_timestamp', new Date().toISOString());
          } catch (e) {
            console.warn('LocalStorage save error:', e);
          }
          return {
            source: 'LIVE_WEB_SYNC',
            schemes: parsed
          };
        }
      } catch (e) {
        console.warn('JSON parsing error in live scheme search:', e);
      }
    }
  }

  // Fallback to local schemes database
  return {
    source: 'OFFLINE_DATABASE',
    schemes: null
  };
};
