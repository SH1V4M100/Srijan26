"use client";

import React, { useRef, memo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Users, Trophy, MapPin, Info } from "lucide-react";
import { Event } from "@/components/events/types/events";
import { CLIP_PATH } from "./constants/events";
import RegisterButton from "./RegisterButton";
import ShareButton from "./ShareButton";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = memo(({ event }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleTagsRef = useRef<HTMLDivElement>(null);
  const hiddenContentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const entryLayerRef = useRef<HTMLDivElement>(null);
  const outLineRef = useRef<SVGSVGElement>(null);

  const hoverTl = useRef<gsap.core.Timeline | null>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // --- ANIMATION INITIALIZATION ---
  useGSAP(() => {
    hoverTl.current = gsap
      .timeline({ paused: true })
      .set(imageRef.current, { filter: "blur(0px) brightness(1)" })
      .to(
        imageRef.current,
        {
          scale: 1.1,
          filter: "blur(2px) brightness(0.5)",
          duration: 0.5,
          ease: "power2.inOut",
        },
        0,
      )
      .to(
        outLineRef.current,
        {
          autoAlpha: 1,
          duration: 0.3,
        },
        0,
      )
      .to(
        titleRef.current,
        {
          color: "#fde047",
          duration: 0.3,
        },
        0,
      )
      .set(hiddenContentRef.current, { display: "flex" }, 0)
      .to(
        hiddenContentRef.current,
        {
          height: "auto",
          duration: 0.4,
          ease: "power2.inOut",
        },
        0,
      );

    // Setup Entry animation using Intersection Observer
    if (entryLayerRef.current && containerRef.current) {
      const entryAnim = gsap.fromTo(
        entryLayerRef.current.children,
        { scaleX: 1 },
        {
          scaleX: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          transformOrigin: "right center",
          force3D: true,
          paused: true,
        },
      );

      // Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          // If the card enters the viewport (even due to a filter layout shift)
          if (entries[0].isIntersecting) {
            entryAnim.play();
            observer.disconnect(); // Disconnect so it only plays once
          }
        },
        { threshold: 0.4 }, // Triggers when 30% of the card is visible (similar to your top 70%)
      );

      // Start observing the card container
      observer.observe(containerRef.current);

      // Cleanup on unmount
      return () => observer.disconnect();
    }
  }, [event.slug]);

  // --- OPTIMIZED EVENT HANDLERS ---
  const handleMouseEnter = contextSafe(() => {
    hoverTl.current?.play();
  });

  const handleMouseLeave = contextSafe(() => {
    hoverTl.current?.reverse();
  });

  // Reverses the animation when an action button is clicked
  const handleActionClick = contextSafe(() => {
    hoverTl.current?.reverse();
  });

  return (
    <div className="relative w-74 h-104 hidden lg:block">
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          clipPath:
            "polygon(37.2px 0%, 100% 0%, 100% calc(100% - 37.2px), calc(100% - 37.2px) 100%, 0% 100%, 0% 37.2px)",
        }}
        // Added will-change-transform for GPU optimization
        className="relative top-1/2 left-1/2 -translate-1/2 z-10 bg-[#121212] overflow-hidden h-101 w-71 cursor-pointer will-change-transform"
      >
        {/* Entry animation layer */}
        <div
          ref={entryLayerRef}
          className="absolute inset-0 h-full w-full z-50 pointer-events-none"
        >
          <div className="entryLayers absolute scale-x-100 inset-0 h-full w-full origin-right z-30 bg-black will-change-transform" />
          <div className="entryLayers absolute scale-x-100 inset-0 h-full w-full origin-right z-20 bg-red will-change-transform" />
          <div className="entryLayers absolute scale-x-100 inset-0 h-full w-full origin-right z-10 bg-amber-300 will-change-transform" />
          <div className="entryLayers absolute scale-x-100 inset-0 h-full w-full origin-right z-0 bg-white will-change-transform" />
        </div>

        {/* 1. BACKGROUND IMAGE LAYER */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            ref={imageRef}
            src={event.image}
            alt={event.title}
            fill
            className="w-full h-full object-cover object-top will-change-[transform,filter]"
          />
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent pointer-events-none"
          />
        </div>

        {/* 2. STATUS BADGE */}
        <div
          className={`font-euclid absolute top-3 right-3 z-20 text-[10px] font-semibold px-2 py-1 rounded uppercase tracking-wider ${event.status === "Open"
            ? "bg-green-500 text-white"
            : event.status === "Closed"
              ? "bg-red-500 text-white"
              : "bg-yellow-500 text-white"
            }`}
        >
          {event.status}
        </div>

        {/* 3. CONTENT CONTAINER */}
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end z-10 pointer-events-none">
          {/* Make children pointer-events-auto so only they are clickable, not the empty space */}

          {/* -- ALWAYS VISIBLE PART (Title & Tags) -- */}
          <div
            ref={titleTagsRef}
            className="flex flex-col gap-2 relative z-20 pointer-events-auto"
          >
            <div className="flex flex-wrap gap-2">
              {event.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="font-euclid bg-red-600/50 text-[10px] px-2 py-0.5 rounded text-red-100 uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3
              ref={titleRef}
              className="font-elnath text-2xl font-bold text-white uppercase will-change-[color]"
            >
              {event.title}
            </h3>
          </div>

          {/* -- HIDDEN PART (Description, Meta, Buttons) -- */}
          <div
            ref={hiddenContentRef}
            className="h-0 overflow-hidden flex flex-col gap-4 pointer-events-auto will-change-[height]"
            style={{ display: "none" }}
          >
            <div className="flex">
              <p className="font-euclid text-gray-300 text-xs leading-relaxed line-clamp-2 pt-2">
                {event.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px] text-white/80 font-euclid border-t border-white/10 pt-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-white" />
                <span>{event.finalsDate || event.lastDate || "TBD"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-white" />
                <span>{event.teamSize}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-3 h-3 text-yellow-300" />
                <span className="text-yellow-300">{event.prizePool}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-white" />
                <span>{event.format}</span>
              </div>
            </div>

            {/* Buttons - Added onClickCapture here */}
            <div
              className="flex flex-col gap-2 pb-1"
              onClickCapture={handleActionClick}
            >
              <RegisterButton
                status={event.status}
                link={event.link}
                isCard={true}
              />

              <Link
                href={`/events/${event.slug}`}
                style={{ clipPath: CLIP_PATH }}
                className="font-euclid text-xs uppercase font-bold flex items-center justify-center py-2 gap-2 rounded bg-white hover:bg-yellow-300 active:scale-[0.98] duration-200 transition-all text-black"
                title="More Info"
              >
                <p>More Info</p>
                <Info size={16} strokeWidth={2} />
              </Link>

              <ShareButton
                eventId={event.slug}
                eventTitle={event.title}
                isCard={true}
              />
            </div>
          </div>
        </div>
      </div>
      <svg
        ref={outLineRef}
        viewBox="0 0 297 417"
        className="absolute z-10 top-0 left-0 h-104 w-74 max-w-[20rem] pointer-events-none opacity-0 will-change-[opacity]"
      >
        <path
          d="M 40 1 L 295 1 L 295 376 L 256 415 L 1 415 L 1 40 Z"
          fill="transparent"
          stroke={event.color}
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
});

EventCard.displayName = "EventCard";

export default EventCard;
