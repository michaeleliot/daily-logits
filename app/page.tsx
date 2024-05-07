import Game from "@/components/game";
import { getTodaysGame } from "@/lib/db";

export default async function Home() {
  const {question, answers} = await getTodaysGame()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Game question={question} defaultAnswers={answers} />
    </main>
  );
}

