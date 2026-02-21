"use client";

import React, { useState } from "react";
import { Share2 } from "lucide-react";
import ShareModal from "./ShareModal";
import { CLIP_PATH } from "./constants/events";

interface ShareButtonProps {
  eventId: string;
  eventTitle: string;
  isCard?: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  eventId,
  eventTitle,
  isCard,
}) => {
  const [open, setOpen] = useState(false);
  const desktopClipStyle = {
    "--desktop-clip": CLIP_PATH,
  } as React.CSSProperties;

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        style={desktopClipStyle}
        className={`bg-white hover:bg-white/80 active:scale-[0.98] active:bg-gray-200 transition-all duration-150 text-black font-euclid uppercase font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer 
        ${
          isCard
            ? "py-2 w-full text-xs [clip-path:var(--desktop-clip)]"
            : "p-3 md:pl-10 md:pr-14 md:py-2 lg:text-sm text-xs rounded-full md:rounded-none md:[clip-path:var(--desktop-clip)]"
        }`}
      >
        <span className={isCard ? "inline" : "hidden md:inline"}>Share</span>
        <Share2 size={isCard ? 16 : 18} strokeWidth={2} />
      </button>

      <ShareModal
        open={open}
        onClose={() => setOpen(false)}
        eventId={eventId}
        eventTitle={eventTitle}
      />
    </>
  );
};

export default ShareButton;