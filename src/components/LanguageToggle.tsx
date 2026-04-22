import { useI18n } from "@/contexts/I18nContext";
import { Languages } from "lucide-react";

const LanguageToggle = () => {
  const { lang, setLang } = useI18n();
  const next = lang === "es" ? "en" : "es";

  return (
    <button
      onClick={() => setLang(next)}
      className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      aria-label={`Switch language to ${next.toUpperCase()}`}
      title={lang === "es" ? "English" : "Español"}
    >
      <Languages className="w-3.5 h-3.5" />
      <span>{next.toUpperCase()}</span>
    </button>
  );
};

export default LanguageToggle;
