import QuickGuide from "@/components/QuickGuide/QuickGuide";
import ExploreCards from "@/components/ExploreCards/ExploreCards";
import HeroVideo from "@/components/HeroVideo/HeroVideo";
import Tagline from "@/components/Tagline/Tagline";
import Chatbot from "@/components/Chatbot/Chatbot";
import Map from "@/components/Map/Map";

export default function Home() {
  return (
    <section className="sf-container" id="top">
      <HeroVideo />
      <Tagline> Helping students better understand the policies, rights, and responsibilities related to freedom of expression on campus. </Tagline>
      <ExploreCards />
      <Map />
      <QuickGuide />
      <Chatbot />
    </section>
  );
}