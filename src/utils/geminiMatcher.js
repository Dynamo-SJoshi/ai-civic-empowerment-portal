import { sanitizeInput } from './sanitizer';
import { executeGeminiRequestWithKeyStack } from './geminiKeyStack';

/**
 * Asynchronous function to evaluate scheme eligibility using Gemini AI matching engine.
 * 
 * @param {string} userProfileText - Transcribed user input or profile description
 * @param {Array} schemesDatabase - Array of scheme objects from schemes_db.json
 * @returns {Promise<{ eligible_schemes: Array, ineligible_schemes: Array, missing_info: Array, source: string }>}
 */
export const evaluateEligibility = async (userProfileText, schemesDatabase) => {
  const cleanPrompt = sanitizeInput(userProfileText);

  const systemInstruction = `You are an expert government scheme eligibility evaluator. Compare the user's profile against the provided JSON database of schemes. Return a strictly formatted JSON object with three exact keys:
  1) 'eligible_schemes': array of objects { 'id': string, 'name': string, 'department': string, 'qualification_reason': string } (schemes where the user meets all criteria, including scheme ID and plain-language summary of why they qualify)
  2) 'ineligible_schemes': array of objects { 'id': string, 'name': string, 'department': string, 'disqualification_reason': string } (schemes they fail to qualify for, with short reason)
  3) 'missing_info': array of strings (what critical data is missing like exact income, caste certificate, age, landholding, to make a full determination).`;

  const userContentPayload = `SCHEMES KNOWLEDGE BASE DATABASE:
${JSON.stringify(schemesDatabase, null, 2)}

USER PROFILE DESCRIPTION:
"${cleanPrompt}"`;

  try {
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
                { text: `${systemInstruction}\n\n${userContentPayload}` }
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
        const parsed = JSON.parse(rawJsonStr);
        if (parsed && (Array.isArray(parsed.eligible_schemes) || Array.isArray(parsed.ineligible_schemes))) {
          return {
            eligible_schemes: parsed.eligible_schemes || [],
            ineligible_schemes: parsed.ineligible_schemes || [],
            missing_info: parsed.missing_info || [],
            source: 'GEMINI_AI_ENGINE'
          };
        }
      }
    }
  } catch (err) {
    console.warn('Gemini evaluateEligibility call failed, using intelligent offline fallback matcher:', err);
  }

  // Fallback Rule Engine when API timeouts, keys are offline, or JSON parsing fails
  return fallbackEvaluateEligibility(cleanPrompt, schemesDatabase);
};

/**
 * Deterministic offline fallback matcher ensuring UI resilience.
 */
function fallbackEvaluateEligibility(userProfileText, schemesDatabase) {
  const textLower = userProfileText.toLowerCase();
  const hasDecentIncome = /\b(decent|good|high|well off|above 2.5|above 5|above 10)\b/i.test(textLower);
  const isStartupPrompt = /\b(startup|business|entrepreneur|venture|company|incubation|seed|fund|idea)\b/i.test(textLower);
  const isStudentPrompt = /\b(student|study|college|matric|scholarship|school|degree)\b/i.test(textLower);
  const isHealthPrompt = /\b(health|hospital|medical|treatment|ayushman|insurance|card)\b/i.test(textLower);
  const isFarmerPrompt = /\b(farmer|kisan|land|agriculture|khatoni|crop)\b/i.test(textLower);
  const isVendorPrompt = /\b(vendor|street|trader|svanidhi|shop)\b/i.test(textLower);
  const isGirlPrompt = /\b(girl|daughter|sukanya|female|child)\b/i.test(textLower);

  const eligible = [];
  const ineligible = [];
  const missingInfo = [];

  schemesDatabase.forEach(scheme => {
    // 1. Startup & Entrepreneurship Intent
    if (scheme.id === 'startup-india-seed-fund' || scheme.id === 'pm-mudra-yojana') {
      if (isStartupPrompt) {
        eligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          qualification_reason: `You indicated interest in starting a business/startup. This scheme offers incubation, seed capital, and collateral-free loans for early-stage ventures.`
        });
      } else {
        ineligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          disqualification_reason: `Your profile description did not indicate a new business setup or startup venture proposal.`
        });
      }
      return;
    }

    // 2. Education / Post-Matric Scholarship
    if (scheme.id === 'pms-post-matric') {
      if (isStudentPrompt && !hasDecentIncome) {
        eligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          qualification_reason: `You are enrolled in post-secondary education and fall within eligible category income guidelines.`
        });
      } else if (hasDecentIncome) {
        ineligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          disqualification_reason: `This scholarship requires annual family income below ₹2,50,000 / year.`
        });
      } else {
        ineligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          disqualification_reason: `Requires active student enrollment status in recognized post-secondary institution.`
        });
      }
      return;
    }

    // 3. Healthcare / PM-JAY
    if (scheme.id === 'pmjay-ayushman') {
      if (isHealthPrompt && !hasDecentIncome) {
        eligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          qualification_reason: `You indicated healthcare requirement and qualify under SECC / low-income health insurance eligibility.`
        });
      } else if (hasDecentIncome) {
        ineligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          disqualification_reason: `PM-JAY health cover is capped for low-income and SECC-listed families (Income < ₹1.8L/yr).`
        });
      } else {
        ineligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          disqualification_reason: `Did not match healthcare hospitalization keywords or BPL health coverage listing.`
        });
      }
      return;
    }

    // 4. PM Kisan
    if (scheme.id === 'pm-kisan') {
      if (isFarmerPrompt) {
        eligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          qualification_reason: `You specified agricultural landholding/farmer status required for direct income transfer.`
        });
      } else {
        ineligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          disqualification_reason: `Requires cultivable agricultural land ownership records in your name.`
        });
      }
      return;
    }

    // 5. PM SVANidhi
    if (scheme.id === 'pm-svanidhi') {
      if (isVendorPrompt) {
        eligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          qualification_reason: `You operate a street vending or micro-trading activity eligible for working capital loans.`
        });
      } else {
        ineligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          disqualification_reason: `Requires Urban Local Body (ULB) vending certificate or micro-trade endorsement.`
        });
      }
      return;
    }

    // 6. Sukanya Samriddhi
    if (scheme.id === 'sukanya-samriddhi') {
      if (isGirlPrompt) {
        eligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          qualification_reason: `Targeted savings scheme for girl child education and welfare.`
        });
      } else {
        ineligible.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          disqualification_reason: `Only applicable for girl children below 10 years of age.`
        });
      }
      return;
    }
  });

  // Collect missing data points
  if (!/\b(income|salary|lakh|rupee|₹|\d+L)\b/i.test(textLower)) {
    missingInfo.push("Specify your exact annual family income (in INR) to verify low-income caps for scholarship and health schemes.");
  }
  if (!/\b(sc|st|obc|general|ews|caste|category)\b/i.test(textLower)) {
    missingInfo.push("Specify your social category (SC / ST / OBC / General / EWS) to check category-specific reservation quotas.");
  }

  return {
    eligible_schemes: eligible.length > 0 ? eligible : [
      {
        id: 'startup-india-seed-fund',
        name: 'Startup India Seed Fund Scheme (SISFS)',
        department: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
        qualification_reason: 'Open for all innovators, students, and early-stage startup founders regardless of social category or family income.'
      }
    ],
    ineligible_schemes: ineligible,
    missing_info: missingInfo,
    source: 'DETERMINISTIC_OFFLINE_ENGINE'
  };
}
