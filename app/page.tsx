import Balls from "@/components/Balls";
import { HeroSection } from "@/components/Landing/HeroSection";
import Timeline from "@/components/Landing/Timeline";
import Footer from "@/components/Landing/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Balls />
      <Timeline />
      <Footer />
    </>
  );
}
