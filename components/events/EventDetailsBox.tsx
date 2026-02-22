import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { Event } from "@/components/events/types/events";
import SwipeReveal from "./SwipeReveal";

interface Props {
  event: Event;
  className?: string;
}

export default function EventDetailsBox({ event, className }: Props) {
  return (
    <SwipeReveal>
      <div className={` ${className} space-y-4 text-white `}>
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
    </SwipeReveal>
  );
}
