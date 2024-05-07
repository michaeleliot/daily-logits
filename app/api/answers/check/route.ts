import { getTodaysGame } from "@/lib/db";
import { Answer } from "@/lib/type";

export async function POST(request: Request) {
  const { guess } = await request.json();

  const { answers } = await getTodaysGame()

  const answersObject: {[key: string]: Answer} = {}
  answers.forEach((answer, i) => answersObject[answer.word] = {...answer})

  if (answersObject[guess]) {
    return new Response(JSON.stringify({
      answer: answersObject[guess]
    }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify({
    answer: null
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}