import { Button } from "@/components/ui/button";
import logo from "@/assets/losburritosdedulcinea.svg";

const HeroSection = () => {
  const scrollToProducts = () => {
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center">
      <div className="container relative z-10 mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
              Burritos congelados artesanales
            </p>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[0.95] mb-8 tracking-tight">
              Stockeá el<br />
              freezer,<br />
              <span className="text-accent">comé rico.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Caseros, nutritivos y abundantes. Duran meses en el freezer. En minutos tenés un platazo.
            </p>

            {/* Minimal info tags */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                🧊 Congelados
              </span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                🚚 Envío Viernes
              </span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                📍 Zona Norte
              </span>
            </div>

            <Button variant="hero" size="xl" onClick={scrollToProducts}>
              Ver productos →
            </Button>
          </div>

          {/* Logo/Image */}
          <div className="flex items-center justify-center">
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
