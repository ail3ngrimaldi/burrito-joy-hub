import { Button } from "@/components/ui/button";
import logo from "@/assets/losburritosdedulcinea.svg";
import { useI18n } from "@/contexts/I18nContext";

const HeroSection = () => {
  const { t } = useI18n();

  const scrollToProducts = () => {
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center">
      <div className="container relative z-10 mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <p className="reveal reveal-delay-1 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
              {t("hero.tagline")}
            </p>

            <h1 className="reveal reveal-delay-2 font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[0.95] mb-8 tracking-tight">
              {t("hero.title.line1")}<br />
              {t("hero.title.line2")}<br />
              <span className="text-accent">{t("hero.title.line3")}</span>
            </h1>

            <p className="reveal reveal-delay-3 text-lg text-muted-foreground mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed">
              {t("hero.subtitle")}
            </p>

            {/* Minimal info tags */}
            <div className="reveal reveal-delay-4 flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {t("hero.tag.frozen")}
              </span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {t("hero.tag.delivery")}
              </span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {t("hero.tag.zone")}
              </span>
            </div>

            <div className="reveal reveal-delay-5">
              <Button variant="hero" size="xl" onClick={scrollToProducts}>
                {t("hero.cta")}
              </Button>
            </div>
          </div>

          {/* Logo/Image */}
          <div className="reveal reveal-delay-3 flex items-center justify-center">
            <img
              src={logo}
              alt="Los burritos de Dulcinea"
              className="w-full max-w-sm mx-auto animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
