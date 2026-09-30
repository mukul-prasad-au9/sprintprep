"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/** Ticket detail page removed — tickets expand inline as accordions. */
export default function TicketRedirectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/tickets?open=${params.id}`);
  }, [params.id, router]);

  return (
    <div className="mx-auto max-w-lg py-16 text-center text-sm text-[#6B7280]">
      Opening ticket…
    </div>
  );
}
