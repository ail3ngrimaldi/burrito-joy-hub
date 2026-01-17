import { Leaf, Sparkles, Zap, ShoppingCart, MessageCircle, Package } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    step: "1",
    title: "Elegí tus sabores",
    description: "Seleccioná los burritos que más te gusten de nuestra carta.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: MessageCircle,
    step: "2",
    title: "Coordiná con nosotros",
    description: "Hablá con nuestro equipo por WhatsApp para confirmar tu pedido y acordar la entrega.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Package,
    step: "3",
    title: "Recibí y disfrutá",
    description: "Hacemos entregas los Jueves y Viernes. Recibí tu pedido y disfrutá de burritos ricos, abundantes y sanos cuando quieras.",
    color: "text-burrito-orange",
    bgColor: "bg-burrito-orange/10",
  },
];

const benefits = [
  {
    icon: Leaf,
    title: "Nutritivos de verdad",
    description: "Ingredientes reales, proteína, verduras y carbohidratos balanceados. Sin porquerías.",
  },
  {
    icon: Zap,
    title: "Listos en 3 minutos",
    description: "Del freezer al plato en un suspiro. Microondas, horno o sartén. Vos elegís.",
  },
  {
    icon: Sparkles,
    title: "Duran meses",
    description: "Stockeá el freezer y olvidate. Cuando llegue el hambre, vas a estar preparado.",
  },
];

const ValueProposition = () => {
  return (
    <section id="propuesta" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* How it works section */}
        <div className="text-center mb-12 animate-fade-in">
          <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
            📋 ¿Cómo funciona?
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            3 pasos y listo
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute -top-4 -left-2">
                <span className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground font-display font-bold text-xl rounded-full shadow-lg">
                  {step.step}
                </span>
              </div>
              <div className={`w-14 h-14 ${step.bgColor} rounded-xl flex items-center justify-center mb-4 mt-4 group-hover:scale-110 transition-transform`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits section */}
        <div className="text-center mb-12 animate-fade-in">
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

        {/* Benefits grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <benefit.icon className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
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
