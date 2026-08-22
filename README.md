# 🏛️ Rights Navigator — Civic Empowerment & Legal Tech Suite

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL_3.0-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TailwindCSS-00D8FF)](https://reactjs.org/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%203.6%20Flash-8E75FF)](https://ai.google.dev/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald)](https://github.com/)

**Rights Navigator** is an open-source, AI-assisted civic transparency & legal tech portal for India. It empowers citizens to exercise statutory rights under the Right to Information Act 2005, discover welfare scheme eligibility, generate formal pre-litigation consumer notices (Consumer Protection Act 2019 / e-Jagriti), and analyze contract risks without lawyer fees or bureaucratic complexity.

---

## 🌟 Core Modules

### 1. 📜 AI Guided RTI Filing
- **Voice & Text Intake**: Supports plain text descriptions and native browser Web Speech API (`SpeechRecognition`) for hands-free "Speak to Explain" voice input.
- **Automated Central Ministry Routing**: Routes complaints to the responsible Central Public Authority (Railways, Telecom, Financial Services, Higher Education, Posts, etc.).
- **3-Step Action Plan & Draft Generator**: Creates actionable steps and drafts formal RTI applications under 3,000 characters.
- **Statutory Character Sanitizing & PDF Export**: Sanitizes forbidden characters for `rtionline.gov.in` and exports space-free PDF files ready for attachment.

### 2. 🎯 Scheme Eligibility Reader
- **AI Matching Engine**: Evaluates user demographics against Central & State welfare schemes (SISFS Startup Seed Fund, PM MUDRA Yojana, Post-Matric Scholarships, Ayushman Bharat PM-JAY, PM-Kisan, Sukanya Samriddhi).
- **Live Web Grounding**: Performs live web search grounding across `myscheme.gov.in`, `startupindia.gov.in`, and official `.gov.in` portals.
- **Action Plan Dashboard**: Displays green-accented eligibility cards, plain-language qualification summaries, required document checklists, and direct portal links.
- **Conversational Follow-Up**: Prompts for missing data (such as income caps or social category) to refine results.

### 3. ⚖️ Consumer Rights Navigator (CPA 2019 & e-Jagriti)
- **Legal Violation Assessment**: Identifies statutory violations under the Consumer Protection Act, 2019 (*Deficiency in Service*, *Unfair Trade Practice*).
- **15-Day Pre-Litigation Legal Notice Generator**: Generates formal notice templates addressed to company Grievance Officers with one-click PDF export.
- **3-Tier Escalation Ladder**:
  - **Tier 1**: Pre-Litigation Legal Notice (15-day rectification deadline).
  - **Tier 2**: National Consumer Helpline (`1915` / `consumerhelpline.gov.in`).
  - **Tier 3**: Consumer Court Filing via the unified **e-Jagriti** portal (`e-jagriti.gov.in`, formerly e-Daakhil) with zero court fee for claims up to ₹5 Lakhs.

### 4. 🛡️ AI Contract Risk Scanner
- External module integration with [AI Contract Risk Scanner](https://github.com/Dynamo-SJoshi/AI-Contract-Risk-Scanner).
- Scans lease, rental, and employment agreements for hidden penalties, one-sided indemnities, and unfair termination terms.

### 5. 🌐 Multilingual Indian Languages Support
- Integrated Google Translate widget restricted to scheduled Indian languages (`hi`, `bn`, `te`, `mr`, `ta`, `ur`, `gu`, `kn`, `ml`, `pa`, `or`, `as`, etc.).

---

## 🛡️ Architecture & Resilient Design

- **6-Key API Failover Stack**: Sequential key pool (`VITE_GEMINI_API_KEY_1` to `6`) with automatic failover on rate limits (`429`), permission errors (`403/400`), or model deprecations (`404`).
- **10-Second AbortController Timeout**: Prevents UI freezing by timing out hanging requests and escalating to the next key or offline engine.
- **100% Client-Side Privacy**: Runs completely inside the user's browser. Zero storage, logging, or transmission of personal data to external servers.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm / pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Dynamo-SJoshi/ai-civic-empowerment-portal.git

# Navigate to project directory
cd ai-civic-empowerment-portal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start local development server
npm run dev
```

### Environment Configuration (.env)
```env
# 6-Key Sequential Failover Stack (Tried in order: 1 -> 2 -> 3 -> 4 -> 5 -> 6)
VITE_GEMINI_API_KEY_1=your_gemini_api_key_1
VITE_GEMINI_API_KEY_2=your_gemini_api_key_2
VITE_GEMINI_API_KEY_3=your_gemini_api_key_3
VITE_GEMINI_API_KEY_4=your_gemini_api_key_4
VITE_GEMINI_API_KEY_5=your_gemini_api_key_5
VITE_GEMINI_API_KEY_6=your_gemini_api_key_6
```

---

## 📜 License
Distributed under the GNU Affero General Public License v3.0 (AGPL-3.0). See [LICENSE](LICENSE) for more information.
