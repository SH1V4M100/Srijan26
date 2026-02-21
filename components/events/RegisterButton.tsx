import React from "react";
import Link from "next/link";
import { CircleCheckBig, CircleOff } from "lucide-react";
import { CLIP_PATH } from "./constants/events";

interface RegisterButtonProps {
  status: string;
  link: string;
  isCard?: boolean;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ status, link, isCard }) => {
  const desktopClipStyle = { "--desktop-clip": CLIP_PATH } as React.CSSProperties;

  if (status === "Closed") {
    return (
      <button
        style={desktopClipStyle}
        className={`bg-gray-800 text-gray-500 font-euclid uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2
          ${isCard
            ? "py-2 w-full text-xs font-bold [clip-path:var(--desktop-clip)]" 
            : "flex-1 sm:flex-none px-6 py-2 md:pl-10 md:pr-16 md:py-2 lg:text-sm text-xs rounded-full md:rounded-none md:[clip-path:var(--desktop-clip)]"
          }`}
      >
        Closed <CircleOff size={isCard ? 16 : 18} />
      </button>
    );
  }

  return (
    <Link
      href={link}
      style={desktopClipStyle}
      // ADDED: active:scale-[0.98] active:bg-red-800
      className={`text-white font-euclid uppercase font-bold tracking-wider transition-all duration-150 flex items-center justify-center gap-2 bg-red hover:bg-red-700 active:scale-[0.98] active:bg-red-800
        ${isCard
          ? "py-2 w-full text-xs [clip-path:var(--desktop-clip)]"
          : "sm:flex-none px-6 py-2 md:pl-10 md:pr-16 md:py-2 lg:text-sm text-xs rounded-full md:rounded-none md:[clip-path:var(--desktop-clip)]"
        }`}
    >
      Register <CircleCheckBig size={isCard ? 16 : 18} strokeWidth={2.5} />
    </Link>
  );
};

export default RegisterButton;