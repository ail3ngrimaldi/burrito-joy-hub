import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const ContactSection = () => {
  const handleWhatsAppClick = () => {
    const message = "¡Hola! 👋 Tengo una consulta sobre los burritos...";
    const whatsappUrl = `https://wa.me/5491124003293?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="contacto" className="py-20 bg-gradient-to-t from-muted/50 to-background">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
          {/* Icon */}
          <div className="w-20 h-20 bg-burrito-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-burrito-green" />
          </div>

          {/* Content */}
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Dudas? ¿Consultas? ¿Hambre?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Escribinos por WhatsApp y te respondemos al toque. 
            También podés pedirnos recomendaciones si no sabés qué sabor elegir. 
            <span className="text-primary font-medium"> No juzgamos.</span>
          </p>

          <Button 
            variant="whatsapp" 
            size="xl" 
            onClick={handleWhatsAppClick}
            className="group"
          >
            <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
            Escribinos por WhatsApp
          </Button>

          {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Vicente Lopez, Argentina</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⏰</span>
                <span>Respondemos 9 a 21hs</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🚚</span>
                <span>Envíos Viernes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
