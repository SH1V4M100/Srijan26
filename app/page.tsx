import Balls from "@/components/Balls";
import { HeroSection } from "@/components/Landing/HeroSection";
import { PastSponsors } from "@/components/Landing/PastSponsors";
import Timeline from "@/components/Landing/Timeline";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Balls />
      <Timeline />
      <PastSponsors />
    </>
  );
}
