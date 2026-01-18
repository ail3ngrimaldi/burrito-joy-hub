import { Button } from "@/components/ui/button";
import { Menu, X, Truck } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/config/site";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToProducts = () => {
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const { name, logoFont, delivery } = siteConfig;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      {/* Mobile delivery banner - only visible on small screens */}
      <div className="lg:hidden flex items-center justify-center gap-2 py-2 bg-primary/10 border-b border-border/30">
        <Truck className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          {delivery.message} {delivery.days}
        </span>
      </div>
      
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <h1 className="flex items-center group">
            <a 
              href="/" 
              className="brand-name hover:opacity-80 transition-opacity"
            >
              {name}
            </a>
          </h1>

          {/* Desktop nav - hidden on mobile and tablet */}
          <nav className="hidden lg:flex items-center gap-8">
            <a 
              href="#productos" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Productos
            </a>
            <a 
              href="#propuesta" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ¿Cómo funciona?
            </a>
            <a 
              href="#contacto" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contacto
            </a>
            <Button variant="default" size="sm" onClick={scrollToProducts}>
              Pedir ahora
            </Button>
          </nav>

          {/* Mobile/Tablet menu button - visible until lg breakpoint */}
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile/Tablet menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              <a 
                href="#productos" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </a>
              <a 
                href="#propuesta" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                ¿Cómo funciona?
              </a>
              <a 
                href="#contacto" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </a>
              <div className="px-4 pt-2">
                <Button variant="default" className="w-full" onClick={scrollToProducts}>
                  Pedir ahora
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
