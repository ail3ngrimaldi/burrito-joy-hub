import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import ValueProposition from "@/components/ValueProposition";
import ComingSoonSection from "@/components/ComingSoonSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import OrderForm from "@/components/OrderForm";

const Index = () => {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({});

  const handleOrderClick = (quantities: Record<string, number>) => {
    setOrderQuantities(quantities);
    setIsOrderFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <HeroSection />
        <ProductsSection onOrderClick={handleOrderClick} />
        <ValueProposition />
        <ComingSoonSection />
        <ContactSection />
      </main>
      
      <Footer />

      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        quantities={orderQuantities}
      />
    </div>
  );
};

export default Index;
