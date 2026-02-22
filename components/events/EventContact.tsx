import React from "react";
import { Phone } from "lucide-react";
import SwipeReveal from "./SwipeReveal";

interface Coordinator {
  name: string;
  contact: string;
}

interface Props {
  coordinators: Coordinator[];
  color: string;
  className?: string;
}

export default function EventContact({
  coordinators,
  color,
  className,
}: Props) {
  return (
    <SwipeReveal>
      <div className={` ${className} space-y-6 `}>
        <h2
          className="font-elnath text-3xl uppercase border-b pb-2"
          style={{ color }}
        >
          Contact
        </h2>
        <div className="space-y-2">
          {coordinators.map((coord, index) => (
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
    </SwipeReveal>
  );
}
