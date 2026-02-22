"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function SwipeReveal({ children, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ENTER ANIMATION: Content reveals itself from Left to Right
    gsap.fromTo(
      ".clip-reveal-content",
      {
        // Initial State: Clipped completely to the left edge (invisible)
        clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      },
      {
        // Final State: Fully opened rectangle revealing the content
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.5,
        ease: "power2.out",
      }
    );
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden w-full h-full ${className}`}
    >
      {/* We apply the class directly to the wrapper holding your children */}
      <div className="clip-reveal-content will-change-[clip-path] w-full h-full">
        {children}
      </div>
    </div>
  );
}