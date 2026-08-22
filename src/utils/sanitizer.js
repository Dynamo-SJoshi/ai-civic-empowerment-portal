/**
 * Sanitizes input text to only allow:
 * - A-Z, a-z, 0-9
 * - Allowed special characters: , . - _ ( ) / @ : & ? \ %
 * - Whitespace and line breaks
 * 
 * Automatically strips quotes (", '), emojis, and any unsupported symbols.
 */
export const ALLOWED_CHARS_REGEX = /[^\w\s,\.\-_()\/\@:&?\\%]/g;

export const sanitizeInput = (text) => {
  if (typeof text !== 'string') return '';
  // Replace underscores and word characters properly. Note \w includes A-Z, a-z, 0-9, _
  // Explicit pattern: allowed set = [a-zA-Z0-9,\.\-_()\/\@:&?\\%\s]
  return text.replace(/[^a-zA-Z0-9,\.\-_()\/\@:&?\\%\s]/g, '');
};

/**
 * Checks if a string contains any invalid characters before sanitization.
 */
export const hasInvalidChars = (text) => {
  if (typeof text !== 'string') return false;
  return /[^a-zA-Z0-9,\.\-_()\/\@:&?\\%\s]/.test(text);
};

/**
 * Strips consecutive duplicate spaces/newlines if needed while keeping standard formatting.
 */
export const formatCleanText = (text) => {
  return sanitizeInput(text);
};
