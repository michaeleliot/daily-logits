import { getTodaysGame } from "@/lib/db";

export async function GET(request: Request) {
  const { answers } = await getTodaysGame()

  return new Response(JSON.stringify({
    answers: answers
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}