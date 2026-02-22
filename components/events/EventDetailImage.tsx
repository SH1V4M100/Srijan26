"use client";

import { useRef } from "react";
import { IMAGE_CLIP_PATH } from "./constants/events";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SwipeReveal from "./SwipeReveal";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export default function EventDetailImage({ src, alt, className }: Props) {
  useGSAP(() => {
    gsap.fromTo(
      ".entryLayers",
      { scaleX: 1 },
      {
        scaleX: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        transformOrigin: "right center",
        force3D: true,
      },
    );
  }, []);

  return (
    <div
      className={` ${className} relative w-full max-w-md aspect-3/4 lg:max-w-sm group`}
    >
      {/* Actual Image */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ clipPath: IMAGE_CLIP_PATH }}
      >
        <SwipeReveal>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        </SwipeReveal>
      </div>
    </div>
  );
}
