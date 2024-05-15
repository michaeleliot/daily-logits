import { Answer as AnswerType } from "@/lib/type";
import { useEffect, useState } from "react";

export default function Answers({answers}: {answers: AnswerType[]}) {
  return (
    <div className="flex flex-col gap-5 mt-3 w-full items-center">
      {answers.map((answer, i) => 
        <Answer key={answer.word} answer={answer}/>
      )}
      </div>
  );
}

function Answer({answer}: {answer: AnswerType}) {
  const [showAnimation, setShowAnimation] = useState(answer.revealed)
  if (answer.failReveal) {
    setTimeout(() => setShowAnimation(true), 400 * answer.failReveal)
  }

  useEffect(() => {
    setShowAnimation(answer.revealed)
  }, [setShowAnimation, answer.revealed])

  return (<div className={`transition-all ${showAnimation ? "animate-flip" : ""} outline rounded p-3 w-full sm:w-1/2 lg:w-1/5 text-center`}>
    {showAnimation ? `${answer.word[0].toUpperCase() + answer.word.slice(1)} ${answer.logit}` : `(${answer.position + 1})`}
  </div>
  )
}
