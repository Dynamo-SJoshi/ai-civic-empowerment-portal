/**
 * Native Browser Web Speech API helper for speech-to-text recognition with friendly error mapping.
 */
export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
};

export const getSpeechErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'not-allowed':
    case 'permission-denied':
      return 'Microphone access was denied. Please allow microphone permissions in your browser address bar to use voice input, or type your message in the text box.';
    case 'no-speech':
      return 'No speech was detected. Please try speaking into your microphone again or check your volume settings.';
    case 'audio-capture':
      return 'No microphone was found on your device. Please connect a working microphone or use text input.';
    case 'network':
      return 'Network error occurred during speech recognition. Please check your internet connection.';
    case 'service-not-allowed':
      return 'Speech recognition service is disabled or blocked by your browser settings.';
    default:
      return `Speech recognition error (${errorCode}). Please type your message in the text box instead.`;
  }
};

export const createSpeechRecognizer = ({ onResult, onError, onEnd, lang = 'en-IN' }) => {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = lang;

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    if (onResult) {
      onResult(transcript);
    }
  };

  recognition.onerror = (event) => {
    const friendlyMessage = getSpeechErrorMessage(event.error);
    console.warn('Speech recognition error:', event.error, friendlyMessage);
    if (onError) {
      onError({ errorCode: event.error, message: friendlyMessage });
    }
  };

  recognition.onend = () => {
    if (onEnd) {
      onEnd();
    }
  };

  return recognition;
};
