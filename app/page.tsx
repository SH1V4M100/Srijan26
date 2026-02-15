import Balls from "@/components/Balls";
import { HeroSection } from "@/components/Landing/HeroSection";
import { Carousel } from "@/components/Landing/ImageCarousel";
import { PastSponsors } from "@/components/Landing/PastSponsors";
import Timeline from "@/components/Landing/Timeline";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Balls />
      <Timeline />
      <PastSponsors />
      <Carousel
        baseWidth={320}
        autoplay
        autoplayDelay={2000}
        pauseOnHover
        loop
        round={false}
      />
    </>
  );
}
