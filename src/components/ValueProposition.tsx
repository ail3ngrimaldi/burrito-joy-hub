import { Truck, Snowflake, CreditCard, Clock } from "lucide-react";

const faqs = [
  {
    icon: Snowflake,
    question: "¿Vienen congelados?",
    answer: "Sí, los burritos vienen congelados y listos para calentar. Duran 3 meses en el freezer y en 5 minutos tenés un platazo.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Truck,
    question: "¿Dónde entregan?",
    answer: "Zona norte y CABA, con bonificación por envío de $2000 según la distancia desde nuestra sucursal",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: CreditCard,
    question: "¿Cómo pago?",
    answer: "Transferencia bancaria o efectivo al momento de la entrega.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Clock,
    question: "¿Cuándo entregan?",
    answer: "Las entregas son los viernes. Los pedidos ingresan hasta el jueves a las 18hs",
    color: "text-burrito-orange",
    bgColor: "bg-burrito-orange/10",
  },
];

const ValueProposition = () => {
  return (
    <section id="propuesta" className="py-16 bg-background">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Todo lo que necesitás saber
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Respuestas rápidas a las dudas más comunes
          </p>
        </div>

          {/* FAQ Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 ${faq.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <faq.icon className={`w-6 h-6 ${faq.color}`} />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                {faq.question}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

          {/* Simple callout */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              <span className="text-xl mr-2">💬</span>
              ¿Más dudas? <a href={`https://wa.me/5491124003293`} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">Escribinos por WhatsApp</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
