import * as React from "react";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fi", label: "Suomi" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "sv", label: "Svenska" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

const STORAGE_KEY = "nd_lang";

interface LanguageContextType {
  lang: LangCode;
  setLang: (code: LangCode) => void;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<LangCode>("en");

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) setLangState(stored);
  }, []);

  const setLang = (code: LangCode) => {
    setLangState(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
