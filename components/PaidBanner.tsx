"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function Inner() {
  const paid = useSearchParams().get("paid");
  if (!paid) return null;
  return (
    <p className="banner" role="status">
      Payment received. Your rank is updated on this page within a few seconds; refresh if it still shows the old number.
    </p>
  );
}

export default function PaidBanner() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
