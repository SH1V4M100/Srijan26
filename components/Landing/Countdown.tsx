"use client";

import { useCountdown } from "@/hooks/useCountDown";
import type { CSSProperties } from "react";

const DateTimeDisplay = ({ value, type }: { value: number; type: string }) => {
  return (
    <div className="text-lg">
      <span className="countdown font-mono text-2xl inline-flex">
        <span
          style={{ "--value": value ?? 0, "--digit": 2 } as CSSProperties}
          aria-live="polite"
          aria-label={`${value ?? 0}`}
        >
          `{value ?? 0}`
        </span>
      </span>
      {type}
    </div>
  );
};

// time is in ms
export const Countdown = ({ targetDate }: { targetDate: number }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  return (
    <div className="flex justify-center items gap-2 p-2">
      <DateTimeDisplay value={days} type={"D"} /> {":"}
      <DateTimeDisplay value={hours} type={"H"} /> {":"}
      <DateTimeDisplay value={minutes} type={"M"} /> {":"}
      <DateTimeDisplay value={seconds} type={"S"} />
    </div>
  );
};
