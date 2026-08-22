import { sanitizeInput } from './sanitizer';
import { executeGeminiRequestWithKeyStack } from './geminiKeyStack';

/**
 * Consumer Dispute AI Engine under Consumer Protection Act, 2019.
 * 
 * @param {string} userNarrative - User's description of consumer grievance/dispute
 * @returns {Promise<{ violation_summary: string, recommended_claim: string, formal_notice_text: string, edaakhil_guidance: string, source: string }>}
 */
export const analyzeDispute = async (userNarrative) => {
  const cleanInput = sanitizeInput(userNarrative);

  const systemInstruction = `You are a consumer rights specialist in India operating under the Consumer Protection Act, 2019. The user will provide a consumer grievance. Analyze the issue and return a strict JSON object with: 
  1) 'violation_summary' (plain-language explanation of what legal rights were violated, e.g., 'Deficiency in Service' or 'Unfair Trade Practice'), 
  2) 'recommended_claim' (what they can legally demand: full refund, product replacement, compensation for mental agony & litigation costs), 
  3) 'formal_notice_text' (a professional, formal pre-litigation legal notice template addressed to the company's Grievance Officer, citing the Consumer Protection Act 2019 with a strict 15-day rectification deadline and referencing e-Jagriti court filing), and 
  4) 'edaakhil_guidance' (brief notes on how to file on e-Jagriti [formerly e-Daakhil] at e-jagriti.gov.in if the notice is ignored, mentioning that filing is free for claims up to ₹5 Lakh).`;

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
                { text: `${systemInstruction}\n\nUser Grievance Narrative: "${cleanInput}"` }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });
    });

    if (result.ok && result.data) {
      const rawJsonStr = result.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawJsonStr) {
        const parsed = JSON.parse(rawJsonStr);
        return {
          violation_summary: sanitizeInput(parsed.violation_summary || 'Deficiency in Service & Unfair Trade Practice under Consumer Protection Act 2019'),
          recommended_claim: sanitizeInput(parsed.recommended_claim || 'Full refund of purchase amount plus statutory compensation for distress'),
          formal_notice_text: sanitizeInput(parsed.formal_notice_text || ''),
          edaakhil_guidance: sanitizeInput(parsed.edaakhil_guidance || 'Zero court fee for claims up to Rs 5 Lakhs on e-Jagriti (formerly e-Daakhil) portal at e-jagriti.gov.in.'),
          source: 'GEMINI_3_6_AI_ENGINE'
        };
      }
    }
  } catch (err) {
    console.warn('Gemini analyzeDispute failed, using fallback consumer legal analyzer:', err);
  }

  return fallbackAnalyzeDispute(cleanInput);
};

/**
 * Deterministic Fallback Consumer Rights Legal Analyzer.
 */
function fallbackAnalyzeDispute(narrativeText) {
  const textLower = narrativeText.toLowerCase();
  const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  let violationType = 'Deficiency in Service & Violation of Consumer Rights';
  let claimSummary = 'Full refund of paid amount along with ₹5,000 compensation for mental agony and inconvenience.';

  if (/\b(delivery|delivered|received|courier|fake|wrong product|damaged)\b/i.test(textLower)) {
    violationType = 'Deficiency in Service & Supplying Misleading/Defective Goods (Section 2(11) of CPA 2019)';
    claimSummary = 'Immediate full refund or replacement of defective item plus delivery cost reimbursement.';
  } else if (/\b(warranty|repair|service center|replacement|guarantee|denied)\b/i.test(textLower)) {
    violationType = 'Refusal to Honor Statutory Warranty & Unfair Trade Practice (Section 2(47) of CPA 2019)';
    claimSummary = 'Free under-warranty repair or unit replacement, plus compensation for service delay.';
  } else if (/\b(flight|airline|travel|hotel|booking|cancellation|refund)\b/i.test(textLower)) {
    violationType = 'Arbitrary Cancellation / Non-Refund (Deficiency in Transport Service)';
    claimSummary = 'Full 100% refund of booking fare without unauthorized cancellation deductions.';
  } else if (/\b(subscription|charge|debited|unauthorized|auto debit|overcharge)\b/i.test(textLower)) {
    violationType = 'Unfair Trade Practice & Unauthorized Billing (Section 2(47) of CPA 2019)';
    claimSummary = 'Immediate reversal of unauthorized subscription charges and account normalization.';
  }

  const noticeText = `FORMAL LEGAL NOTICE FOR DEFICIENCY IN SERVICE / UNFAIR TRADE PRACTICE
(Under the Consumer Protection Act, 2019)

Date: ${todayStr}

To:
The Nodal Officer / Grievance Officer
[Insert Company / Brand Name]
[Insert Registered Office Address / Email]

Subject: Formal Legal Notice for Resolution of Consumer Dispute regarding Order/Service Reference: [Insert Reference No.]

Sir / Madam,

I am issuing this formal legal notice regarding a severe deficiency in service and unfair trade practice experienced by me as a consumer under the Consumer Protection Act, 2019.

FACTS OF THE DISPUTE:
${narrativeText}

LEGAL VIOLATIONS IDENTIFIED:
1. Deficiency in Service under Section 2(11) of the Consumer Protection Act, 2019.
2. Unfair Trade Practice under Section 2(47) of the Consumer Protection Act, 2019.

DEMANDS / RECTIFICATION REQUESTED:
You are hereby called upon to comply with the following demands within FIFTEEN (15) DAYS from the receipt of this notice:
1. ${claimSummary}
2. Pay a sum of Rs. 5,000 towards compensation for mental trauma, inconvenience, and legal notice expenses.

TAKE NOTICE that if you fail to resolve this matter within 15 days, I shall be constrained to initiate formal legal proceedings against your company before the District Consumer Disputes Redressal Commission via the unified e-Jagriti portal (e-jagriti.gov.in, formerly e-Daakhil) at your risk and consequence.

Yours faithfully,
[Insert Consumer Name]
[Insert Contact Number / Email]`;

  return {
    violation_summary: violationType,
    recommended_claim: claimSummary,
    formal_notice_text: noticeText,
    edaakhil_guidance: 'If the company fails to respond within 15 days, file a formal complaint online at e-jagriti.gov.in (formerly e-Daakhil). Note: Filing is completely FREE (Zero Court Fee) for claims up to ₹5,00,000.',
    source: 'OFFLINE_CONSUMER_ANALYZER'
  };
}
