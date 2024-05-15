import { Answer } from "@/lib/type";

export default function Answers({answers, hasLost}: {answers: Answer[], hasLost: boolean}) {
  return (
    <div className="flex flex-col gap-5 mt-3 w-full items-center">
      {answers.map((answer, i) => 
        <div key={i} className={`transition-all ${answer.revealed || hasLost ? "animate-flip" : ""} outline rounded p-3 w-full sm:w-1/2 lg:w-1/5 text-center`}>
          {answer.revealed || hasLost ? `${answer.word[0].toUpperCase() + answer.word.slice(1)} ${answer.logit}` : `(${i + 1})`}
        </div>
      )}
      </div>
  );
}
