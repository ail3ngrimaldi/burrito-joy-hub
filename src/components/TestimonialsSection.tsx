const testimonials = [
  {
    text: "La calidad de estos burritos. Son de otro level. Solo probé el de bondio. Masa crocante y supeeeer rellenos. Están excelentes.",
    author: "Alan",
  },
  {
    text: "SUBLIME el de carne desmechada, sublime, aplausos 👏",
    author: "Carlita",
  },
  {
    text: "Sabía que cocinaban bien pero no sabía que tanto.",
    author: "Gastón",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Testimonios
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.author} className="text-center">
                <p className="text-foreground leading-relaxed mb-6 italic text-lg">
                  "{t.text}"
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  — {t.author}
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
