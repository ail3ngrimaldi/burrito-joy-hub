const Footer = () => {
  return (
    <footer className="py-8 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌯</span>
            <span className="font-display font-bold text-lg">
              BurritoLab
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-background/70">
            <a href="#productos" className="hover:text-background transition-colors">
              Productos
            </a>
            <a href="#propuesta" className="hover:text-background transition-colors">
              ¿Cómo funciona?
            </a>
            <a href="#contacto" className="hover:text-background transition-colors">
              Contacto
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} Hecho con 🔥 y mucho queso
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
