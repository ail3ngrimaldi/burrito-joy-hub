import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "La calidad de estos burritos. Son de otro level. Solo probé el de bondio. Masa crocante y supeeeer rellenos. Están excelentes amiga. Recomiendo con ensaladita. Me re salvó encima.",
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
    <section id="opiniones" className="py-16 bg-gradient-to-t from-muted/50 to-background">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              No lo decimos nosotros, lo dicen ellos 🌯
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <div
                key={t.author}
                className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-foreground leading-relaxed mb-4 italic">
                  "{t.text}"
                </p>
                <p className="text-sm font-bold text-primary">— {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
