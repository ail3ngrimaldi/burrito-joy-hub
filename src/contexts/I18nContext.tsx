import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { translations, type Language, type TranslationKey } from "@/i18n/translations";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = "lbd_lang";

const detectBrowserLang = (): Language => {
  if (typeof navigator === "undefined") return "es";
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (stored === "es" || stored === "en") return stored;
  const langs = navigator.languages || [navigator.language];
  for (const l of langs) {
    const code = l.toLowerCase().split("-")[0];
    if (code === "es") return "es";
    if (code === "en") return "en";
  }
  return "es";
};

const interpolate = (str: string, vars?: Record<string, string | number>) => {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>("es");

  useEffect(() => {
    const detected = detectBrowserLang();
    setLangState(detected);
    document.documentElement.lang = detected;
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  };

  const value = useMemo<I18nContextType>(() => ({
    lang,
    setLang,
    t: (key, vars) => {
      const dict = translations[lang] as Record<string, string>;
      const fallback = translations.es as Record<string, string>;
      const raw = dict[key] ?? fallback[key] ?? key;
      return interpolate(raw, vars);
    },
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
