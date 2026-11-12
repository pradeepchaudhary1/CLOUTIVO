"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 23,
    hours: 4,
    minutes: 58,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 my-6 rounded-xl border border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="flex items-center gap-2 mb-3 sm:mb-0">
        <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
        <span className="text-sm font-medium text-neutral-300">
          Black Friday & Cyber Monday Deals close in:
        </span>
      </div>
      <div className="flex items-center gap-2 font-mono text-lg font-bold text-neutral-100">
        <span className="bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-md">{timeLeft.days}d</span>:
        <span className="bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-md">{timeLeft.hours}h</span>:
        <span className="bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-md">{timeLeft.minutes}m</span>:
        <span className="bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-md text-amber-400">{timeLeft.seconds}s</span>
      </div>
    </div>
  );
}