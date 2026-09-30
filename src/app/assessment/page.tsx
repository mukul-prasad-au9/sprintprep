"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Plan is created automatically when profile is saved. */
export default function AssessmentPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="mx-auto max-w-lg py-16 text-center text-sm text-[#6B7280]">
      Redirecting…
    </div>
  );
}
