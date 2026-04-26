import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/contexts/I18nContext";

const ValueProposition = () => {
  const { t } = useI18n();

  const faqs = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
  ];

  return (
    <section id="propuesta" className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="reveal-on-scroll text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              {t("faq.eyebrow")}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {t("faq.title")}
            </h2>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full reveal-on-scroll">
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
          <div className="reveal-on-scroll mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              {t("faq.moreQuestions")}{" "}
              <a
                href="https://wa.me/5491124003293"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                {t("faq.writeWhatsapp")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
