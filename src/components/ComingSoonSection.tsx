import { Sparkles } from "lucide-react";

const upcomingFlavors = [
  {
    name: "High Protein Breakfast",
    description: "Pollo, huevo, clara, palta, mozzarella y más. Para arrancar el día como un campeón.",
    emoji: "🍳",
  },
  {
    name: "American Chicken",
    description: "Pollo desmechado, mezcla de quesos, cebolla caramelizada y salsa barbacoa.",
    emoji: "🍗",
  },
  {
    name: "Veggie Calabaza",
    description: "Calabaza, hongos, espinaca y cebolla caramelizada. 100% veggie, 100% sabroso.",
    emoji: "🥬",
  },
  {
    name: "Pollo Cremoso",
    description: "Pollo, espinaca, cebolla caramelizada, queso fresco y crema.",
    emoji: "🧀",
  },
];

const ComingSoonSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 text-burrito-orange" />
            <span className="text-secondary-foreground">Próximamente</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nuevos sabores en el horno
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Estamos probando recetas nuevas todo el tiempo. Acá te dejamos un adelanto 
            de lo que se viene. Spoiler: está todo muy bueno.
          </p>
        </div>

        {/* Upcoming flavors */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingFlavors.map((flavor, index) => (
            <div
              key={flavor.name}
              className="group relative p-5 rounded-xl bg-card border border-dashed border-border hover:border-primary/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute -top-3 -right-3 bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full">
                En prueba
              </div>
              <span className="text-3xl mb-3 block">{flavor.emoji}</span>
              <h3 className="font-display font-bold text-foreground mb-1">
                {flavor.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {flavor.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            ¿Tenés una idea de sabor? <span className="text-primary font-medium">¡Contanos por WhatsApp!</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
