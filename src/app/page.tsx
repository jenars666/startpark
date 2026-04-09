import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturesBar from "../components/FeaturesBar";
import Catalog from "../components/Catalog";
import PromoBanners from "../components/PromoBanners";

import StyleUpgrade from "../components/StyleUpgrade";
import CustomerReviews from "../components/CustomerReviews";
import Newsletter from "../components/Newsletter";
import FoundersNote from "../components/FoundersNote";
import LoyaltyPunchCard from "../components/LoyaltyPunchCard";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ScrollReveal from "../components/ScrollReveal";

export default function RootHomePage() {
  return (
    <>
      <Header />
      <Navbar />
      <main>
        <Hero />
        
        <ScrollReveal direction="up" delay={0.1}>
          <FeaturesBar />
        </ScrollReveal>
        
        <ScrollReveal direction="left" delay={0.2}>
          <Catalog />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.1}>
          <PromoBanners />
        </ScrollReveal>
        

        
        <ScrollReveal direction="up" delay={0.1}>
          <StyleUpgrade />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.3}>
          <CustomerReviews />
        </ScrollReveal>

        <ScrollReveal direction="none" delay={0.2}>
          <Newsletter />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <FoundersNote />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <LoyaltyPunchCard />
        </ScrollReveal>

        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
}
