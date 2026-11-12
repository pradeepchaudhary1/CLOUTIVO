import Link from "next/link";

export default function NotFound() {
  return (
    <div className="prose">
      <h1>That page is not on the board</h1>
      <p>The address may be wrong, or the listing may have been removed.</p>
      <p><Link className="btn btn-accent" href="/">See the leaderboard</Link></p>
    </div>
  );
}
