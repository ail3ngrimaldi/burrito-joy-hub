import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import ValueProposition from "@/components/ValueProposition";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import CartDrawer from "@/components/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
// PageLoader temporalmente desactivado — pendiente de animación definitiva.
// import PageLoader from "@/components/PageLoader";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  useScrollReveal();

  return (
    <>
      {/* {isLoading && <PageLoader />} */}
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
