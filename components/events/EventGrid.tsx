"use client";

import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Event } from "@/components/events/types/events";
import EventCard from "./EventCard";
import EventCardTouch from "./EventCardTouch";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface EventGridProps {
  filteredEvents: Event[];
}

const EventGrid: React.FC<EventGridProps> = ({ filteredEvents }) => {
  // We create a unique string based on the current items in the list. When the user changes a tag, this string changes.
  const filterKey = filteredEvents.map((e) => e.id).join("-");

  // Force GSAP to recalculate trigger positions after the layout settles
  useGSAP(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => clearTimeout(timer);
  }, [filterKey]); // Re-run this whenever the list of events changes

  return (
    <div className="flex flex-wrap gap-6 items-center justify-center w-full">
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          // By adding the filterKey to the React key, we force React to completely remount the cards when the category changes.
          <React.Fragment key={`${filterKey}-${event.id}`}>
            <EventCard event={event} />
            <EventCardTouch event={event} />
          </React.Fragment>
        ))
      ) : (
        <div className="font-euclid col-span-full py-20 text-center text-lg text-white/70">
          <p>No events found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default EventGrid;