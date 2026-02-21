"use client";
import { Event } from "@/components/events/types/events";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { CLIP_PATH, EVENTS_DATA } from "./constants/events";
import { useGSAP } from "@gsap/react";

interface Props {
  event: Event;
}

export default function EventNavigation({ event }: Props) {
  const desktopClipStyle = {
    "--desktop-clip": CLIP_PATH,
  } as React.CSSProperties;

  const currentIndex = EVENTS_DATA.findIndex((e) => e.slug === event.slug);
  const prevEvent = currentIndex > 0 ? EVENTS_DATA[currentIndex - 1] : null;
  const nextEvent = currentIndex < EVENTS_DATA.length - 1 ? EVENTS_DATA[currentIndex + 1] : null;

  return (
    <div className="flex justify-between items-center w-full z-20 relative pt-4">
      <div className="flex items-center gap-2 md:gap-4">
        {prevEvent && (
          <Link
            href={`/events/${prevEvent.slug}`}
            style={desktopClipStyle}
            className={`flex items-center gap-1 md:gap-2 bg-white/20 text-white hover:text-black hover:bg-white active:scale-[0.98] duration-150 transition-all uppercase text-xs font-euclid tracking-wider group px-4 py-2 md:pl-8 md:pr-14 md:py-2 rounded-full md:rounded-none md:[clip-path:var(--desktop-clip)]`}
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            <span className="hidden md:inline">Prev</span>
          </Link>
        )}

        <Link
          href="/events"
          style={desktopClipStyle}
          className={`flex items-center gap-2 bg-white/20 text-white hover:text-black hover:bg-white active:scale-[0.98] duration-150 transition-all uppercase text-xs font-euclid tracking-wider group px-4 py-2 md:pl-10 md:pr-14 md:py-2 rounded-full md:rounded-none md:[clip-path:var(--desktop-clip)]`}
        >
          All Events
        </Link>
      </div>

      <div>
        {nextEvent && (
          <Link
            href={`/events/${nextEvent.slug}`}
            style={desktopClipStyle}
            className={`flex items-center gap-1 md:gap-2 bg-white/20 text-white hover:text-black hover:bg-white active:scale-[0.98] duration-150 transition-all uppercase text-xs font-euclid tracking-wider group px-4 py-2 md:pl-10 md:pr-12 md:py-2 rounded-full md:rounded-none md:[clip-path:var(--desktop-clip)]`}
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
