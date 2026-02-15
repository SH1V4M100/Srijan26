"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export const MarqueeSlider = ({
  name,
  itemCount,
  children,
}: {
  name: string;
  itemCount: number;
  children: React.ReactNode;
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline().to(".scroller", {
        xPercent: -100,
        ease: "none",
        repeat: -1,
        duration: itemCount * 4,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="full-bleed pt-20">
      <h2 className="p-0 font-elnath text-2xl md:text-4xl lg:text-5xl uppercase tracking-[0.3em] ml-10 mb-4 sm:ml-18 lg:ml-24">
        {name}
      </h2>
      <ul className="flex m-auto overflow-hidden select-none">
        <div className="scroller flex shrink-0">{children}</div>
        <div className="scroller flex shrink-0">{children}</div>
        <div className="scroller flex shrink-0">{children}</div>
        <div className="scroller flex shrink-0">{children}</div>
      </ul>
    </section>
  );
};
