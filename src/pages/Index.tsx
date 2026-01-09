import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import ValueProposition from "@/components/ValueProposition";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <HeroSection />
        <ProductsSection />
        <ValueProposition />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
