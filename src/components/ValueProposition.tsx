import { Clock, Leaf, Sparkles, UtensilsCrossed, Zap } from "lucide-react";

const features = [
  {
    icon: UtensilsCrossed,
    title: "Te llenan posta",
    description: "Más de 500g de burrito. Esto no es un snack, es una comida de verdad.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Leaf,
    title: "Nutritivos de verdad",
    description: "Ingredientes reales, proteína, verduras y carbohidratos balanceados. Sin porquerías.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Zap,
    title: "Listos en 3 minutos",
    description: "Del freezer al plato en un suspiro. Microondas, horno o sartén. Vos elegís.",
    color: "text-secondary-foreground",
    bgColor: "bg-secondary",
  },
  {
    icon: Sparkles,
    title: "Cero quilombo",
    description: "No ensuciás nada. No picás nada. No cocinás nada. Solo comés rico.",
    color: "text-burrito-orange",
    bgColor: "bg-burrito-orange/10",
  },
  {
    icon: Clock,
    title: "Duran semanas",
    description: "Stockeá el freezer y olvidate. Cuando llegue el hambre, vas a estar preparado.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const ValueProposition = () => {
  return (
    <section id="propuesta" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
            💡 ¿Por qué burritos congelados?
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            La solución a tus problemas alimenticios
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sabemos que cocinar todos los días es un garrón. Por eso creamos burritos que te salvan 
            el almuerzo, la cena, o ese antojo de medianoche.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Fun callout */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-primary/10 via-secondary/20 to-accent/10 rounded-2xl p-8 max-w-2xl">
            <p className="text-lg text-foreground font-medium">
              <span className="text-2xl mr-2">🤔</span>
              Pensalo así: por el precio de un delivery cualquiera, tenés{" "}
              <span className="text-primary font-bold">varios días de comida</span> ya resuelta en tu freezer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
