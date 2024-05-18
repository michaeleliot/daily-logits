import { Answer as AnswerType } from "@/lib/type";
import { useEffect, useState } from "react";

export default function Answers({answers, alreadyPlayed}: {answers: AnswerType[], alreadyPlayed: boolean}) {
  return (
    <div className="flex flex-col gap-5 mt-3 w-full items-center">
      {answers.map((answer, i) => 
        <Answer key={answer.word} answer={answer} alreadyPlayed={alreadyPlayed}/>
      )}
      </div>
  );
}

function Answer({answer, alreadyPlayed}: {answer: AnswerType, alreadyPlayed: boolean}) {
  const [showAnimation, setShowAnimation] = useState(answer.revealed)
  if (answer.failReveal && !alreadyPlayed) {
    setTimeout(() => setShowAnimation(true), 400 * answer.failReveal)
  }

  useEffect(() => {
    if (!alreadyPlayed) {
      setShowAnimation(answer.revealed)
    }
  }, [setShowAnimation, answer.revealed, alreadyPlayed])

  return (<div className={`transition-all ${(showAnimation && !alreadyPlayed) ? "animate-flip" : ""} outline rounded p-3 w-full sm:w-1/2 lg:w-1/5 text-center`}>
    {(showAnimation || alreadyPlayed) ? `${answer.word[0].toUpperCase() + answer.word.slice(1)} ${answer.logit}` : `(${answer.position + 1})`}
  </div>
  )
}
