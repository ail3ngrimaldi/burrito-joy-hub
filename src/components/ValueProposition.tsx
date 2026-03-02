import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Vienen congelados?",
    answer: "Sí, los burritos vienen congelados y listos para calentar. Duran 3 meses en el freezer y en 5 minutos tenés un platazo.",
  },
  {
    question: "¿Dónde entregan?",
    answer: "Zona norte y CABA, con bonificación por envío de $2000 según la distancia desde nuestra sucursal.",
  },
  {
    question: "¿Cómo pago?",
    answer: "Transferencia bancaria o efectivo al momento de la entrega.",
  },
  {
    question: "¿Cuándo entregan?",
    answer: "Las entregas son los viernes. Los pedidos ingresan hasta el jueves a las 18hs.",
  },
];

const ValueProposition = () => {
  return (
    <section id="propuesta" className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Preguntas frecuentes
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Todo lo que necesitás saber
            </h2>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* WhatsApp CTA */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Más dudas?{" "}
              <a
                href="https://wa.me/5491124003293"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                Escribinos por WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
