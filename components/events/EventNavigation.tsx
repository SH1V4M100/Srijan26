"use client";
import { Event } from "@/components/events/types/events";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { CLIP_PATH, EVENTS_DATA } from "./constants/events";
import { useRouter } from "next/navigation";

interface Props {
  event: Event;
  onNavigate: (url: string) => void;
}

export default function EventNavigation({ event, onNavigate }: Props) {
  const desktopClipStyle = {
    "--desktop-clip": CLIP_PATH,
  } as React.CSSProperties;

  const router = useRouter();
  const currentId = parseInt(event.id);

  // Use your existing math to grab the correct slugs from the array
  // (Subtract 2 because currentId is 1-based, but arrays are 0-based)
  const prevSlug = currentId > 1 ? EVENTS_DATA[currentId - 2].slug : null;
  const nextSlug =
    currentId < EVENTS_DATA.length ? EVENTS_DATA[currentId].slug : null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Use onNavigate instead of router.push!
      if (e.key === "ArrowLeft" && prevSlug) {
        onNavigate(`/events/${prevSlug}`);
      } else if (e.key === "ArrowRight" && nextSlug) {
        onNavigate(`/events/${nextSlug}`);
      } else if (e.key === "Escape") {
        onNavigate("/events");
      }
    },
    [prevSlug, nextSlug, onNavigate], // Update dependencies
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <section className="sticky top-20 z-50">
      <div className="top-0 flex justify-between items-center w-full z-20 relative pt-4">
        <div className="flex items-center gap-2 md:gap-4">
          {prevSlug && (
            <button
              onClick={() => onNavigate(`/events/${prevSlug}`)}
              style={desktopClipStyle}
              className={`flex items-center gap-1 md:gap-2 bg-white text-black hover:text-white hover:bg-red active:scale-[0.98] duration-150 transition-all uppercase text-xs font-euclid tracking-wider group px-4 py-2 md:pl-8 md:pr-14 md:py-2 rounded-full md:rounded-none md:[clip-path:var(--desktop-clip)]`}
            >
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              <span className="hidden md:inline">Prev</span>
            </button>
          )}

          <button
            onClick={() => onNavigate("/events")}
            style={desktopClipStyle}
            className={`flex items-center gap-1 md:gap-2 bg-white text-black hover:text-white hover:bg-red active:scale-[0.98] duration-150 transition-all uppercase text-xs font-euclid tracking-wider group px-4 py-2 md:pl-8 md:pr-14 md:py-2 rounded-full md:rounded-none md:[clip-path:var(--desktop-clip)]`}
          >
            All Events
          </button>
        </div>

        <div>
          {nextSlug && (
            <button
              onClick={() => onNavigate(`/events/${nextSlug}`)}
              style={desktopClipStyle}
              className={`flex items-center gap-1 md:gap-2 bg-white text-black hover:text-white hover:bg-red active:scale-[0.98] duration-150 transition-all uppercase text-xs font-euclid tracking-wider group px-4 py-2 md:pl-8 md:pr-14 md:py-2 rounded-full md:rounded-none md:[clip-path:var(--desktop-clip)]`}
            >
              <span className="hidden md:inline">Next</span>
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
