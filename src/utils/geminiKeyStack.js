/**
 * Sequential Gemini API Key Stack Manager (Failover Pool with Timeout Protection).
 * 
 * Collects up to 6 API keys configured in .env (VITE_GEMINI_API_KEY_1 to VITE_GEMINI_API_KEY_6).
 * Executes API requests sequentially in stack order (1 -> 2 -> 3 -> 4 -> 5 -> 6).
 * Automatically fails over to the next key if quota (429), permission (403), key error (400), or timeout (Abort) occurs.
 */

export const getApiKeyStack = () => {
  const keys = [];
  
  for (let i = 1; i <= 6; i++) {
    const key = import.meta.env?.[`VITE_GEMINI_API_KEY_${i}`];
    if (key && typeof key === 'string' && key.trim().length > 0) {
      keys.push(key.trim());
    }
  }

  const singleKey = import.meta.env?.VITE_GEMINI_API_KEY;
  if (singleKey && typeof singleKey === 'string' && singleKey.trim().length > 0) {
    if (!keys.includes(singleKey.trim())) {
      keys.push(singleKey.trim());
    }
  }

  return keys;
};

/**
 * Executes a Gemini API call sequentially trying keys from the stack in order with 10-second timeout protection.
 * 
 * @param {Function} apiCallFn - Async function taking (apiKey, signal) and returning fetch Response object
 * @param {number} timeoutMs - Timeout limit in milliseconds (default: 10,000ms = 10s)
 * @returns {Promise<{ ok: boolean, data?: any, keyUsedIndex?: number, error?: any }>}
 */
export const executeGeminiRequestWithKeyStack = async (apiCallFn, timeoutMs = 10000) => {
  const keyStack = getApiKeyStack();

  if (keyStack.length === 0) {
    return { ok: false, error: 'No API keys configured in .env' };
  }

  for (let index = 0; index < keyStack.length; index++) {
    const currentKey = keyStack[index];
    const keyLabel = `Key ${index + 1}/${keyStack.length} (${currentKey.substring(0, 6)}...)`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await apiCallFn(currentKey, controller.signal);
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return {
          ok: true,
          data,
          keyUsedIndex: index + 1
        };
      }

      if (response.status === 429 || response.status === 403 || response.status === 400 || response.status === 404) {
        console.warn(`[Gemini Key Stack] ${keyLabel} returned HTTP ${response.status}. Switching sequentially to next key...`);
        continue;
      } else {
        console.warn(`[Gemini Key Stack] ${keyLabel} returned HTTP ${response.status}. Trying next key...`);
        continue;
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.warn(`[Gemini Key Stack] ${keyLabel} timed out after ${timeoutMs}ms. Failing over to next key...`);
      } else {
        console.warn(`[Gemini Key Stack] ${keyLabel} network error:`, err.message);
      }
      continue;
    }
  }

  return { ok: false, error: 'All API keys in the stack failed, timed out, or exhausted quota.' };
};
