import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Board from "@/components/Board";
import { getStats, getTop, PAGE_SIZE } from "@/lib/db";
import { toRows } from "@/lib/rows";

export const revalidate = 60;

type P = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { page } = await params;
  const n = Number(page);
  return {
    title: `All-time ranking, page ${Number.isInteger(n) ? n : 1}`,
    description: `Ranks ${(n - 1) * PAGE_SIZE + 1} to ${n * PAGE_SIZE} on the all-time leaderboard.`,
    alternates: { canonical: `/all/${n}` },
  };
}

export default async function AllPage({ params }: P) {
  const { page } = await params;
  const n = Number(page);
  if (!Number.isInteger(n) || n < 1 || n > 1000) notFound();
  if (n === 1) redirect("/");
  const [list, stats] = await Promise.all([getTop({ page: n }), getStats()]);
  if (list.length === 0) notFound();
  const pages = Math.max(1, Math.ceil(stats.listings / PAGE_SIZE));
  return (
    <>
      <h1>All-time ranking, page {n}</h1>
      <p className="lede">Ranks {(n - 1) * PAGE_SIZE + 1} to {(n - 1) * PAGE_SIZE + list.length}.</p>
      <Board rows={toRows(list)} label={`All-time ranking page ${n}`} emptyHint="" />
      <nav className="pager" aria-label="Pagination">
        <Link className="btn btn-ghost" href={n === 2 ? "/" : `/all/${n - 1}`}>Previous</Link>
        {n < pages && <Link className="btn btn-ghost" href={`/all/${n + 1}`}>Next</Link>}
      </nav>
    </>
  );
}
