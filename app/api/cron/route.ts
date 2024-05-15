import { generateGameForTomorrow } from "@/lib/db";

export async function GET() {
  await generateGameForTomorrow()
 
  return Response.json({ success: true });
}