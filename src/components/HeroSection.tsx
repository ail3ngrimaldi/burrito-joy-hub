import { Button } from "@/components/ui/button";
import logo from "@/assets/losburritosdedulcinea.svg";

const HeroSection = () => {
  const scrollToProducts = () => {
    const element = document.getElementById("productos");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-burrito-cream via-background to-secondary/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary/30 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left animate-fade-in">
            <span className="inline-block px-4 py-2 bg-secondary/50 text-secondary-foreground rounded-full text-sm font-medium mb-6">
              🧊 Burritos congelados caseros
            </span>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Stockeá el freezer,{" "}
              <span className="text-primary">comé rico</span>
              <br />
              <span className="text-accent">todos los días</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-xl mx-auto lg:mx-0">
              Burritos <strong>caseros, nutritivos y abundantes</strong> que duran meses en el freezer. 
              En 5 minutos tenés un platazo listo.
            </p>
            
            {/* Key info badges */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-full text-sm font-medium">
                🧊 Congelados
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🚚 Envío Jueves y Viernes
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium">
                📍 Zona Norte GBA
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="hero" 
                size="xl" 
                onClick={scrollToProducts}
                className="group"
              >
                Ver burritos y precios
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </div>
          </div>
          
          {/* Hero image - Logo */}
          <div className="relative animate-scale-in flex items-center justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl transform scale-95" />
              
              <img
                src={logo}
                alt="Los burritos de Dulcinea Logo"
                className="relative w-full max-w-md mx-auto animate-float"
              />
              
              {/* Floating badge - masa liviana */}
              <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-xl animate-slide-up">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">✨</span>
                  <div>
                    <p className="font-display font-bold text-foreground">Masa ultra fina</p>
                    <p className="text-xs text-muted-foreground">La más liviana del mercado</p>
                  </div>
                </div>
              </div>
              
              {/* Available badge for promotions
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-2xl px-4 py-2 shadow-xl animate-slide-up">
                <p className="font-display font-bold">5 + 1 gratis</p>
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
