import React from "react";
import SwipeReveal from "./SwipeReveal";

interface Props {
  rules: string[];
  color: string;
  className?: string;
}

export default function EventRules({ rules, color, className }: Props) {
  return (
    <SwipeReveal>
      <div className={` ${className} space-y-4`}>
        <h2 className="font-elnath text-3xl uppercase" style={{ color }}>
          Event Rules
        </h2>
        <ul className="space-y-3 text-white">
          {rules.map((rule, index) => (
            <li key={index} className="flex items-start gap-3">
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="leading-relaxed">{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </SwipeReveal>
  );
}
