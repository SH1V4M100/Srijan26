import React from "react";
import SwipeReveal from "./SwipeReveal";

interface Props {
  category: string;
  className?: string;
}

export default function EventTags({ category, className }: Props) {
  return (
    <SwipeReveal>
      <div className={` ${className} flex flex-wrap gap-3`}>
        <span className="bg-white/10 border border-white/20 px-3 py-1 rounded text-xs uppercase tracking-wider text-white">
          Srijan '26
        </span>
        <span className="bg-white/10 border border-white/20 px-3 py-1 rounded text-xs uppercase tracking-wider text-white">
          {category}
        </span>
      </div>
    </SwipeReveal>
  );
}
