"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-900 bg-neutral-950/80 pt-12 pb-24 text-xs text-neutral-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-neutral-800/80 bg-gradient-to-r from-neutral-950 via-[#0d1610] to-neutral-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Need AI Voice Agents, Chatbots or Custom Web Apps?</span>
              <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                Nexus AI Agency
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              Built by Nexus AI Agency — we build autonomous AI agents, websites, and growth automations for startups.
            </p>
          </div>
          <a
            href="https://nexusaiagency.in"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 font-bold text-black text-xs transition active:scale-95 shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hire Nexus AI Agency</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-medium text-neutral-400 pb-8 border-b border-neutral-900">
          <Link href="/rules" className="hover:text-white transition">Rules</Link>
          <Link href="/faq" className="hover:text-white transition">FAQ</Link>
          <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <Link href="/stats" className="hover:text-white transition">Live Stats</Link>
          <Link href="/backlinks" className="text-emerald-400 hover:text-emerald-300 font-semibold transition">
            Backlink Booster
          </Link>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-mono font-bold text-neutral-200">CLOUTIVO</div>
            <p className="mt-1 text-[11px] text-neutral-400">
              The public pay-to-rank leaderboard. Paid listings are marked sponsored.
            </p>
          </div>

          <a
            href="https://submitaitools.org/cloutivo-in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block opacity-90 hover:opacity-100 transition"
          >
            <img
              src="https://submitaitools.org/static_submitaitools/images/submitaitools.png"
              alt="cloutivo.in"
              style={{ borderRadius: "10px", width: "200px", height: "60px" }}
            />
          </a>

          <div className="text-[11px] text-neutral-400">
            © 2026 CLOUTIVO · Built by{" "}
            <a href="https://nexusaiagency.in" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-semibold">
              Nexus AI Agency
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}