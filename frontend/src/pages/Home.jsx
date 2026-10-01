import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import FreshListings from "../components/FreshListings";
import HowItWorks from "../components/HowItWorks";
import FinalCTA from "../components/FinalCTA";

function Home() {
  return (
    <main>
      <Hero />

      <CategorySection />

      <FreshListings />

      <HowItWorks />

      <FinalCTA />
    </main>
  );
}

export default Home;