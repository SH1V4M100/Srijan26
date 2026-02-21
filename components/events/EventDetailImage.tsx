"use client";

import { IMAGE_CLIP_PATH } from "./constants/events";

interface Props {
  src: string;
  alt: string;
}

export default function EventDetailImage({ src, alt }: Props) {
  return (
    <div className="relative w-full max-w-md aspect-3/4 lg:max-w-sm group">
      {/* Actual Image */}
      <div
        className="relative w-full h-full bg-[#121212] overflow-hidden"
        style={{ clipPath: IMAGE_CLIP_PATH }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    </div>
  );
}