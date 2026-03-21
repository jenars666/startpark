import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturesBar from "../components/FeaturesBar";
import Catalog from "../components/Catalog";
import PromoBanners from "../components/PromoBanners";
import LatestCollection from "../components/LatestCollection";
import StyleUpgrade from "../components/StyleUpgrade";
import CustomerReviews from "../components/CustomerReviews";
import Newsletter from "../components/Newsletter";
import FoundersNote from "../components/FoundersNote";
import LoyaltyPunchCard from "../components/LoyaltyPunchCard";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import WhatsAppFloating from "../components/WhatsAppFloating";

export default function Home() {
  return (
    <>
      <Header />
      <Navbar />
      <main>
        <Hero />
        <FeaturesBar />
        <Catalog />
        <PromoBanners />
        <LatestCollection />
        <StyleUpgrade />
        <CustomerReviews />
        <Newsletter />
        <FoundersNote />
        <LoyaltyPunchCard />
        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
}
