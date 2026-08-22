import { sanitizeInput } from './sanitizer';
import { executeGeminiRequestWithKeyStack } from './geminiKeyStack';

/**
 * AI Processing Logic to generate structured RTI Filing Plan and Draft.
 * Uses 6-key sequential failover API stack calling Google Gemini 3.6 Flash API.
 */
export const SYSTEM_PROMPT = `You are a civic legal assistant. The user will describe a problem. You must analyze the problem and return a JSON object with three exact keys: 1) 'department' (The specific Central Government Ministry or Department responsible), 2) 'filing_plan' (A 3-step bulleted list of what the user needs to do or gather), and 3) 'rti_draft' (A formal, polite RTI application text under 3,000 characters, asking specific questions to resolve the issue).`;

export const generateFilingPlan = async (userProblem) => {
  // Execute call via 6-Key Sequential Failover Stack using Gemini 3.6 Flash
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
              { text: `${SYSTEM_PROMPT}\n\nUser Issue Description: "${userProblem}"` }
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
      try {
        const parsed = JSON.parse(rawJsonStr);
        return {
          department: sanitizeInput(parsed.department || 'Department of Administrative Reforms and Public Grievances (DARPG)'),
          filing_plan: Array.isArray(parsed.filing_plan)
            ? parsed.filing_plan.map(item => sanitizeInput(String(item)))
            : [
                'Gather all transaction IDs, reference numbers, or correspondence dates.',
                'Verify whether the matter pertains to a Central Government public authority.',
                'Attach BPL certificate if claiming fee exemption, or pay the Rs 10 online portal fee.'
              ],
          rti_draft: sanitizeInput(parsed.rti_draft || '')
        };
      } catch (e) {
        console.warn('Failed to parse Gemini JSON output:', e);
      }
    }
  }

  // Fallback Civic AI Analyzer when all API keys fail or offline
  return analyzeCivicIssueFallback(userProblem);
};

/**
 * Intelligent Fallback Civic AI Analyzer matching user issue keywords to Central Authorities.
 */
function analyzeCivicIssueFallback(problemText) {
  const textLower = problemText.toLowerCase().trim();
  let dept = 'Department of Administrative Reforms and Public Grievances (DARPG)';
  let deptCode = 'DARPG';

  if (/\b(train|railway|pnr|irctc|ticket|station|berth|coach|loco|platform|tdr)\b/i.test(textLower)) {
    dept = 'Ministry of Railways';
    deptCode = 'MORLY';
  } else if (/\b(telecom|bsnl|broadband|sim|mobile|cellular|telephone|dot|spectrum|fiber)\b/i.test(textLower)) {
    dept = 'Department of Telecommunications';
    deptCode = 'DOTEL';
  } else if (/\b(bank|atm|loan|sbi|insurance|lic|rbi|credit|debit|fd|subsidy|financial)\b/i.test(textLower)) {
    dept = 'Department of Financial Services';
    deptCode = 'DFS';
  } else if (/\b(passport|visa|embassy|consular|rpo|external affairs|foreign)\b/i.test(textLower)) {
    dept = 'Ministry of External Affairs';
    deptCode = 'MEA';
  } else if (/\b(exam|ssc|upsc|result|admit card|recruitment|cutoff|answer script|marksheet)\b/i.test(textLower)) {
    dept = 'Staff Selection Commission (SSC)';
    deptCode = 'SSC';
  } else if (/\b(tax|pan|income tax|cbdt|tds|refund|assessment|itr)\b/i.test(textLower)) {
    dept = 'Central Board of Direct Taxes (CBDT)';
    deptCode = 'CBDT';
  } else if (/\b(post|speed post|parcel|dak|postal|post office|tracking)\b/i.test(textLower)) {
    dept = 'Department of Posts';
    deptCode = 'DPOST';
  } else if (/\b(highway|toll|road|nhai|transport|vehicle|fastag)\b/i.test(textLower)) {
    dept = 'Ministry of Road Transport and Highways';
    deptCode = 'MORTH';
  } else if (/\b(hospital|health|aiims|doctor|medicine|medical|family welfare)\b/i.test(textLower)) {
    dept = 'Ministry of Health and Family Welfare';
    deptCode = 'MOHFW';
  } else if (/\b(college|university|iit|nit|ugc|education|degree|scholarship)\b/i.test(textLower)) {
    dept = 'Department of Higher Education';
    deptCode = 'DHEDU';
  }

  const isGenericOrBrief = deptCode === 'DARPG';
  const cleanInput = sanitizeInput(problemText);
  const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const filingPlan = isGenericOrBrief
    ? [
        `Grievance Details: Your input appears general or unspecific. Ensure you mention specific reference numbers (e.g. transaction ID, application date, or office location).`,
        `Authority Selection: Confirm whether your grievance pertains to a specific Ministry (e.g. Railways, Telecom, Banking) or general public administration (DARPG).`,
        `Document Readiness: Keep relevant receipts, complaint tokens, or identity reference numbers ready for attachment.`
      ]
    : [
        `Gather all relevant receipt numbers, PNRs, reference IDs, or correspondence dates related to your grievance.`,
        `Verify target authority routing: Confirm that ${dept} is the designated Central Public Authority.`,
        `Prepare your payment of Rs. 10 on rtionline.gov.in (or keep BPL card ready if claiming fee exemption).`
      ];

  const rtiDraft = `APPLICATION FOR SEEKING INFORMATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

To:
The Central Public Information Officer (CPIO)
${dept}
Government of India
[Authority Code: ${deptCode}]

Date: ${todayStr}

Subject: Request for Official Information under Section 6(1) of the RTI Act, 2005.

Sir / Madam,

I am a citizen of India submitting this request under Section 6(1) of the Right to Information Act, 2005 regarding the following issue:

BACKGROUND OF THE ISSUE:
${cleanInput}

SPECIFIC INFORMATION REQUESTED:
1. Provide daily progress report, file notings, and action taken report regarding the aforementioned matter.
2. Provide the name, official designation, and contact details of the officer(s) responsible for resolving this grievance.
3. Provide expected resolution timeline and copies of any official correspondence or orders issued till date.

STATUTORY DECLARATION:
- I am a citizen of India.
- The information requested falls within public domain and is not exempt under Section 8 or 9 of the RTI Act, 2005.
- Fee of Rs. 10 has been paid online via rtionline.gov.in portal.

Yours faithfully,
[Applicant Name Placeholder]
[Contact Mobile / Email Placeholder]
[Postal Address Placeholder]`;

  return {
    department: dept,
    filing_plan: filingPlan,
    rti_draft: sanitizeInput(rtiDraft)
  };
}
