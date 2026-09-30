"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** First-time setup redirects to Settings (profile only). */
export default function OnboardingPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/settings");
  }, [router]);

  return (
    <div className="mx-auto max-w-lg py-16 text-center text-sm text-[#6B7280]">
      Opening settings…
    </div>
  );
}
