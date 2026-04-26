import { useI18n } from "@/contexts/I18nContext";

const TestimonialsSection = () => {
  const { t } = useI18n();

  const testimonials = [
    { text: t("testimonials.t1"), author: "Alan" },
    { text: t("testimonials.t2"), author: "Carlita" },
    { text: t("testimonials.t3"), author: "Gastón" },
  ];

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="reveal-on-scroll text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              {t("testimonials.eyebrow")}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {t("testimonials.title")}
            </h2>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((tm, idx) => (
              <div
                key={tm.author}
                className="reveal-on-scroll text-center"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <p className="text-foreground leading-relaxed mb-6 italic text-lg">
                  "{tm.text}"
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  — {tm.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
