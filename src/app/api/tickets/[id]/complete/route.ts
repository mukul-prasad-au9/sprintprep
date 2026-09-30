import { NextResponse } from "next/server";
import { completeTicket } from "@/lib/services/ticketService";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const ticket = await completeTicket(id);
    return NextResponse.json({ ticket, message: "Ticket marked complete." });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 400 }
    );
  }
}
