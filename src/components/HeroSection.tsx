import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-burrito.jpg";

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
              🔥 Congelados que te salvan la vida
            </span>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Burritos que te llenan{" "}
              <span className="text-primary">el alma</span>
              <br />
              <span className="text-accent">(y la panza)</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Stockeá tu freezer con burritos <strong>nutritivos y abundantes</strong>. 
              En 3 minutos tenés un platazo listo, sin ensuciar nada. 
              <span className="text-primary font-semibold"> Tu yo del futuro te lo va a agradecer.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="hero" 
                size="xl" 
                onClick={scrollToProducts}
                className="group"
              >
                Ver precios y pedir
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => document.getElementById("propuesta")?.scrollIntoView({ behavior: "smooth" })}
              >
                ¿Cómo funciona?
              </Button>
            </div>
            
            <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-accent text-lg">✓</span>
                <span>Envío a domicilio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent text-lg">✓</span>
                <span>Freezer friendly</span>
              </div>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="relative animate-scale-in">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl transform scale-95" />
              
              <img
                src={heroImage}
                alt="Delicioso burrito casero cortado a la mitad mostrando su relleno"
                className="relative rounded-3xl shadow-2xl w-full object-cover animate-float"
              />
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-xl animate-slide-up">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🌯</span>
                  <div>
                    <p className="font-display font-bold text-foreground">+500g</p>
                    <p className="text-xs text-muted-foreground">de pura satisfacción</p>
                  </div>
                </div>
              </div>
              
              {/* Another floating badge */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-2xl px-4 py-2 shadow-xl animate-slide-up">
                <p className="font-display font-bold">¡Nuevo!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
