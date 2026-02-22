"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Copy,
  Check,
  Send,
  MessageCircle,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Share,
} from "lucide-react";
import "./events.css";

interface Props {
  open: boolean;
  onClose: () => void;
  eventSlug: string;
  eventTitle: string;
}

const ShareModal: React.FC<Props> = ({ open, onClose, eventSlug, eventTitle }) => {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [mounted, setMounted] = useState(false); // Needed for Next.js SSR

  useEffect(() => {
    setMounted(true); // Ensures document.body is available before portaling
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      setCanNativeShare(true);
    }
  }, []);

  // If not open OR not mounted on the client yet, render nothing
  if (!open || !mounted) return null;

  const url = `${window.location.origin}/events/${eventSlug}`;
  const text = `Check out ${eventTitle} at Srijan 2026!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Copy failed");
    }
  };

  const handleNativeShare = async () => {
    try {
      // Fix: Cast navigator to 'any' here as well
      await (navigator as any).share({
        title: eventTitle,
        text: text,
        url: url,
      });
      onClose();
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Error sharing:", err);
      }
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <MessageCircle size={20} />,
      color: "bg-[#25D366] hover:bg-[#20bd5a]",
      href: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    },
    {
      name: "Twitter / X",
      icon: <Twitter size={20} fill="currentColor" />,
      color: "bg-black border border-white/20 hover:bg-gray-900",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} fill="currentColor" />,
      color: "bg-[#0A66C2] hover:bg-[#0958a8]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    },
    {
      name: "Telegram",
      icon: <Send size={20} className="-ml-0.5" />,
      color: "bg-[#229ED9] hover:bg-[#1e8cc0]",
      href: `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(eventTitle)}`,
    },
    {
      name: "Facebook",
      icon: <Facebook size={20} fill="currentColor" />,
      color: "bg-[#1877F2] hover:bg-[#166fe5]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
    },
    {
      name: "Email",
      icon: <Mail size={20} />,
      color: "bg-gray-600 hover:bg-gray-500",
      href: `mailto:?subject=${encodeURIComponent(
        eventTitle
      )}&body=${encodeURIComponent(text + "\n\n" + url)}`,
    },
  ];

  // Wrap the entire return inside createPortal
  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 font-euclid"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:w-120 bg-[#121212] border border-white/10 sm:rounded-2xl rounded-t-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease-out]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-elnath uppercase tracking-wider text-white">
            Share Event
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 gap-y-6 gap-x-2 mb-8">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:scale-110 ${link.color}`}
              >
                {link.icon}
              </div>
              <span className="text-[10px] sm:text-xs text-gray-400 group-hover:text-white transition-colors text-center">
                {link.name}
              </span>
            </a>
          ))}

          {canNativeShare && (
            <button
              onClick={handleNativeShare}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white transition-transform duration-200 group-hover:scale-110">
                <Share size={20} />
              </div>
              <span className="text-[10px] sm:text-xs text-gray-400 group-hover:text-white transition-colors text-center">
                More Options
              </span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Page Link
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-lg">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-300 px-3 overflow-hidden text-ellipsis whitespace-nowrap"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-white text-black hover:bg-gray-200 active:scale-95"
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body // This tells React to render this into the <body> tag, completely escaping the EventCard
  );
};

export default ShareModal;