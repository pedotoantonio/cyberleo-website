import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CookieConsentContext = createContext(null);

const CONSENT_KEY = 'cyberleo_cookie_consent';

export function CookieConsentProvider({ children }) {
  const [showBanner, setShowBanner] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent) {
      setHasConsented(true);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      accepted: true,
      timestamp: Date.now()
    }));
    setHasConsented(true);
    setShowBanner(false);
  }, []);

  const acceptEssential = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      accepted: false,
      essential: true,
      timestamp: Date.now()
    }));
    setHasConsented(true);
    setShowBanner(false);
  }, []);

  const openSettings = useCallback(() => {
    setShowBanner(true);
  }, []);

  return (
    <CookieConsentContext.Provider value={{
      showBanner,
      hasConsented,
      acceptAll,
      acceptEssential,
      openSettings
    }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return context;
}
