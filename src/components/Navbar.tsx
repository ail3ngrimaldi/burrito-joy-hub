import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/config/site";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToProducts = () => {
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const { name } = siteConfig;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="brand-name hover:opacity-70 transition-opacity">
            {name}
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#productos" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              Productos
            </a>
            <a href="#propuesta" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
            <Button variant="hero" size="sm" onClick={scrollToProducts}>
              Pedir
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-border">
            <nav className="flex flex-col gap-4">
              <a href="#productos" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                Productos
              </a>
              <a href="#propuesta" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                FAQ
              </a>
              <Button variant="hero" size="default" onClick={scrollToProducts} className="w-full mt-2">
                Pedir ahora
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
