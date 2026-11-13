"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, DollarSign, IndianRupee } from "lucide-react";

interface NavbarProps {
  currency: "USD" | "INR";
  setCurrency: (c: "USD" | "INR") => void;
  onOpenClaim: () => void;
}

export default function Navbar({ currency, setCurrency, onOpenClaim }: NavbarProps) {
  const pathname = usePathname();
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    let sid = sessionStorage.getItem("cloutivo_sid");
    if (!sid) {
      sid = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem("cloutivo_sid", sid);
    }

    const ping = () => {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sid,
          path: pathname,
          referrer: document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : "",
        }),
      })
        .then((r) => r.json())
        .then((d) => { if (d?.ok) setOnline(d.online); })
        .catch(() => {});
    };

    ping();
    const timer = setInterval(ping, 45_000);
    return () => clearInterval(timer);
  }, [pathname]);

  const navLinks = [
    { label: "Today", href: "/today" },
    { label: "Daily", href: "/daily" },
    { label: "Deals", href: "/deals" },
    { label: "Categories", href: "/categories" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-900 bg-[#000000]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="CLOUTIVO Logo" className="h-8 w-8 rounded-lg object-contain" />
            <span className="font-mono text-lg font-extrabold tracking-tight text-white">CLOUTIVO</span>
          </Link>

          <Link href="/stats" className="hidden md:flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs text-neutral-400 hover:border-neutral-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-medium text-neutral-200">{online === null ? "Live" : `${online} online`}</span>
          </Link>
        </div>

        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${isActive ? "bg-neutral-800 text-white font-semibold" : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"}`}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-950 p-0.5 text-xs">
            <button type="button" onClick={() => setCurrency("USD")} className={`flex items-center gap-0.5 rounded-md px-2 py-1 transition ${currency === "USD" ? "bg-neutral-800 font-bold text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"}`}>
              <DollarSign className="w-3 h-3" /><span>USD</span>
            </button>
            <button type="button" onClick={() => setCurrency("INR")} className={`flex items-center gap-0.5 rounded-md px-2 py-1 transition ${currency === "INR" ? "bg-neutral-800 font-bold text-emerald-400 shadow-sm" : "text-neutral-500 hover:text-neutral-300"}`}>
              <IndianRupee className="w-3 h-3" /><span>INR</span>
            </button>
          </div>
          <button type="button" onClick={onOpenClaim} className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-black transition hover:bg-neutral-200 active:scale-95 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /><span>Claim #1</span>
          </button>
        </div>
      </div>
    </header>
  );
}