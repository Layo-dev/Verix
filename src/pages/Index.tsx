import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import VirtualNumbers from "@/components/VirtualNumbers";
import Partners from "@/components/Partners";
import Marketplace from "@/components/Marketplace";
import Dashboard from "@/components/Dashboard";
import WhyChoose from "@/components/WhyChoose";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <VirtualNumbers />
        <Partners />
        <Marketplace />
        <Dashboard />
        <WhyChoose />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
