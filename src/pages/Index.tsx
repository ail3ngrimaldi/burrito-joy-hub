import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import ValueProposition from "@/components/ValueProposition";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import CartDrawer from "@/components/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PageLoader from "@/components/PageLoader";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for window load (or fallback) so the loader actually
    // covers asset/font loading. Min duration keeps the animation graceful.
    const minDuration = 1100;
    const start = Date.now();

    const finish = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDuration - elapsed);
      window.setTimeout(() => setIsLoading(false), remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      // Hard cap: never block the UI for more than 2.5s
      const cap = window.setTimeout(finish, 2500);
      return () => {
        window.removeEventListener("load", finish);
        window.clearTimeout(cap);
      };
    }
  }, []);

  useScrollReveal();

  return (
    <>
      {isLoading && <PageLoader />}
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-16">
          <HeroSection />
          <ProductsSection />
          <ValueProposition />
          <TestimonialsSection />
        </main>
        
        <Footer />

        <FloatingWhatsApp />
        <FloatingCart onClick={() => setIsCartOpen(true)} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </>
  );
};

export default Index;
