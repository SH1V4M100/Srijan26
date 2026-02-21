"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Calendar,
  Users,
  Trophy,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  Award,
} from "lucide-react";
import { Event } from "@/components/events/types/events";
import { CLIP_PATH, EVENTS_DATA, IMAGE_CLIP_PATH } from "./constants/events";
import EventDetailImage from "./EventDetailImage";
import WavyGradient from "../WavyGradient";
import ShareButton from "./ShareButton";
import RegisterButton from "./RegisterButton";

interface Props {
  event: Event;
}

export default function EventDetailsClient({ event }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // CSS Variable approach for the Nav arrows
  const desktopClipStyle = { "--desktop-clip": CLIP_PATH } as React.CSSProperties;

  useGSAP(() => {
    // Basic entry animation for the page
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    );
  }, []);

  return (
    <main
      className={`min-h-screen text-white pb-32 px-6 md:px-12 lg:px-24 font-euclid selection:bg-orange-400 selection:text-white`}
    >
      {/* Background Gradient */}
      <WavyGradient
        brightness={0.5}
        color1="#F09400"
        color2="#A80000"
        color3="#1A0000"
        direction={20}
        speed={1.5}
        waveHeight={0.45}
        noiseIntensity={5}
        waveAmplitude={1}
      />

      <div ref={containerRef} className="max-w-7xl mx-auto space-y-8">
        {/* EVENT NAVIGATION ARROWS */}
        <div className="flex justify-between items-center w-full z-20 relative pt-4">
          <div className="flex items-center gap-2 md:gap-4">
            {parseInt(event.id) > 1 && (
              <Link
                href={`/events/${parseInt(event.id) - 1}`}
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
            {parseInt(event.id) < EVENTS_DATA.length && (
              <Link
                href={`/events/${parseInt(event.id) + 1}`}
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

        {/* TOP HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12">
          {/* Left: Image */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-start">
            <EventDetailImage
              src={event.image}
              alt={event.title}
              color={event.color}
            />
          </div>

          {/* Right: Event Info */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Tags / Badges */}
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/10 border border-white/20 px-3 py-1 rounded text-xs uppercase tracking-wider text-white">
                Srijan '26
              </span>
              <span className="bg-white/10 border border-white/20 px-3 py-1 rounded text-xs uppercase tracking-wider text-white">
                {event.category}
              </span>
            </div>

            {/* Title Block with LAST REGISTRATION DATE */}
            <div className="flex flex-col gap-2">
              {/* Added Last Registration Date right here */}
              <p className="font-bold uppercase tracking-wider text-sm md:text-base flex items-center gap-2 text-white/70">
                <Calendar size={16} stroke={event.color} />
                Last Registration Date : {""}
                <span  style={{ color: event.color }} >{event.lastDate ? event.lastDate : "To be decided yet"}</span>
              </p>

              <h1
                style={{ color: event.color }}
                className="font-elnath text-5xl md:text-7xl font-bold uppercase tracking-wide"
              >
                {event.title}
              </h1>
              
              <p className="mt-2 text-sm md:text-base text-white/70 leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-0 backdrop-blur-sm mt-4">
              {/* Event Details Box */}
              <div className="space-y-4 text-white">
                <h3
                  style={{
                    color: event.color,
                    borderBottom: `2px solid ${event.color}`,
                  }}
                  className="font-elnath text-xl uppercase border-b-2 border-white/80 pb-2 inline-block"
                >
                  Event Details
                </h3>
                <div className="space-y-3 text-sm">
                  {event.lastDate && !event.prelimsDate && !event.finalsDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4" style={{ color: event.color }} />
                      <span>{event.lastDate}</span>
                    </div>
                  )}
                  {event.prelimsDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4" style={{ color: event.color }} />
                      <span>Prelims: {event.prelimsDate}</span>
                    </div>
                  )}
                  {event.finalsDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4" style={{ color: event.color }} />
                      <span>Finals: {event.finalsDate}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" style={{ color: event.color }} />
                    <span>{event.format}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" style={{ color: event.color }} />
                    <span>{event.teamSize}</span>
                  </div>
                </div>
              </div>

              {/* Prize Pool Box */}
              <div className="space-y-4">
                <h3
                  style={{
                    color: event.color,
                    borderBottom: `2px solid ${event.color}`,
                  }}
                  className="font-elnath text-xl uppercase border-b-2 border-white/80 pb-2 inline-block"
                >
                  Prize Pool
                </h3>
                <div className="flex items-center gap-4">
                  <span
                    className="text-4xl font-bold tracking-wider"
                    style={{ color: event.color }}
                  >
                    {event.prizePool}
                  </span>
                </div>
                {(event.winnerPrize || event.runnersUpPrize || event.secondRunnersUpPrize) && (
                  <div className="space-y-2 pt-2 text-base text-gray-300">
                    {event.winnerPrize && (
                      <div className="flex items-center gap-2">
                        <Award size={20} style={{ color: event.color }} />
                        <p className="uppercase tracking-wider">
                          1st Prize:{" "}
                          <span className="font-bold text-white tracking-wider">
                            {event.winnerPrize}
                          </span>
                        </p>
                      </div>
                    )}
                    {event.runnersUpPrize && (
                      <div className="flex items-center gap-2">
                        <Award size={20} style={{ color: event.color }} />
                        <p className="uppercase tracking-wider">
                          2nd Prize:{" "}
                          <span className="font-bold text-white tracking-wider">
                            {event.runnersUpPrize}
                          </span>
                        </p>
                      </div>
                    )}
                    {event.secondRunnersUpPrize && (
                      <div className="flex items-center gap-2">
                        <Award size={20} style={{ color: event.color }} />
                        <p className="uppercase tracking-wider">
                          3rd Prize:{" "}
                          <span className="font-bold text-white tracking-wider">
                            {event.secondRunnersUpPrize}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CONTENT SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-white/10 pt-12">
          
          {/* Event Rules Section */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
              <h2 className="font-elnath text-3xl uppercase" style={{ color: event.color }}>
                Event Rules
              </h2>
              <ul className="space-y-3 text-white">
                {event.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h2 className="font-elnath text-3xl uppercase border-b pb-2" style={{ color: event.color }}>
              Contact
            </h2>
            <div className="space-y-2">
              {event.coordinators.map((coord, index) => (
                <div key={index} className="py-2 flex items-center justify-between">
                  <span className="text-gray-200">{coord.name}</span>
                  <a
                    href={`tel:${coord.contact}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Phone size={16} strokeWidth={2} />
                    {coord.contact}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* FLOATING ACTION BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-[#121212] p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <p className="text-gray-400 text-left text-sm font-bold uppercase tracking-wider">
            Status:{" "}
            <span
              className={
                event.status === "Open"
                  ? "text-green-400"
                  : event.status === "Closed"
                    ? "text-red-400"
                    : "text-yellow-300"
              }
            >
              {event.status}
            </span>
          </p>

          <div className="flex gap-2 sm:gap-4 w-fit">
            <ShareButton eventId={event.id} eventTitle={event.title} />
            <RegisterButton status={event.status} link={event.link} />
          </div>
        </div>
      </div>
    </main>
  );
}